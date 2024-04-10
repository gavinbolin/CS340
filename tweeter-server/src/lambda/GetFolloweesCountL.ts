import { GetPrimitiveResponse, GetUserItemDTO } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<GetPrimitiveResponse> => {
  const request = GetUserItemDTO.fromJson(event);
  return new GetPrimitiveResponse(true, "", await DATA.followService.getFolloweesCount(request.authToken, request.user));
};