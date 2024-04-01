import { PostStatusDTO, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event:JSON): Promise<TweeterResponse> => {
  const request = PostStatusDTO.fromJson(event);
  await new StatusService().postStatus(request.authToken, request.newStatus);
  return new TweeterResponse(true, "");
};