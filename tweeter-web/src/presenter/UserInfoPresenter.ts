import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessagePresenter, MessageView } from "./MessagePresenter";


export interface UserInfoView extends MessageView {
  setIsFollower: (item: boolean) => void;
  setFolloweesCount: (num: number) => void;
  setFollowersCount: (num: number) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends MessagePresenter {
  private service2: FollowService;
  public constructor(view: UserInfoView){ super(view); this.service2 = new FollowService(); }
  public get view(): UserInfoView { return super.view as UserInfoView; }

  // IS FOLLOWER FUNC
  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    this.setStatusParam(authToken, displayedUser, async () => { 
        if (currentUser === displayedUser) { this.view.setIsFollower(false); } 
        else { this.view.setIsFollower(await this.service2.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)) }
      }, "determine follower status", currentUser);
  };

  // FOLLOWEES FUNC
  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.setStatusParam(authToken, displayedUser, async () => { 
        this.view.setFolloweesCount(await this.service2.getFolloweesCount(authToken, displayedUser))
      }, "get followees count");
  };

  // FOLLOWERS FUNC //
  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.setStatusParam(authToken, displayedUser, async () => {
        this.view.setFollowersCount(await this.service2.getFollowersCount(authToken, displayedUser))
      }, "get followers count");
  }; 

  // FOLLOW FUNC
  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.doEventWithDisplayedUser(authToken, displayedUser, 'Adding', 'to', 
      async ()=> {return this.service2.follow(authToken!, displayedUser!)}, 
      true, 'follow user');
  };

  // UNFOLLOW FUNC //
  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.doEventWithDisplayedUser(authToken, displayedUser, 
      'Removing', 'from', 
      async ()=> {return this.service2.unfollow(authToken!, displayedUser!)}, 
      false, 'unfollow user');
  };

  // LOGGED USER FUNC //
  public switchToLoggedInUser(currentUser: User) {this.view.setDisplayedUser(currentUser!);};

  // HLEPER FUNC //
  protected setStatusParam( authToken: AuthToken, displayedUser: User, op: (authToken:AuthToken, displayedUser:User)=> void, message: string, currentUser?: User|null) {
    this.doFailReportOperation(async () => {op(authToken, displayedUser);}, message);
  }

  protected doEventWithDisplayedUser( authToken: AuthToken, displayedUser: User, m1:string, m2:string, 
    op: (authToken:AuthToken, displayedUser:User)=> Promise<[number, number]>,
    setFollow:boolean, message:string ) { 
      this.doFailReportOperation(async () => {
        this.view.displayInfoMessage(`${m1} ${displayedUser!.name} ${m2} followers...`,0);
        let [followersCount, followeesCount] = await op(authToken, displayedUser);
        this.view.clearLastInfoMessage();
        this.view.setIsFollower(setFollow);
        this.view.setFollowersCount(followersCount);
        this.view.setFolloweesCount(followeesCount);
    }, message);
  }
}