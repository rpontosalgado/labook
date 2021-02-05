import express from "express";
import PostController from "../controller/PostController";

export const postRouter = express.Router();

postRouter.post("/create", PostController.createPost);
postRouter.post("/like/:id", PostController.toggleLike);
postRouter.post("/comment/:id", PostController.commentPost);

postRouter.get("/feed", PostController.getFeed);
postRouter.get("/feed/:type", PostController.getPostsByType);
postRouter.get("/:id", PostController.getPostById);