import { GetPrimitiveResponse, GetUserItemRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:GetUserItemRequest): Promise<GetPrimitiveResponse> => {
  return new GetPrimitiveResponse(true, "", await new FollowService().getFolloweesCount(event.authToken, event.user));
};