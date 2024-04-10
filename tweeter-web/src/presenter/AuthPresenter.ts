import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View { 
  navigate: (path: string) => void;
  updateUserInfo: (currUser: User, displayedUser: User | null, authToken: AuthToken, rememberMe: boolean) => void; 
}

export abstract class AuthPresenter extends Presenter {
  protected _service: UserService | null = null;
  public constructor(view: AuthView){
    super(view);
  }

  public get view(): AuthView { return super.view as AuthView; }
  public get service(){ 
    if (this._service == null){
    this._service = new UserService(); 
    }
    return this._service;
  }

  public abstract auth( alias:string, password:string, rememberMe:boolean, firstName?: string|null, lastName?:string|null, imageBytes?:Uint8Array|null, originalUrl?: string|null ): Promise<void>;
  protected abstract getItemString(): string;

  public async doAuth(alias:string, password:string, rememberMe:boolean, firstName?: string|null, lastName?:string|null, imageBytes?:Uint8Array|null, originalUrl?: string|null) {
    this.doFailReportOperation(async () => {
      await this.auth(alias, password, rememberMe, firstName, lastName, imageBytes, originalUrl)
    }, this.getItemString());
  };
}