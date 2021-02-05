export type AuthenticationData = {
  id: string
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string
  ) {}

  public getId = ():string => this.id;
  public getName = ():string => this.name;
  public getEmail = ():string => this.email;
  public getPassword = ():string => this.password;
}

export type CreateUserInput = {
  name: string,
  email: string,
  password: string
}

export type LoginInput = {
  email: string,
  password: string
}

export type UserData = Array<{
  id: string,
  name: string,
  email: string,
  password: string
}>

export type UsersRelationInput = Array<string>

export type UsersRelationData = Array<{
  user_one_id: string,
  user_two_id: string
}>