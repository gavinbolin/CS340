import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";

export class NavPresenter extends Presenter {
  private _service: UserService | null = null;
  public constructor(view: View){ super(view); }
  public get service(){ return new UserService(); }
}
