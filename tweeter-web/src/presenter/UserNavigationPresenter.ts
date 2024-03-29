import { AuthToken, User } from "tweeter-shared";
import { View } from "./Presenter";
import { NavPresenter } from "./NavPresenter";

export interface UserNavigationView extends View { setDisplayedUser: (user: User) => void; }
export class UserNavigationPresenter extends NavPresenter {
  protected get view(): UserNavigationView { return super.view as UserNavigationView; }

  public async navigateToUser(currentUser: User, authToken: AuthToken, eventString: string): Promise<void> {
    // event.preventDefault();
    this.doFailReportOperation(async ()=> {
      let alias = this.extractAlias(eventString);
      let user = await this.service.getUser(authToken!, alias);
      if (!!user) {
        if (currentUser!.equals(user)) {this.view.setDisplayedUser(currentUser!);} 
        else {this.view.setDisplayedUser(user);}
      }
    }, "get user");
  };
  
  private extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}