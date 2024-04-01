import { GetPrimitiveResponse, InteractWithUserDTO } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: JSON): Promise<GetPrimitiveResponse> => {
  const request = InteractWithUserDTO.fromJson(event);
  return new GetPrimitiveResponse(true, "", await new FollowService().getIsFollowerStatus(request.authToken, request.user, request.other_user));
};