import { GetPrimitiveResponse, InteractWithUserDTO } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event: JSON): Promise<GetPrimitiveResponse> => {
  const request = InteractWithUserDTO.fromJson(event);
  return new GetPrimitiveResponse(true, "", await DATA.followService.getIsFollowerStatus(request.authToken, request.user, request.other_user));
};