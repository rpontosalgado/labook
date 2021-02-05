import { CustomError } from "../errors/CustomError";
import { formatDateTime } from "../utils/handleDate";

export enum POST_TYPES {
  NORMAL = "NORMAL",
  EVENT = "EVENT"
}

export class Post {
  private type: POST_TYPES;
  private createdAt?: string;

  constructor(
    private id: string,
    private photo: string,
    private description: string,
    type: string,
    private authorId: string,
    private authorName?: string,
    createdAt?: Date
  ) {
    if (!type || type.toUpperCase() === POST_TYPES.NORMAL) {
      this.type = POST_TYPES.NORMAL;
    } else if (type.toUpperCase() === POST_TYPES.EVENT) {
      this.type = POST_TYPES.EVENT;
    } else {
      throw new CustomError(406, "Invalid post type");
    }

    if (createdAt) {
      this.createdAt = formatDateTime(createdAt);
    }
  }

  public getId = () => this.id;
  public getPhoto = () => this.photo;
  public getDescription = () => this.description;
  public getType = () => this.type;
  public getAuthorId = () => this.authorId;
  public getauthorName = () => this.authorName;
  public getCreatedAt = () => this.createdAt;
}

export type CreatePostInput = {
  photo: string,
  description: string,
  type: string,
  authorId: string
}

export type CreatePostData = {
  id: string,
  photo: string,
  description: string,
  type: string,
  authorId: string
}

export type PostData = {
  id: string,
  photo: string,
  description: string,
  type: string,
  created_at: Date,
  author_id: string,
  name: string
}

export type FeedInput = {
  id: string,
  page: number
}

export type FeedByTypeInput = {
  type: string,
  page: number
}
export type FeedByTypeInputDTO = {
  type: POST_TYPES,
  page: number
}

export type PostLikeInput = {
  userId: string,
  postId: string
}

export type PostLikeData = Array<{
  user_id: string,
  post_id: string
}>

export type PostCommentInput = {
  userId: string,
  postId: string,
  message: string
}

export type PostComment = {
  id: string,
  userId: string,
  postId: string,
  message: string
}