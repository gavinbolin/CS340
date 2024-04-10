import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:LogoutRequest): Promise<TweeterResponse> => {
  await DATA.userService.logout(event.authToken);
  return new TweeterResponse(true, "");
};