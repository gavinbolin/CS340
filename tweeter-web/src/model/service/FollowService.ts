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
    const request:LoadMoreItemsRequest<User> = new LoadMoreItemsRequest<User>(authToken, user, pageSize, lastItem);
    let response = await this.facade.loadMoreFollowers(request);
    const items = response._items;
    const moreItems = response._moreItems
    if (items === null || moreItems == null) { throw new Error("Invalid response of User Items"); }
    return [items, moreItems];
  };
    
  public async loadMoreFollowees (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[(User|null)[], boolean]> {
    const request:LoadMoreItemsRequest<User> = new LoadMoreItemsRequest<User>(authToken,user, pageSize, lastItem);
    let response = await this.facade.loadMoreFollowees(request);
    const items = response._items;
    const moreItems = response._moreItems
    if (items === null || moreItems == null) { throw new Error("Invalid response of User Items"); }
    return [items, moreItems];
  };

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request:InteractWithUserRequest = new InteractWithUserRequest(authToken, user, selectedUser);
    let response = await this.facade.getIsFollowersStatus(request);
    return response._item;
  };

  public async getFollowersCount(authToken: AuthToken, user: User): Promise<number> {
    const request:GetUserItemRequest = new GetUserItemRequest(authToken, user);
    let response = await this.facade.getFollowersCount(request);
    console.log("HERE::GET FOLLOWER STAT", response._item);
    return response._item;
  };

  public async getFolloweesCount(authToken: AuthToken, user: User): Promise<number> {
    const request:GetUserItemRequest = new GetUserItemRequest(authToken, user);
    let response = await this.facade.getFolloweesCount(request);
    return response._item;
  };

  public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((f) => setTimeout(f, 2000)); // Pause so we can see the following message. Remove when connected to the server
    const request : GetUserItemRequest = new GetUserItemRequest(authToken, userToFollow);
    let response = await this.facade.follow(request);
    const followersCount = response._followersCount;
    const followeesCount = response._followeesCount;
    return [followersCount, followeesCount];
  };

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((f) => setTimeout(f, 2000)); // Pause so we can see the unfollowing message. Remove when connected to the server
    const request : GetUserItemRequest = new GetUserItemRequest(authToken, userToUnfollow);
    let response = await this.facade.follow(request);
    const followersCount = response._followersCount;
    const followeesCount = response._followeesCount;
    return [followersCount, followeesCount];
  };
}