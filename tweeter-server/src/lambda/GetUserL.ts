import { GetUserDTO, GetUserResponse } from "tweeter-shared";
import { DATA } from "./DATA";

export const handler = async (event:JSON): Promise<GetUserResponse> => {
  const request = GetUserDTO.fromJson(event);
  return new GetUserResponse(true, "", await DATA.userService.getUser(request.authToken, request.alias));
};