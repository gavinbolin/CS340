import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event:LogoutRequest): Promise<TweeterResponse> => {
  await new UserService().logout(event.authToken);
  return new TweeterResponse(true, "");
};