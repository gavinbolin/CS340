import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TokenDAOProvider } from "../providers/FactoryProvider";
import { AuthToken } from "tweeter-shared";

export class TokenDAO implements TokenDAOProvider {
  readonly tableName = "tokens";
  readonly tokenAttr = "token";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";

  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async create(alias:string): Promise<AuthToken>{
    const token = AuthToken.Generate();
    const params = { 
      TableName: this.tableName, 
      Item: {
        [this.tokenAttr]:token.token, 
        [this.aliasAttr]: alias,
        [this.timestampAttr]:token.timestamp
    }};
    await this.client.send(new PutCommand(params));
    return token;
  }
  
  async read(token:string): Promise<string>{ // returns alias attached to token
    const params = { TableName: this.tableName, Key: {[this.tokenAttr]:token} };
    const output = await this.client.send(new GetCommand(params));
    return output.Item === undefined ? undefined : output.Item[this.aliasAttr];
  }

  async delete(token:string): Promise<void>{
    const params = { TableName: this.tableName, Key: {[this.tokenAttr]:token} };
    await this.client.send(new DeleteCommand(params));
  }
}