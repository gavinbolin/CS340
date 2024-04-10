import { PostStatusDTO, TweeterResponse } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<TweeterResponse> => {
  const request = PostStatusDTO.fromJson(event);
  await DATA.statusService.postStatus(request.authToken, request.newStatus);
  return new TweeterResponse(true, "");
};