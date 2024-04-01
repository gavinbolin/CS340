import { LoadStatusItemsResponse, LoadMoreItemsRequest, LoadStatusRequest, Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event:JSON): Promise<LoadStatusItemsResponse> => {
  const request = LoadStatusRequest.fromJson(event); 
  console.log("LAST ITEM STRINGIFIED:: ",request.lastItem);
  if (request == null || request == undefined){  console.log("BROKE BROKE BROKE");  }
  return new LoadStatusItemsResponse(true, "", 
  ...await new StatusService().loadMoreStoryItems(
    request.pageSize, 
    request.lastItem
  )); //? Status.fromJson(event.lastItem as unknown as string): null)); 
};