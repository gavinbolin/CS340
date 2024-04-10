import { LoadStatusItemsResponse, LoadStatusRequest } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<LoadStatusItemsResponse> => {
  const request = LoadStatusRequest.fromJson(event); 
  return new LoadStatusItemsResponse(true, "", 
  ...await DATA.statusService.loadMoreStoryItems(
    request.pageSize, 
    request.lastItem,
    request.token,
    request.user
  )); //? Status.fromJson(event.lastItem as unknown as string): null)); 
};