import { LoadStatusItemsResponse, LoadMoreItemsRequest, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event:LoadMoreItemsRequest<Status>): Promise<LoadStatusItemsResponse> => {
  return new LoadStatusItemsResponse(true, "", ...await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem ? Status.fromJson(event.lastItem as unknown as string): null));
};