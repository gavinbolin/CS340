import { AuthenticateResponse, RegisterDTO } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<AuthenticateResponse> => {
  const request = RegisterDTO.fromJson(event);
  return new AuthenticateResponse(true, "", ...await DATA.userService.register(request.firstName, request.lastName, request.alias, request.password, request.imageStringBase64));
};  