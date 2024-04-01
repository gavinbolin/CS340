import { FollowResponse, GetUserItemDTO, GetUserItemRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:JSON): Promise<FollowResponse> => {
  const request = GetUserItemDTO.fromJson(event);
  return new FollowResponse(true, "", ...await new FollowService().unfollow(request.authToken, request.user));
};