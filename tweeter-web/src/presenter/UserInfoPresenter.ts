import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView{
  setIsFollower: (item: boolean) => void;
  setFolloweesCount: (num: number) => void;
  setFollowersCount: (num: number) => void;
  setDisplayedUser: (user: User) => void;
  displayInfoMessage: (message: string, num: number) => void;
  clearLastInfoMessage: () => void;
  displayErrorMessage: (message: string) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private service: UserService;
  public constructor(view: UserInfoView){
    this.view = view;
    this.service = new UserService;
  }

  // IS FOLLOWER FUNC
  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  // FOLLOWEES FUNC
  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  // FOLLOWERS FUNC
  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowersCount(await this.service.getFolloweesCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  // LOGGED USER FUNC
  public switchToLoggedInUser(currentUser: User, event: React.MouseEvent) {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser!);
  };

  // FOLLOW FUNC
  public async followDisplayedUser(authToken: AuthToken, displayedUser: User, event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);
      let [followersCount, followeesCount] = await this.service.follow(authToken!, displayedUser!);

      this.view.clearLastInfoMessage();
      this.view.setIsFollower(true);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    }
  };

  //UNFOLLOW FUNC
  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User, event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      this.view.displayInfoMessage(`Removing ${displayedUser!.name} from followers...`,0);
      let [followersCount, followeesCount] = await this.service.unfollow(authToken!, displayedUser!);

      this.view.clearLastInfoMessage();
      this.view.setIsFollower(false);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    }
  };
}