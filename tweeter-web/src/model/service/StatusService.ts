import { AuthToken, User, Status, LoadMoreItemsRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService{
  private facade = new ServerFacade();

  public async loadMoreFeedItems (
    authToken: AuthToken,
    alias: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[(Status|null)[], boolean]> {
    let request = {token:authToken, user:alias, pageSize:pageSize, lastItem:lastItem};
    request = request as unknown as LoadMoreItemsRequest<Status>;
    const response = await this.facade.loadMoreFeedItems(request);

    const items = response.items; 
    const moreItems = response.moreItems;  
    if (items === null || moreItems == null) { throw new Error("Invalid response of Status Items"); }
    return [items, moreItems]; 
  };
      
  public async loadMoreStoryItems (
    authToken: AuthToken,
    alias: User,
    pageSize: number,
    lastItem: (Status|null)
  ): Promise<[(Status|null)[], boolean]> {
    let request = {token:authToken, user:alias, pageSize:pageSize, lastItem:lastItem};
    request = request as unknown as LoadMoreItemsRequest<Status>;
    const loadItemsResponse = await this.facade.loadMoreStoryItems(request);
    
    const items = loadItemsResponse.items; 
    const moreItems = loadItemsResponse.moreItems;  
    if (items === null || moreItems == null) { throw new Error("Invalid response of Status Items"); }
    return [items, moreItems]; 
  };

  public async postStatus( authToken: AuthToken, newStatus: Status ): Promise<void> { 
    let request = {authToken, newStatus};
    request = request as unknown as PostStatusRequest;
    const response = await this.facade.postStatus(request);
    console.log("POST STATUS RESP",response);
    await new Promise((f) => setTimeout(f, 2000));
  };
} 