import useToastListener from "../components/toaster/ToastListenerHook";
import { AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter { 
  protected getItemString(): string { return "login user"; }
  public async auth(alias:string, password:string, rememberMe:boolean, firstName?: string|null, lastName?:string|null, imageBytes?:Uint8Array|null, originalUrl?: string|null) {  
    let [user, authToken] = await this.service.login(alias, password);
    this.view.updateUserInfo(user, user, authToken, rememberMe);
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
  };
}