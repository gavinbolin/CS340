import { FollowResponse, GetUserItemDTO } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<FollowResponse> => {
  const request = GetUserItemDTO.fromJson(event);
  return new FollowResponse(true, "", ...await DATA.followService.follow(request.authToken, request.user));
};