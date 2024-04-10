import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";

export interface FactoryProvider {
  createFollowDAO(): FollowDAOProvider;
  createStatusDAO(): StatusDAOProvider;
  createUserDAO(): UserDAOProvider;
  createTokenDAO(): TokenDAOProvider;
  createS3DAO(): S3DAOProvider;
}

export interface FollowDAOProvider{
  create(flwr:string,flwe:string):Promise<void>;
  delete(flwr:string,flwe:string):Promise<void>;
  isFollower(flwr:string,flwe:string):Promise<boolean>;
  getPageOfFollowers(flweAlias:string,pageSize:number,lastAlias:string|null): Promise<[string[],boolean]>;
  getPageOfFollowees(flwrAlias:string,pageSize:number,lastAlias:string|null): Promise<[string[],boolean]>;
  getAllFollowers(flweAlias:string): Promise<string[]>;
}

export interface StatusDAOProvider{
  create(item:Status):Promise<void>;
  createF(item:Status,flwr:string):Promise<void>;
  getStoryPage(alias:string,pageSize:number,lastItem:Status|null):Promise<[Status[],boolean]>;
  getFeedPage(alias:string,pageSize:number,lastItem:Object|null):Promise<[Status[],boolean]>;
  updateFeed(alias:string,flwrs:string[], add:boolean):Promise<void>;
}

export interface UserDAOProvider{
  create(item:Object,pass:string):Promise<Object>;
  verifyPassword(alias:string,hashed_password:string):Promise<boolean>;
  findUserByAlias(alias:string):Promise<Object>;
  // findAliasByUser(user:Object):Promise<string>;
  getFollowersCount(user:Object):Promise<number>;
  getFolloweesCount(user:Object):Promise<number>;
  changeFlwCount(alias:string,inc_flwr:number,inc_flwe:number):Promise<[number,number]>;
}

export interface TokenDAOProvider{
  create(item:Object):Promise<Object>;
  read(alias:string):Promise<string>;
  delete(token:string):Promise<void>;
}

export interface S3DAOProvider{
  putImage(fileName:string,imageStringBase64Encoded:string):Promise<string>;
}