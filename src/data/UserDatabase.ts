import {
  User,
  UserData,
  UsersRelationData,
  UsersRelationInput
} from "../model/User";
import BaseDatabase from "./BaseDatabase";

class UserDatabase extends BaseDatabase {

  private static UsersTableName: string = "labook_users";
  private static FriendsTableName: string = "labook_users_friends";

  public getUsersTableName = ():string => UserDatabase.UsersTableName;
  public getFriendsTableName = ():string => UserDatabase.FriendsTableName;

  public async signup(
    user:User
  ):Promise<void> {
    try {

      await BaseDatabase
        .connection(UserDatabase.UsersTableName)
        .insert({
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          password: user.getPassword()
        });

    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(
    email: string
  ):Promise<UserData> {
    try {

      const result = await BaseDatabase
        .connection(UserDatabase.UsersTableName)
        .select("*")
        .where({ email });
      
      return result;

    } catch (error) {
      throw new Error(error.slqMessage || error.message);
    }
  }

  public async getUsersRelation(
    usersIds:UsersRelationInput
  ):Promise<UsersRelationData> {
    try {

      const result = await BaseDatabase
        .connection(UserDatabase.FriendsTableName)
        .select("*")
        .where({
          user_one_id: usersIds[0],
          user_two_id: usersIds[1]
        });
      
      return result;

    } catch (error) {
      throw new Error(error.slqMessage || error.message);
    }
  }

  public async friendUser(
    usersIds:UsersRelationInput
  ):Promise<void> {
    try {
      
      await BaseDatabase
        .connection(UserDatabase.FriendsTableName)
        .insert({
          user_one_id: usersIds[0],
          user_two_id: usersIds[1]
        });

    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async unfriendUser(
    usersIds:UsersRelationInput
  ):Promise<void> {
    try {
      
      await BaseDatabase
        .connection(UserDatabase.FriendsTableName)
        .where({
          user_one_id: usersIds[0],
          user_two_id: usersIds[1]
        })
        .del();

    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

}

export default new UserDatabase();