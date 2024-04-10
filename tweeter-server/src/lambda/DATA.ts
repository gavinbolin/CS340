import { Status } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";
import { UserService } from "../model/service/UserService";
import { TweeterFactory } from "../providers/TweeterFactory";

export class DATA { 
  static factory:TweeterFactory = new TweeterFactory(); 
  static followService:FollowService = new FollowService(this.factory);
  static statusService:StatusService = new StatusService(this.factory);
  static userService:UserService = new UserService(this.factory);
  static feed: Status[] = [];   

  public static clear(){
    DATA.factory = new TweeterFactory();
    DATA.followService = new FollowService(DATA.factory);
    DATA.statusService = new StatusService(DATA.factory);
    DATA.userService = new UserService(DATA.factory);
    DATA.feed = [];
  }
}