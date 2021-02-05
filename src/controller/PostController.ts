import { Request, Response } from "express";
import PostBusiness from "../business/PostBusiness";
import {
  CreatePostInput,
  FeedByTypeInput,
  FeedInput,
  Post,
  PostCommentInput,
  PostLikeInput
} from "../model/Post";
import { AuthenticationData } from "../model/User";
import authenticator from "../services/authenticator";
import { formatDateTime } from "../utils/handleDate";

class PostController {

  public async createPost(
    req:Request, res: Response
  ):Promise<void> {
    try {
  
      const token: string = req.headers.authorization as string;
  
      const tokenData: AuthenticationData = authenticator.getTokenData(token);
      
      const input: CreatePostInput = {
        photo: req.body.photo,
        description: req.body.description,
        type: req.body.type,
        authorId: tokenData.id
      };
  
      await PostBusiness.createPost(input);
  
      res
        .status(201)
        .send({
          message: "Success!"
        });
  
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (
        error.message === "jwt must be provided" ||
        error.message === "jwt malformed" ||
        error.message === "jwt expired" ||
        error.message === "invalid token"
      ) {
        error.statusCode = 401;
        error.message = "Invalid credentials"
      }

      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async getPostById(
    req:Request, res:Response
  ):Promise<void> {
    try {
      
      const { id } = req.params;
  
      const post: Post = await PostBusiness.getPostById(id);
  
      res.send({
        message: "Success",
        post
      });
  
    } catch (error) {
      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async getFeed(
    req:Request, res:Response
  ):Promise<void> {
    try {
      
      const token: string = req.headers.authorization as string;
  
      const tokenData: AuthenticationData = authenticator.getTokenData(token);

      const input: FeedInput = {
        id: tokenData.id,
        page: Number(req.query.page) <= 0 ? 1 : Number(req.query.page) || 1
      };

      const posts = await PostBusiness.getFeed(input);

      res
        .status(200)
        .send({
          message: "Success!",
          posts
        })

    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (
        error.message === "jwt must be provided" ||
        error.message === "jwt malformed" ||
        error.message === "jwt expired" ||
        error.message === "invalid token"
      ) {
        error.statusCode = 401;
        error.message = "Invalid credentials"
      }

      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async getPostsByType(
    req:Request, res:Response
  ):Promise<void> {
    try {
      
      const token: string = req.headers.authorization as string;
  
      authenticator.getTokenData(token);
      
      const input: FeedByTypeInput = {
        type: req.params.type,
        page: Number(req.query.page) <= 0 ? 1 : Number(req.query.page) || 1
      };

      const posts = await PostBusiness.getPostsByType(input);

      res
        .status(200)
        .send({
          message: "Success!",
          posts
        })

    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (
        error.message === "jwt must be provided" ||
        error.message === "jwt malformed" ||
        error.message === "jwt expired" ||
        error.message === "invalid token"
      ) {
        error.statusCode = 401;
        error.message = "Invalid credentials"
      }

      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async toggleLike(
    req:Request, res:Response
  ):Promise<void> {
    try {

      const token: string = req.headers.authorization as string;
  
      const tokenData: AuthenticationData = authenticator.getTokenData(token);

      const input: PostLikeInput = {
        userId: tokenData.id,
        postId: req.params.id
      }

      await PostBusiness.toggleLike(input)

      res
        .status(200)
        .send({
          message: "Success!",
        })
      
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (
        error.message === "jwt must be provided" ||
        error.message === "jwt malformed" ||
        error.message === "jwt expired" ||
        error.message === "invalid token"
      ) {
        error.statusCode = 401;
        error.message = "Invalid credentials"
      }

      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async commentPost(
    req:Request, res:Response
  ):Promise<void> {
    try {

      const token: string = req.headers.authorization as string;
  
      const tokenData: AuthenticationData = authenticator.getTokenData(token);

      const input: PostCommentInput = {
        userId: tokenData.id,
        postId: req.params.id,
        message: req.body.message
      }

      await PostBusiness.commentPost(input)

      res
        .status(201)
        .send({
          message: "Success!"
        });
      
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (
        error.message === "jwt must be provided" ||
        error.message === "jwt malformed" ||
        error.message === "jwt expired" ||
        error.message === "invalid token"
      ) {
        error.statusCode = 401;
        error.message = "Invalid credentials"
      }

      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

}

export default new PostController();