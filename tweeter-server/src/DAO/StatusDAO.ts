import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, User } from "tweeter-shared";
import { StatusDAOProvider } from "../providers/FactoryProvider";
import { DATA } from "../lambda/DATA";

export class StatusDAO implements StatusDAOProvider {
  readonly storyTableName = "statuses";
  readonly feedTableName = "feed";
  readonly aliasAttr = "alias";          // KEY
  readonly timestampAttr = "time-stamp"; // SORT
  readonly postAttr = "post"; 
  readonly user_fnAttr = "user-firstname";
  readonly user_lnAttr = "user-lastname";
  readonly user_aliasAttr = "user-alias";
  readonly user_urlAttr = "user-image-url";
  // readonly segmentsAttr = "segments";

  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async create(item:Status): Promise<void> {
    const params = { TableName: this.storyTableName, Item: this.makeItem(item, null) } 
    await this.client.send(new PutCommand(params));
  }

  async createF(item:Status, flwr:string): Promise<void> {
    const params = { TableName: this.feedTableName, Item: this.makeItem(item, flwr)}
    await this.client.send(new PutCommand(params));
  }

  async deleteF(ts:number, flwr:string){ // user is the flwr 
    const params = { 
      TableName: this.feedTableName, Key: { [this.aliasAttr]: flwr, [this.timestampAttr]: ts } }
    await this.client.send(new DeleteCommand(params));
  }

  // given current user alias, show statuses from them in order from new/old // ALL POST BY GIVEN USER
  async getStoryPage(alias:string, pageSize:number, lastItem:Status|null): Promise<[Status[], boolean]>{ 
    const params = { 
      TableName: this.storyTableName,
      KeyConditionExpression: "alias = :usr",
      ExpressionAttributeValues: { ":usr": alias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem ? {
        [this.aliasAttr]: alias,
        [this.timestampAttr]: lastItem.timestamp
      } : undefined
    };  
    const data = await this.client.send(new QueryCommand(params));
    let stats:Status[] = [];
    let moreItems = data.LastEvaluatedKey !== undefined;
    if (data.Items !== undefined){
      for (const item of data.Items) {  
        stats.push(
          new Status(
            item[this.postAttr], 
            new User(
              item[this.user_fnAttr],
              item[this.user_lnAttr], 
              item[this.aliasAttr], 
              item[this.user_urlAttr]), 
            item[this.timestampAttr]
    ))}}
    return [stats, moreItems];
  }

  // given main user, gives all followers statuses from new/old // ALL MAINUSER FLWR POST
  async getFeedPage(alias:string,pageSize:number,lastItem:Status|null):Promise<[Status[],boolean]>{
    const params = { 
      TableName: this.feedTableName,
      KeyConditionExpression: "alias = :usr",
      ExpressionAttributeValues: { ":usr": alias },
      Limit: pageSize,
      ExclusiveStartKey: lastItem ? {
        [this.aliasAttr]: alias,
        [this.timestampAttr]: lastItem.timestamp
      } : undefined
    };
    const data = await this.client.send(new QueryCommand(params));
    let stats: Status[] = [];
    let moreItems = data.LastEvaluatedKey !== undefined; // Find where it breaks here!!!
    if (data.Items !== undefined){
      for (const item of data.Items) {  
        stats.push(
          new Status(
            item[this.postAttr], 
            new User(
              item[this.user_fnAttr],
              item[this.user_lnAttr], 
              item[this.user_aliasAttr], 
              item[this.user_urlAttr]), 
            item[this.timestampAttr]
    ))}}
    return [stats, moreItems];
  }

  async updateFeed(alias:string, flwng:string[], add:boolean):Promise<void> {    
    for (let item of flwng){
      const stats:Status[] = (await this.getStoryPage(item,10000,null))[0];
      for (let stat of stats){
        add === true ? await this.createF(stat, alias) : await this.deleteF(stat.timestamp, alias);
      }       
    }
    // DATA.feed = (await this.getFeedPage(alias,10000,null))[0];
  }

  private makeItem(item:Status, flwr?:string|null){
    return {
      [this.aliasAttr]: flwr === null ? item.user.alias : flwr, 
      [this.timestampAttr]: item.timestamp,
      [this.postAttr]: item.post,
      [this.user_fnAttr]: item.user.firstName,
      [this.user_lnAttr]: item.user.lastName,
      [this.user_aliasAttr]: item.user.alias,
      [this.user_urlAttr]: item.user.imageUrl,
      // [this.segmentsAttr]: item.segments
    }
  }
}