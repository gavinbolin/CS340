import { AuthToken, User, Status, LoadMoreItemsRequest, FakeData, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService{
  private facade = new ServerFacade();

  public async loadMoreFeedItems (
    authToken: AuthToken,
    alias: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[(Status|null)[], boolean]> {
    const loadItemsRequest:LoadMoreItemsRequest<Status> = new LoadMoreItemsRequest<Status>(authToken, alias, pageSize, lastItem);
    let loadItemsResponse = await this.facade.loadMoreFeedItems(loadItemsRequest);

    const items = loadItemsResponse._items; 
    const moreItems = loadItemsResponse._moreItems;  
    if (items === null || moreItems == null) { throw new Error("Invalid response of Status Items"); }
    return [items, moreItems]; 
  };
      
  public async loadMoreStoryItems (
    authToken: AuthToken,
    alias: User,
    pageSize: number,
    lastItem: (Status|null)
  ): Promise<[(Status|null)[], boolean]> {
    const loadItemsRequest:LoadMoreItemsRequest<Status> = new LoadMoreItemsRequest<Status>(authToken, alias, pageSize, lastItem);
    let loadItemsResponse = await this.facade.loadMoreStoryItems(loadItemsRequest);

    const items = loadItemsResponse._items; 
    const moreItems = loadItemsResponse._moreItems;  
    if (items === null || moreItems == null) { throw new Error("Invalid response of Status Items"); }
    return [items, moreItems]; 
  };

  public async postStatus( authToken: AuthToken, newStatus: Status ): Promise<void> { 
    const postStatusRequest:PostStatusRequest = new PostStatusRequest(authToken, newStatus);
    let postStatusResponse = await this.facade.postStatus(postStatusRequest);
    console.log(postStatusResponse);
    await new Promise((f) => setTimeout(f, 2000));
};
} 