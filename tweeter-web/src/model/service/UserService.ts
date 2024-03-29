import { User, AuthToken, LoginRequest, RegisterRequest, LogoutRequest, GetUserRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { Buffer } from "buffer";

export class UserService{
  private facade = new ServerFacade();

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const loginRequest:LoginRequest = new LoginRequest(alias, password);
    let loginResponse = await this.facade.login(loginRequest);

    const user = loginResponse._user; // let user = FakeData.instance.firstUser;
    const token = loginResponse._token;  //AuthToken.fromJson(JSON.stringify(loginResponse));
    if (user === null || token == null) { throw new Error("Invalid alias or password"); }
    // console.log("LOGIN USER::", user);
    return [user, token]; // FakeData.instance.authToken
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    // let imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
    const registerRequest:RegisterRequest = new RegisterRequest(firstName, lastName, alias, password, userImageBytes);
    let registerResponse = await this.facade.register(registerRequest);

    const user = registerResponse._user; 
    const token = registerResponse._token;
    if (user === null || token === null) { throw new Error("Invalid registration"); }
    return [user, token];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    const logoutRequest:LogoutRequest = new LogoutRequest(authToken);
    let logoutResponse = await this.facade.logout(logoutRequest);
    console.log(logoutResponse);
    await new Promise((res) => setTimeout(res, 1000)); 
  };

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null>{
    const getUserRequest:GetUserRequest = new GetUserRequest(authToken, alias);
    let getUserResponse = await this.facade.getUser(getUserRequest);
    const user = getUserResponse._user;
    return user;
  };
}