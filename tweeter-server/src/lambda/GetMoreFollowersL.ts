import { LoadUserItemsResponse, LoadUserRequest, User } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<LoadUserItemsResponse> => {
  const request = LoadUserRequest.fromJson(event);
  return new LoadUserItemsResponse(true, "", ...await DATA.followService.loadMoreFollowers(request.token, request.user, request.pageSize, request.lastItem));
};