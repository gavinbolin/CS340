import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAOProvider } from "../providers/FactoryProvider";
import { User } from "tweeter-shared";

export class FollowDAO implements FollowDAOProvider{
  readonly tableName = "follows";
  readonly index = "follows_index";
  readonly flwrAttr = "follower_handle"; // KEY // INDEX SORT
  readonly flweAttr = "followee_handle"; // SORT // INDEX KEY

  private client:DynamoDBDocumentClient|null = null; 
  constructor(){ this.client = this.getClient(); }

  async create(flwr:string, flwe:string): Promise<void> { //needs: follower_alias, Followee_alias //verify user in users
    const params = { TableName: this.tableName, Item: this.makeItem(flwr, flwe) };
    await this.getClient().send(new PutCommand(params));
  }

  async delete(flwr:string, flwe:string): Promise<void> {
    const params = { TableName: this.tableName, Key: this.makeItem(flwr, flwe) };
    await this.getClient().send(new DeleteCommand(params));
  }

  async isFollower(flwr:string, flwe:string): Promise<boolean>{
    const params = { TableName: this.tableName, Key: this.makeItem(flwr, flwe) };
    const output = await this.getClient().send(new GetCommand(params));
    return output.Item == undefined ? false : true;
  }

  async getPageOfFollowers(flweAlias:string, pageSize:number, lastAlias:string|null): Promise<[string[], boolean]>{
    const params = { 
      TableName: this.tableName,
      IndexName: this.index,
      KeyConditionExpression: "followee_handle = :flwe",
      ExpressionAttributeValues: { ":flwe": flweAlias},
      Limit: pageSize,
      ExclusiveStartKey: lastAlias ? {
        [this.flwrAttr]: lastAlias,
        [this.flweAttr]: flweAlias
      } : undefined
    };
    let aliases: string[] = [];
    let data = await this.getClient().send(new QueryCommand(params));
    let moreItems = data.LastEvaluatedKey !== undefined;
    if (data.Items !== undefined){
      for (const item of data.Items) {  //for (let i=0; data.Items?[i] !== undefined; i++){
        aliases.push(item.follower_handle);
    }}
    return [aliases, moreItems];
  }

  async getPageOfFollowees(flwrAlias:string, pageSize:number, lastAlias:string|null): Promise<[string[], boolean]>{
    const params = { 
      TableName: this.tableName,
      KeyConditionExpression: "follower_handle = :flwr",
      ExpressionAttributeValues: { ":flwr": flwrAlias },
      Limit: pageSize,
      ExclusiveStartKey: lastAlias ? {
        [this.flwrAttr]: flwrAlias,
        [this.flweAttr]: lastAlias
      } : undefined
    };
    let aliases: string[] = [];
    let data = await this.getClient().send(new QueryCommand(params));
    let moreItems = data.LastEvaluatedKey !== undefined 
    if (data.Items !== undefined){
      for (const item of data.Items) {  //for (let i=0; data.Items?[i] !== undefined; i++){
        aliases.push(item.followee_handle);
    }}
    return [aliases, moreItems];
  }

  async getAllFollowers(flweAlias:string): Promise<string[]>{
    const params = { 
      TableName: this.tableName,
      IndexName: this.index,
      KeyConditionExpression: "followee_handle = :flwe",
      ExpressionAttributeValues: { ":flwe": flweAlias},
    };
    let aliases: string[] = [];
    let data = await this.getClient().send(new QueryCommand(params));
    if (data.Items !== undefined){
      for (const item of data.Items) {  //for (let i=0; data.Items?[i] !== undefined; i++){
        aliases.push(item.follower_handle);
    }}
    return aliases;
  }

  private makeItem(flwr:string, flwe:string) {
    return {
      [this.flwrAttr]: flwr,
      [this.flweAttr]: flwe
    }
  }

  private getClient(){
    if (this.client == null) this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    return this.client;
  }
}