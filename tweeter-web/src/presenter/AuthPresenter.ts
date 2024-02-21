import { User, AuthToken } from "tweeter-shared";

export interface AuthView{
  //firstName: string,
  //lastName: string,
  //alias: string,
  //password: string,
  //imgBytes: Uint8Array, 
  //imgUrl: string,
  rememberMe: boolean,
  navigate: (path: string) => void;
  useUserInfo: (currUser: User, displayedUser: User | null, authToken: AuthToken, rememberMe: boolean) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class AuthPresenter{
  private _view: AuthView;
  protected constructor(view: AuthView){
    this._view = view;
  }

  protected get view(){
    return this._view;
  }

  public get rememberMe(){
    return this.view.rememberMe;
  }

  public set rememberMe(value: boolean){
    this.view.rememberMe = value;
  }

  public abstract doAuth(alias: string, password: string, originalUrl?: string): void;
  // public checkSubmitButtonStatus(): boolean {return !this.view.alias || !this.view.password; }
}