import {
  FeedByTypeInputDTO,
  FeedInput,
  Post,
  PostComment,
  PostData,
  PostLikeData,
  PostLikeInput
} from "../model/Post";
import BaseDatabase from "./BaseDatabase";
import UserDatabase from "./UserDatabase";

class PostDatabase extends BaseDatabase {

  private static postsTableName: string = "labook_posts";
  private static likesTableName: string = "labook_posts_likes";
  private static commentsTableName: string = "labook_posts_comments";

  public getPostsTableName = ():string => PostDatabase.postsTableName;
  public getLikesTableName = ():string => PostDatabase.likesTableName;
  public getCommentsTableName = ():string => PostDatabase.commentsTableName;

  public async createPost(
    post:Post
  ):Promise<void> {
    try {
      
      await BaseDatabase
        .connection(PostDatabase.postsTableName)
        .insert({
          id: post.getId(),
          photo: post.getPhoto(),
          description: post.getDescription(),
          type: post.getType(),
          author_id: post.getAuthorId()
        });
  
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPostById(
    id:string
  ):Promise<Array<PostData>> {
    try {
      
      const result: PostData[] = await BaseDatabase
        .connection(`${PostDatabase.postsTableName} AS p`)
        .join(
          `${UserDatabase.getUsersTableName()} AS u`,
          'p.author_id',
          'u.id'
        )
        .select('p.*', 'u.name')
        .where({ 'p.id': id });
  
      return result;
  
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getFeed(
    input:FeedInput
  ):Promise<Array<PostData>> {
    try {

      const resultPerPage: number = 5;
      const offset: number = resultPerPage * (input.page - 1);
      
      const result: PostData[] = await BaseDatabase
        .connection(`${PostDatabase.postsTableName} AS p`)
        .leftJoin(
          `${UserDatabase.getFriendsTableName()} AS uf`,
          'p.author_id',
          'uf.user_two_id'
        )
        .join(
          `${UserDatabase.getUsersTableName()} AS u`,
          'p.author_id',
          'u.id'
        )
        .select('p.*', 'u.name')
        .where('uf.user_one_id', input.id)
        .union([
          BaseDatabase.connection(`${PostDatabase.postsTableName} AS p`)
          .leftJoin(
            `${UserDatabase.getFriendsTableName()} AS uf`,
            'p.author_id',
            'uf.user_one_id'
          )
          .join(
            `${UserDatabase.getUsersTableName()} AS u`,
            'p.author_id',
            'u.id'
          )
          .select('p.*', 'u.name')
          .where('uf.user_two_id', input.id)
        ])
        .orderBy('created_at', 'DESC')
        .limit(resultPerPage)
        .offset(offset);
      
      return result;

    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPostByType(
    input: FeedByTypeInputDTO
  ):Promise<Array<PostData>> {
    try {

      const resultPerPage: number = 5;
      const offset: number = resultPerPage * (input.page - 1);
      
      const result: PostData[] = await BaseDatabase
        .connection(PostDatabase.postsTableName)
        .join(
          `${UserDatabase.getUsersTableName()} AS u`,
          'p.author_id',
          'u.id'
        )
        .select('p.*', 'u.name')
        .where({ type: input.type })
        .orderBy('created_at', 'DESC')
        .limit(resultPerPage)
        .offset(offset);

      return result

    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPostLike(
    input: PostLikeInput
  ):Promise<PostLikeData> {
    try {

      const result: PostLikeData = await BaseDatabase
        .connection(PostDatabase.likesTableName)
        .select('*')
        .where({
          post_id: input.postId,
          user_id: input.userId
        });

      return result
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async likePost(
    input: PostLikeInput
  ):Promise<void> {
    try {

      await BaseDatabase
        .connection(PostDatabase.likesTableName)
        .insert({
          post_id: input.postId,
          user_id: input.userId
        })
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async dislikePost(
    input: PostLikeInput
  ):Promise<void> {
    try {

      await BaseDatabase
        .connection(PostDatabase.likesTableName)
        .where({
          post_id: input.postId,
          user_id: input.userId
        })
        .del();
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async commentPost(
    comment:PostComment
  ):Promise<void> {
    try {

      await BaseDatabase
        .connection(PostDatabase.commentsTableName)
        .insert({
          id: comment.id,
          post_id: comment.postId,
          user_id: comment.userId,
          message: comment.message
        })
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

}

export default new PostDatabase();