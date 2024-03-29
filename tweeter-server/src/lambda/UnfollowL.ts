import { FollowResponse, GetUserItemRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:GetUserItemRequest): Promise<FollowResponse> => {
  return new FollowResponse(true, "", ...await new FollowService().unfollow(event.authToken, event.user));
};