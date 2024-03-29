import { LoadMoreItemsRequest, LoadUserItemsResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:LoadMoreItemsRequest<User>): Promise<LoadUserItemsResponse> => {
  return new LoadUserItemsResponse(true, "", ...await new FollowService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem));
};