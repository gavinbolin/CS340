import { AuthenticateResponse, RegisterDTO, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event:JSON): Promise<AuthenticateResponse> => {
  const request = RegisterDTO.fromJson(event);
  const buffer = new TextEncoder().encode(request.imageStringBase64).buffer;
  const uint = new Uint8Array(buffer); 
  return new AuthenticateResponse(true, "", ...await new UserService().register(request.firstName, request.lastName, request.alias, request.password, uint));
};  