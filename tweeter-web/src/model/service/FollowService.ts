import { AuthToken, User, InteractWithUserRequest, GetUserItemRequest, LoadMoreItemsRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private facade = new ServerFacade();

  public async loadMoreFollowers (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[(User|null)[], boolean]> {
    let request:LoadMoreItemsRequest<User> = {token:authToken, user:user, pageSize:pageSize, lastItem:lastItem};
    request = request as unknown as LoadMoreItemsRequest<User>;
    const response = await this.facade.loadMoreFollowers(request);
    
    const items = response.items;
    const moreItems = response.moreItems
    if (items === null || moreItems == null) { throw new Error("Invalid response of User Items"); }
    return [items, moreItems];
  };
    
  public async loadMoreFollowees (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[(User|null)[], boolean]> {
    let request:LoadMoreItemsRequest<User> = {token:authToken, user:user, pageSize:pageSize, lastItem:lastItem};
    request = request as unknown as LoadMoreItemsRequest<User>; 
    let response = await this.facade.loadMoreFollowees(request);
    
    const items = response.items;
    const moreItems = response.moreItems
    if (items === null || moreItems == null) { throw new Error("Invalid response of User Items"); }
    return [items, moreItems];
  };

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request:InteractWithUserRequest = {authToken:authToken, user:user, other_user:selectedUser};
    let response = await this.facade.getIsFollowersStatus(request);
    return response.item;
  };

  public async getFollowersCount(authToken: AuthToken, user: User): Promise<number> {
    const request:GetUserItemRequest = {authToken:authToken, user:user};
    let response = await this.facade.getFollowersCount(request);
    console.log("HERE::GET FOLLOWER STAT", response.item);
    return response.item;
  };

  public async getFolloweesCount(authToken: AuthToken, user: User): Promise<number> {
    const request:GetUserItemRequest = {authToken:authToken, user:user};
    let response = await this.facade.getFolloweesCount(request);
    return response.item;
  };

  public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((f) => setTimeout(f, 2000)); // Pause so we can see the following message. Remove when connected to the server
    const request : GetUserItemRequest = {authToken:authToken, user:userToFollow};
    let response = await this.facade.follow(request);
    const followersCount = response.followersCount;
    const followeesCount = response.followeesCount;
    return [followersCount, followeesCount];
  };

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((f) => setTimeout(f, 2000)); // Pause so we can see the unfollowing message. Remove when connected to the server
    const request : GetUserItemRequest = {authToken:authToken, user:userToUnfollow};
    let response = await this.facade.follow(request);
    const followersCount = response.followersCount;
    const followeesCount = response.followeesCount;
    return [followersCount, followeesCount];
  };
}
