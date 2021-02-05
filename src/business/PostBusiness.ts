import PostDatabase from "../data/PostDatabase";
import {
  CreatePostInput,
  FeedByTypeInput,
  FeedByTypeInputDTO,
  FeedInput,
  Post,
  PostComment,
  PostCommentInput,
  PostData,
  PostLikeData,
  PostLikeInput,
  POST_TYPES
} from "../model/Post";
import { CustomError } from "../errors/CustomError";
import idGenerator from "../services/idGenerator";

class PostBusiness {

  public async createPost(
    input:CreatePostInput
  ):Promise<void> {
    try {

      const { photo, description, type, authorId } = input;

      if (!photo || !description) {
        throw new CustomError(406, "'photo' and 'description' must be provided");
      }
      
      const id: string = idGenerator.generateId();
  
      const newPost: Post = new Post(
        id,
        photo,
        description,
        type,
        authorId
      )
  
      await PostDatabase.createPost(newPost);
  
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }
  }

  public async getPostById(
    id:string
  ):Promise<Post> {
    try {
      
      const queryResult: PostData[] = await PostDatabase.getPostById(id);
  
      if (!queryResult[0]) {
        throw new CustomError(404, "Post not found");
      }
  
      const post: Post = new Post(
        queryResult[0].id,
        queryResult[0].photo,
        queryResult[0].description,
        queryResult[0].type,
        queryResult[0].author_id,
        queryResult[0].name,
        queryResult[0].created_at
      );
  
     return post;
  
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }
  }

  public async getFeed(
    input:FeedInput
  ):Promise<Array<Post>> {
    try {
      
      const queryResult: PostData[] = await PostDatabase.getFeed(input);
  
      const posts = queryResult.map(post => (
        new Post(
          post.id,
          post.photo,
          post.description,
          post.type,
          post.author_id,
          post.name,
          post.created_at
        )
      ));

      return posts;
      
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getPostsByType(
    input: FeedByTypeInput
  ):Promise<Array<Post>> {
    try {

      let validType: POST_TYPES = POST_TYPES.NORMAL;

      if (input.type.toUpperCase() === POST_TYPES.EVENT) {
        validType = POST_TYPES.EVENT;
      } else if (input.type.toUpperCase() !== POST_TYPES.NORMAL) {
        throw new CustomError(406, "Invalid post type");
      }

      const inputDTO: FeedByTypeInputDTO = {
        type: validType,
        page: input.page
      };
      
      const queryResult: PostData[] 
        = await PostDatabase.getPostByType(inputDTO);

      const posts = queryResult.map(post => (
        new Post(
          post.id,
          post.photo,
          post.description,
          post.type,
          post.author_id,
          post.name,
          post.created_at
        )
      ));

      return posts;

    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }
  }

  public async toggleLike(
    input: PostLikeInput
  ):Promise<void> {
    try {

      const post: PostData[] = await PostDatabase.getPostById(input.postId);
    
      if (!post[0]) {
        throw new CustomError(404, "Post not found");
      }

      const postLike: PostLikeData = await PostDatabase.getPostLike(input);

      if (!postLike.length) {
        await PostDatabase.likePost(input);
      } else {
        await PostDatabase.dislikePost(input);
      }
      
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }    
  }

  public async commentPost(
    input: PostCommentInput
  ):Promise<void> {
    try {

      const { userId, postId, message } = input;

      if (!message) {
        throw new CustomError(406, "'message' must be provided");
      }

      const post: PostData[] = await PostDatabase.getPostById(postId);
    
      if (!post[0]) {
        throw new CustomError(404, "Post not found");
      }

      const id: string = idGenerator.generateId();

      const newComment: PostComment = {
        id,
        userId,
        postId,
        message
      }

      await PostDatabase.commentPost(newComment);
      
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }
  }

}

export default new PostBusiness();