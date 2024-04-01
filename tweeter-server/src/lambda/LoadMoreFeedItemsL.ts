import { LoadStatusItemsResponse, LoadStatusRequest } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event:JSON): Promise<LoadStatusItemsResponse> => {
  const request = LoadStatusRequest.fromJson(event); 
  return new LoadStatusItemsResponse(true, "", 
  ...await new StatusService().loadMoreFeedItems( 
    request.pageSize, 
    request.lastItem
  )); //? Status.fromJson(event.lastItem as unknown as string): null));
};