import { LoadStatusItemsResponse, LoadMoreItemsRequest, Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { LoadMoreStatusRequest } from "tweeter-shared/dist/model/network/Request";

export const handler = async (event:LoadMoreItemsRequest<Status>): Promise<LoadStatusItemsResponse> => {
  // console.log("HERE:: HANDLER EVENT", event.lastItem as unknown as string);
  // console.log("STORY FROM JSON::", Status.fromJson(event.lastItem as unknown as string));
  // console.log("EVENT BEFORE::",event);
  // event = LoadMoreStatusRequest.fromJson(event);
  // console.log("EVENT TOKEN::",JSON.stringify(event.token));
  console.log("EVENT USER::",event.user);
  console.log("EVENT PAGESIZE::",event.pageSize);
  console.log("EVENT LASTITEM::",event.lastItem);
  return new LoadStatusItemsResponse(true, "", 
  ...await new StatusService().loadMoreStoryItems(
    event.token, 
    event.user, 
    event.pageSize, 
    event.lastItem //? Status.fromJson(event.lastItem as unknown as string): null
  )); 
};