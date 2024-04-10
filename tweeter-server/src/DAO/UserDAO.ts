import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserDAOProvider } from "../providers/FactoryProvider";

export class UserDAO implements UserDAOProvider{
  readonly tableName = "users";
  readonly user_alias = "alias";
  readonly user_fnAttr = "first_name";
  readonly user_lnAttr = "last_name";
  readonly user_urlAttr = "imageUrl";
  readonly user_flwrAttr = "followers";
  readonly user_flweAttr = "followees";
  readonly user_password = "password";

  private client:DynamoDBDocumentClient|null = null; 
  constructor(){ this.client = this.getClient(); }


  async create(item:User, pass:string): Promise<User>{
    const params = { TableName: this.tableName, Item: this.makeItem(item,pass,0,0) } 
    const output = await this.getClient().send(new PutCommand(params));
    if (output === undefined) throw new Error("ERROR CREATING NEW USER:: UNDEF");
    return item;
  }

  async verifyPassword(alias:string, password:string): Promise<boolean>{ // //
    const params = { TableName: this.tableName, Key: {[this.user_alias]: alias} };
    const output = await this.getClient().send(new GetCommand(params));
    if (output.Item !== undefined) { return false; }
    if (output.Item !== password) { return false; }
    else return true;
  }

  async findUserByAlias(alias:string):Promise<User>{
    const params = { TableName: this.tableName, Key: {[this.user_alias]: alias} };
    const output = await this.getClient().send(new GetCommand(params));
    console.log("HERE IS USER::", output); 
    if (output.Item === undefined) throw new Error("ERROR:: UNDEFINED DAO ITEM (FUBA)");
    return new User(
      output.Item.first_name,
      output.Item.last_name,
      output.Item.alias,
      output.Item.imageUrl
  );}

  async getFollowersCount(user: User): Promise<number>{
    const params = { TableName: this.tableName, Key: {[this.user_alias]: user.alias} };
    const output = await this.getClient().send(new GetCommand(params));
    return output.Item === undefined ? -1 : output.Item[this.user_flwrAttr];
  }
  
  async getFolloweesCount(user: User): Promise<number>{
    const params = { TableName: this.tableName, Key: {[this.user_alias]: user.alias} };
    const output = await this.getClient().send(new GetCommand(params));
    return output.Item === undefined ? -1 : output.Item[this.user_flweAttr];
  }

  async changeFlwCount(alias: string, inc_flwr: number, inc_flwe: number): Promise<[number,number]>{
    const params = { // change to two updates, of curr user and given user???
      TableName: this.tableName,
      Key: { [this.user_alias]: alias },
      UpdateExpression: "SET followers = followers + :val1, followees = followees + :val2", // change to all strings
      ExpressionAttributeValues: { ":val1": inc_flwr, ":val2": inc_flwe },
      // ReturnValues: "ALL_NEW"
    };
    const output = await this.getClient().send(new UpdateCommand(params));
    console.log("OUTPUT FOLLOW UPDAT EHERE::",output);
    return [0,0];
    // if (output.Attributes === undefined) throw new Error("ERROR:: INVALID UPDATE (USER FLW COUNT)");
    // return [output.Attributes[this.user_flwrAttr], output.Attributes[this.user_flweAttr]];
  }

  private makeItem(item:User, password:string, flwrD?: number, flweD?: number){
    return {
      [this.user_alias]: item.alias,
      [this.user_fnAttr]: item.firstName,
      [this.user_lnAttr]: item.lastName,
      [this.user_urlAttr]: item.imageUrl,
      [this.user_flwrAttr]: flwrD,
      [this.user_flweAttr]: flweD, 
      [this.user_password]: password
  };}

  private getClient(){
    if (this.client == null) this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    return this.client;
  }
}