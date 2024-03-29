import { AuthToken } from "tweeter-shared";
import { MessageView } from "./MessagePresenter";
import { NavPresenter } from "./NavPresenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void,
  navigateToLogin: (string:string) => void,
}
export class AppNavbarPresenter extends NavPresenter {
  public constructor(view: AppNavbarView){super(view);} 
  protected get view(): AppNavbarView { return super.view as AppNavbarView; }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailReportOperation(async ()=> {
      await this.service.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin("");
    }, "log user out")
  };
}