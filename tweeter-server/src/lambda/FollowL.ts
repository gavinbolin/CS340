import { FollowResponse, GetUserItemRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { GetUserItemDTO } from "tweeter-shared/dist/model/network/Request";

export const handler = async (event:JSON): Promise<FollowResponse> => {
  const request = GetUserItemDTO.fromJson(event);
  return new FollowResponse(true, "", ...await new FollowService().follow(request.authToken, request.user));
};