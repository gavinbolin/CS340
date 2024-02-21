import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
// import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView{
  navigate: (path: string) => void;
  updateUserInfo: (currUser: User, displayedUser: User | null, authToken: AuthToken, rememberMe: boolean) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter { //extends AuthPresenter
  private view: LoginView;
  private service: UserService;

  public constructor(view: LoginView){ //view: AuthView
    this.view = view;
    this.service = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) { //doAuth
    try {
      let [user, authToken] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    }
  };
}