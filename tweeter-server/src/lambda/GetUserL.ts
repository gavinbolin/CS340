import { GetUserDTO, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event:JSON): Promise<GetUserResponse> => {
  const request = GetUserDTO.fromJson(event);
  return new GetUserResponse(true, "", await new UserService().getUser(request.authToken, request.alias));
};