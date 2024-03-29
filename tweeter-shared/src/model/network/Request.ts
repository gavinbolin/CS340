import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest{}

// USER SERVICES
export class LoginRequest extends TweeterRequest{
  alias: string;
  password: string;
  constructor(a:string, p:string){
    super();
    this.alias = a;
    this.password = p;
  }
}
export class RegisterRequest extends TweeterRequest{
  firstName:string;
  lastName:string;
  alias:string;
  password:string;
  userImageBytes:Uint8Array;
  constructor(f:string,l:string,a:string,p:string,i:Uint8Array){ //Uint8Array
    super();
    this.firstName = f;
    this.lastName = l;
    this.alias = a;
    this.password = p;
    this.userImageBytes = i;
  }
}
export class LogoutRequest extends TweeterRequest{
  authToken:AuthToken;
  constructor(t:AuthToken){
    super();
    this.authToken = t;
  }
  static toJson(req: LogoutRequest): string {
    interface LogoutRequestJson{
      authToken: User;
    }
    const jsonObject: LogoutRequestJson = req as unknown as LogoutRequestJson;
    const serializedToken = jsonObject.authToken.toJson();
    if (serializedToken === undefined) { throw new Error("AuthenticateResponse, could not serialize token with json:\n" + JSON.stringify(jsonObject.authToken)); }
    return serializedToken;
  }
}
export class GetUserRequest extends TweeterRequest{
  authToken:AuthToken;
  alias:string;
  constructor(t:AuthToken,a:string){
    super();
    this.authToken = t;
    this.alias = a;
  }
}
// STATUS SERVICES
export class LoadMoreItemsRequest<T> extends TweeterRequest{ // lm(Followers / Followees / FeedItems / StoryItems
  token:AuthToken;
  user:User;
  pageSize:number;
  lastItem:T|null;
  constructor(t:AuthToken,u:User,p:number,l:T|null){
    super();
    this.token = t;
    this.user = u;
    this.pageSize = p;
    this.lastItem = l;
  }
}  
export class LoadMoreStatusRequest extends LoadMoreItemsRequest<Status>{
  static fromJson(req:LoadMoreStatusRequest):LoadMoreStatusRequest{
    interface ItemRequestJson {
      token: AuthToken;
      user: User;
      pageSize: number,
      lastItem:Status;
    }
    const jsonObject: ItemRequestJson = req as unknown as ItemRequestJson;
    const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject.token));
    if (deserializedToken === undefined || deserializedToken === null) { throw new Error("AuthenticateResponse, could not deserialize token with json:\n" + JSON.stringify(jsonObject.token)); }
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject.user));
    if (deserializedUser === undefined || deserializedUser === null) { throw new Error("AuthenticateResponse, could not deserialize user with json:\n" + JSON.stringify(jsonObject.user)); }
    const serializedLastItem = Status.fromJson(JSON.stringify(jsonObject.lastItem));
    if (serializedLastItem === null) {throw new Error("AuthenticateResponse, could not deserialize last item with json:\n" + JSON.stringify(jsonObject.user));}
    return new LoadMoreStatusRequest(
      deserializedToken,
      deserializedUser,
      jsonObject.pageSize,
      serializedLastItem,
    );
  }
}
//changed to just items rather than feed and story items 
// export class LoadMoreStoryItems extends TweeterRequest{} lmi
export class PostStatusRequest extends TweeterRequest{
  authToken:AuthToken;
  newStatus:Status;
  constructor(t:AuthToken,n:Status){
    super();
    this.authToken = t;
    this.newStatus = n;
  }
}
// FOLLOW SERVICES
// export class LoadMoreFollowersRequest extends TweeterRequest{} lmi
// export class LoadMoreFolloweesRequest extends TweeterRequest{} lmi
export class GetUserItemRequest extends TweeterRequest{ // getFollowersCount / getFolloweesCount / Follow / Unfollow)
  authToken:AuthToken;
  user:User;
  constructor(t:AuthToken,u:User){
    super();
    this.authToken = t;
    this.user = u;
  }
}
export class InteractWithUserRequest extends TweeterRequest{ // iwu(getIsFollower
  authToken:AuthToken;
  user:User;
  other_user:User;
  constructor(t:AuthToken,u1:User,u2:User){
    super();
    this.authToken = t;
    this.user = u1;
    this.other_user = u2;
  }
}
// export class GetFollowersCountRequest extends TweeterRequest{}
// export class GetFolloweesCountRequest extends TweeterRequest{}
// export class FollowRequest extends TweeterRequest{} 
// export class UnfollowRequest extends TweeterRequest{}