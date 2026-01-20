import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(400).json({
                error: "Unauthorized!"
            })
        }
        const result = await postService.createPost(req.body, req.user?.id)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Post created failed"
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.getAllPost();
    res.status(200).json(result);  
  } catch (error) {
    res.status(400).json({
      error: "Post get failed",
    });
  }
};
export const PostController = {
    createPost,
    getAllPost,

}