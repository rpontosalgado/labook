import UserDatabase from "../data/UserDatabase";
import {
  CreateUserInput,
  LoginInput,
  User,
  UserData,
  UsersRelationData,
  UsersRelationInput
} from "../model/User";
import { CustomError } from "../errors/CustomError";
import authenticator from "../services/authenticator";
import hashManager from "../services/hashManager";
import idGenerator from "../services/idGenerator";

class UserBusiness {
  
  public async signup(
    input: CreateUserInput
  ):Promise<string> {
    try {
      
      const { name, email, password } = input;
  
      if (!name || !email || !password) {
        throw new CustomError(
          406,
          "'name', 'email' and 'password' must be provided"
        );
      }
  
      const id: string = idGenerator.generateId();
  
      const cypherPassword = await hashManager.hash(password);
  
      const newUser: User = new User(
        id,
        name,
        email,
        cypherPassword
      );
  
      await UserDatabase.signup(newUser);
  
      const token: string = authenticator.generateToken({ id });
  
      return token;
  
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      if (error.message.includes("Duplicate entry")) {
        error.statusCode = 409;
        error.message = "'email' already registered"
      }

      throw new CustomError(
        error.statusCode,
        error.message
      );
    }
  }

  public async login(
    input:LoginInput
  ):Promise<string> {
    try {
      
      const { email, password } = input;
  
      if (!email || !password) {
        throw new CustomError(
          406,
          "'email' and 'password' must be provided"
        );
      }
  
      const queryResult: UserData = await UserDatabase.getUserByEmail(email);
  
      if (!queryResult[0]) {
        throw new CustomError(401, "Invalid credentials");
      }
  
      const user: User = new User(
        queryResult[0].id,
        queryResult[0].name,
        queryResult[0].email,
        queryResult[0].password
      );
  
      const passwordIsCorrect: boolean = await hashManager.compare(
        password,
        user.getPassword()
      );
  
      if (!passwordIsCorrect) {
        throw new CustomError(401, "Invalid credentials");
      }
  
      const token: string = authenticator.generateToken({
        id: user.getId()
      });
  
      return token;
  
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

  public async toggleFriendUser(
    input:UsersRelationInput
  ):Promise<void> {
    try {

      if (input[0] === input[1]) {
        throw new CustomError(406, "Different 'id' must be provided")
      }

      input.sort();

      const usersRelation: UsersRelationData 
        = await UserDatabase.getUsersRelation(input);

      if (!usersRelation.length) {
        await UserDatabase.friendUser(input);
      } else {
        await UserDatabase.unfriendUser(input);
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

}

export default new UserBusiness();