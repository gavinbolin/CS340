import { User } from "../domain/User";
import { Status } from "../domain/Status";
import { AuthToken } from "../domain/AuthToken";

interface ResponseJson {
  _success: boolean;
  _message: string;
}

// BASE // POST STUATUS & LOGOUT
export class TweeterResponse {
  readonly _success: boolean;
  readonly _message: string | null;
  constructor(success: boolean, message: string | null = null) {
    this._success = success;
    this._message = message;
  }
  get success() { return this._success; }
  get message() { return this._message; }

  static fromJson(res: TweeterResponse): TweeterResponse {
    const jsonObject: ResponseJson = res as unknown as ResponseJson;
    return new TweeterResponse(
      jsonObject._success,
      jsonObject._message,
    );
  }
}

// LOGIN & REGISTER
export class AuthenticateResponse extends TweeterResponse { // login and register
  readonly _user: User;
  readonly _token: AuthToken;

  constructor(
    success: boolean,
    message: string | null = null,
    user: User,
    token: AuthToken,
  ) {
    super(success, message);
    this._user = user;
    this._token = token;
  }
  get user() { return this._user; }
  get token() { return this._token; }

  static fromJson(res: AuthenticateResponse): AuthenticateResponse {
    interface AuthenticateResponseJson extends ResponseJson {
      _user: User;
      _token: AuthToken;
    }
    const jsonObject: AuthenticateResponseJson = res as unknown as AuthenticateResponseJson;

    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    if (deserializedUser === undefined || deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }
    const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._token));
    if (deserializedToken === undefined || deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject._token)
      );
    }
    return new AuthenticateResponse(
      jsonObject._success,
      jsonObject._message,
      deserializedUser,
      deserializedToken,
    );
  }
}

// GET USER RESPONSE
export class GetUserResponse extends TweeterResponse {
  readonly _user: User|null;
  constructor(success:boolean, message:string, user:User|null){
    super(success, message);
    this._user = user; //User.fromDTO(user) for using regular user object
  }
  get user() { return this._user; }

  static fromJson(res: GetUserResponse): GetUserResponse {
    interface GetUserResponseJson extends ResponseJson {
      _user: User;
    }
    const jsonObject: GetUserResponseJson = res as unknown as GetUserResponseJson;

    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    if (deserializedUser === undefined) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }
    return new GetUserResponse(
      jsonObject._success,
      jsonObject._message,
      deserializedUser,
    );
  }
}

// PARENT CLASS FOR PAGED ITEMS
export class LoadMoreItemsResponse<T> extends TweeterResponse{
  _items: T[];
  _moreItems: boolean;
  constructor(success:boolean, message:string, items:T[], x:boolean){
    super(success, message);
    this._items = items;
    this._moreItems = x;
  }
  get items() { return this._items; }
  get moreItems() { return this._moreItems; }
}

// LOAD MORE FEED ITEMS & LOAD MORE STORY ITEMS
export class LoadStatusItemsResponse extends LoadMoreItemsResponse<Status>{
  static fromJson(res: LoadStatusItemsResponse): LoadStatusItemsResponse {
    console.log("RES BEFORE ANYTHING", JSON.stringify(res));
    interface itemResponseJson extends ResponseJson { //error using T in static method
      _items: (Status|null)[];  
      _moreItems: boolean;
    }
    const jsonObject: itemResponseJson = res as unknown as itemResponseJson;
    console.log("JSON OBJ::",jsonObject);
    let deserializedItems = []; //jsonObject._items
    for (let i = 0; i < jsonObject._items.length; i++){
      let status = Status.fromJson(JSON.stringify(jsonObject._items[i]));
      if(status !== null){ deserializedItems[i] = status; }
    }
    // const filteredStatusArray: Status[] = deserializedItems.filter((status: Status | null): status is Status => status !== null);
      // .map((item) => Status.fromJson(JSON.stringify(item)))
      // .filter((item): item is Status => item !== null);
    console.log("STORY HERE::", deserializedItems);
    if (deserializedItems === null) { throw new Error("AuthenticateResponse, could not deserialize user with json:\n" + JSON.stringify(jsonObject._items)); }
    return new LoadStatusItemsResponse(
      jsonObject._success,
      jsonObject._message,
      deserializedItems, //deserializedItems
      jsonObject._moreItems,
    );
  }
}; // feed and story items

// LOAD MORE FOLLOWERS & LOAD MORE FOLLOWEES
export class LoadUserItemsResponse extends LoadMoreItemsResponse<User>{
  static fromJson(res: LoadUserItemsResponse): LoadUserItemsResponse {
    interface itemResponseJson extends ResponseJson { //error using T in static method
      _items: (User|null)[];
      _moreItems: boolean;
    }
    const jsonObject: itemResponseJson = res as unknown as itemResponseJson;
    const deserializedItems = jsonObject._items
      .map((item) => User.fromJson(JSON.stringify(item)))
      .filter((item): item is User => item !== null);
    if (deserializedItems === null) { throw new Error("AuthenticateResponse, could not deserialize user with json:\n" + JSON.stringify(jsonObject._items)); }
    return new LoadUserItemsResponse(
      jsonObject._success,
      jsonObject._message,
      deserializedItems, //deserializedItems
      jsonObject._moreItems,
    );
  }
}; // follower and followee items

// GET IS FOLLOWER STATUS & GET FOLLOWER COUNT & GET FOLLOWEE COUNT
export class GetPrimitiveResponse extends TweeterResponse{
  readonly _item: any;
  constructor(success:boolean, message:string, item:any){
    super(success, message);
    this._item = item; //User.fromDTO(user) for using regular user object
  }
  get item() { return this._item; }

  static fromJson(res: GetPrimitiveResponse): GetPrimitiveResponse {
    interface itemResponseJson extends ResponseJson { _item: any; }
    const jsonObject: itemResponseJson = res as unknown as itemResponseJson;
    return new GetPrimitiveResponse(
      jsonObject._success,
      jsonObject._message,
      jsonObject._item,
    );
  }
}; // getFollower/Followee count / getIsFollowerStatus

// FOLLOW & UNFOLLOW
export class FollowResponse extends TweeterResponse{
  readonly _followersCount: number;
  readonly _followeesCount: number;
  constructor(success:boolean, message:string, f1:number, f2:number){
    super(success, message);
    this._followersCount = f1; //User.fromDTO(user) for using regular user object
    this._followeesCount = f2;
  }
  get followersCount() { return this._followersCount; }
  get followeesCount() { return this._followeesCount; }

  static fromJson(res: FollowResponse): FollowResponse {
    interface itemResponseJson extends ResponseJson { 
      _followersCount: number; 
      _followeesCount: number;
    }
    const jsonObject: itemResponseJson = res as unknown as itemResponseJson;
    return new FollowResponse(
      jsonObject._success,
      jsonObject._message,
      jsonObject._followersCount,
      jsonObject._followeesCount,
    );
  }
};