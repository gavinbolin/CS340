import { GetPrimitiveResponse, InteractWithUserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: InteractWithUserRequest): Promise<GetPrimitiveResponse> => {
  return new GetPrimitiveResponse(true, "", await new FollowService().getIsFollowerStatus(event.authToken, event.user, event.other_user));
};