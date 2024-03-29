import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event:PostStatusRequest): Promise<TweeterResponse> => {
  await new StatusService().postStatus(event.authToken, event.newStatus);
  return new TweeterResponse(true, "");
};