import { GetPrimitiveResponse, GetUserItemRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:GetUserItemRequest): Promise<GetPrimitiveResponse> => {
  return new GetPrimitiveResponse(true, "", await new FollowService().getFollowersCount(event.authToken, event.user));
}; // getFollowersCount in FakeData needs imageUrl but undef