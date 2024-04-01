import { GetPrimitiveResponse, GetUserItemDTO } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event:JSON): Promise<GetPrimitiveResponse> => {
  const request = GetUserItemDTO.fromJson(event);
  return new GetPrimitiveResponse(true, "", await new FollowService().getFollowersCount(request.authToken, request.user));
}; // getFollowersCount in FakeData needs imageUrl but undef