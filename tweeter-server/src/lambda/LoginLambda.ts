import { AuthenticateResponse } from "tweeter-shared";
import { LoginDTO } from "tweeter-shared/dist/model/network/Request";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<AuthenticateResponse> => {
  const request = LoginDTO.fromJson(event);
  const params = await DATA.userService.login(request.alias, request.password)
  return new AuthenticateResponse(true, "", ...params);
};