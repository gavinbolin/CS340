import { AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { LoginDTO } from "tweeter-shared/dist/model/network/Request";

export const handler = async (event:JSON): Promise<AuthenticateResponse> => {
  const request = LoginDTO.fromJson(event);
  return new AuthenticateResponse(true, "", ...await new UserService().login(request.alias, request.password));
};