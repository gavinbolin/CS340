import { TweeterResponse, AuthenticateResponse, GetUserResponse, LoginRequest, RegisterRequest, GetUserRequest, LogoutRequest, LoadMoreItemsRequest, Status, LoadStatusItemsResponse, PostStatusRequest, User, LoadUserItemsResponse, InteractWithUserRequest, GetPrimitiveResponse, GetUserItemRequest, FollowResponse } from "tweeter-shared";  //, GetUserResponse
import { ClientCommunicator } from "./ClientCommunicator";
import { LoadMoreStatusRequest } from "tweeter-shared/dist/model/network/Request";

export class ServerFacade {
  private SERVER_URL = "https://4oe31ik4v6.execute-api.us-west-1.amazonaws.com/dev"; //???
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // USER SERVICES
  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/login";
    const response = await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint);
    return AuthenticateResponse.fromJson(response);
  }
  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/register";
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    return AuthenticateResponse.fromJson(response);
  }
  async logout(request: LogoutRequest): Promise<TweeterResponse> {
    const endpoint = "/logout";
    const response = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, endpoint);
    return TweeterResponse.fromJson(response);
  }
  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "/get-user";
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    // console.log("HERE::", GetUserResponse.fromJson(response));
    return GetUserResponse.fromJson(response);
  }

  // STATUS SERVICES
  async loadMoreFeedItems(request: LoadMoreItemsRequest<Status>): Promise<LoadStatusItemsResponse> {
    const endpoint = "/loadMoreFeedItems";
    const response = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>, LoadStatusItemsResponse>(request, endpoint);
    return LoadStatusItemsResponse.fromJson(response); 
  }
  async loadMoreStoryItems(request: LoadMoreItemsRequest<Status>): Promise<LoadStatusItemsResponse> {
    console.log("HERERE STORY REQUEST::",request);
    const endpoint = "/loadMoreStoryItems";
    const response = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>, LoadStatusItemsResponse>(request, endpoint);
    console.log("HERE STORY RESPONSE ::",response);
    return LoadStatusItemsResponse.fromJson(response);
  }
  async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
    const endpoint = "/postStatus";
    console.log("HERE POST STAT REQ::", request);
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    console.log("HERE POST STAT RES::", response);
    return TweeterResponse.fromJson(response);
  }

  // FOLLOW SERVICES 
  async loadMoreFollowers(request: LoadMoreItemsRequest<User>): Promise<LoadUserItemsResponse> {
    console.log("HERERE FOL REQ::",request);  
    const endpoint = "/getMoreFollowers";
    const response = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>, LoadUserItemsResponse>(request, endpoint);
    console.log("HERE FOLLOWER ITEMS::",response);
    return LoadUserItemsResponse.fromJson(response); 
  }
  async loadMoreFollowees(request: LoadMoreItemsRequest<User>): Promise<LoadUserItemsResponse> {
    const endpoint = "/getMoreFollowees";
    const response = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>, LoadUserItemsResponse>(request, endpoint);
    return LoadUserItemsResponse.fromJson(response); 
  }
  async getIsFollowersStatus(request: InteractWithUserRequest): Promise<GetPrimitiveResponse> {
    const endpoint = "/getIsFollower";
    const response = await this.clientCommunicator.doPost<InteractWithUserRequest, GetPrimitiveResponse>(request, endpoint);
    return GetPrimitiveResponse.fromJson(response);
  }
  async getFollowersCount(request: GetUserItemRequest): Promise<GetPrimitiveResponse> {
    const endpoint = "/getFollowersCount";
    const response = await this.clientCommunicator.doPost<GetUserItemRequest, GetPrimitiveResponse>(request, endpoint);
    return GetPrimitiveResponse.fromJson(response);
  }
  async getFolloweesCount(request: GetUserItemRequest): Promise<GetPrimitiveResponse> {
    const endpoint = "/getFolloweesCount";
    const response = await this.clientCommunicator.doPost<GetUserItemRequest, GetPrimitiveResponse>(request, endpoint);
    return GetPrimitiveResponse.fromJson(response);
  }
  async follow(request: GetUserItemRequest): Promise<FollowResponse> {
    const endpoint = "/follow";
    const response = await this.clientCommunicator.doPost<GetUserItemRequest, FollowResponse>(request, endpoint);
    return FollowResponse.fromJson(response);
  }
  async unfollow(request: GetUserItemRequest): Promise<FollowResponse> {
    const endpoint = "/unfollow";
    const response = await this.clientCommunicator.doPost<GetUserItemRequest, FollowResponse>(request, endpoint);
    return FollowResponse.fromJson(response);
  }
}