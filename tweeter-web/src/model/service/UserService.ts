import { User, AuthToken, LoginRequest, RegisterRequest, LogoutRequest, GetUserRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { Buffer } from "buffer";

export class UserService{
  private facade = new ServerFacade();

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request:LoginRequest = {alias:alias, password:password}//new LoginRequest(alias, password);

    // request = request as unknown as LoginRequest;
    const response = await this.facade.login(request);

    const user = response.user; 
    const token = response.token;  
    if (user === null || token == null) { throw new Error("Invalid alias or password"); }
    return [user, token]; // FakeData.instance.authToken
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    let imageStringBase64: string = Buffer.from(userImageBytes).toString("base64") as unknown as string;
    let request:RegisterRequest = {firstName, lastName, alias, password, imageStringBase64};
    // request = request as unknown as RegisterRequest;
    const response = await this.facade.register(request);

    const user = response.user; 
    const token = response.token;
    if (user === null || token === null) { throw new Error("Invalid registration"); }
    return [user, token];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    let request:LogoutRequest = {authToken:authToken};
    // request = request as unknown as LogoutRequest;
    let response = await this.facade.logout(request);
    console.log(response);
    await new Promise((res) => setTimeout(res, 1000)); 
  };

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null>{
    let request:GetUserRequest = {authToken:authToken, alias:alias};
    // request = request as unknown as GetUserRequest;
    const getUserResponse = await this.facade.getUser(request);
    const user = getUserResponse.user;
    return user;
  };
}
