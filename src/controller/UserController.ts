import { Request, Response } from "express";
import UserBusiness from "../business/UserBusiness";
import {
  AuthenticationData,
  CreateUserInput,
  LoginInput,
  UsersRelationInput
} from "../model/User";
import authenticator from "../services/authenticator";

class UserController {
  
  public async signup(
    req:Request, res:Response
  ):Promise<void> {
    try {
      
      const input: CreateUserInput = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
  
      const token = await UserBusiness.signup(input);
  
      res
        .status(201)
        .send({
          message: "Success!",
          token
        });
  
    } catch (error) {
      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async login(
    req:Request, res:Response
  ):Promise<void> {
    try {
  
      const input: LoginInput = {
        email: req.body.email,
        password: req.body.password
      };
  
      const token: string = await UserBusiness.login(input);
  
      res.send({
        message: "Success!",
        token
      });
      
    } catch (error) {
      res
        .status(error.statusCode)
        .send({
          message: error.message
        });
    }
  }

  public async toggleFriendUser(
    req:Request, res:Response
  ):Promise<void> {
    try {
      
      const token: string = req.headers.authorization as string;
  
      const tokenData: AuthenticationData = authenticator.getTokenData(token);

      const input: UsersRelationInput = [
        tokenData.id,
        req.params.id
      ];

      await UserBusiness.toggleFriendUser(input);

      res
        .status(200)
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

export default new UserController();