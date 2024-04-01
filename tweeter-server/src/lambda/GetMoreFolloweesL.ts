import { LoadMoreItemsRequest, LoadUserItemsResponse, LoadUserRequest, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:JSON): Promise<LoadUserItemsResponse> => {
  const request = LoadUserRequest.fromJson(event);
  return new LoadUserItemsResponse(true, "", ...await new FollowService().loadMoreFollowees(request.token, request.user, request.pageSize, request.lastItem));
};