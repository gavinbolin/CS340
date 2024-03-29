import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FollowingPresenter extends UserItemPresenter{
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[(User|null)[], boolean]> { return this.service.loadMoreFollowees(authToken, displayedUser, PAGE_SIZE, this.lastItem); }
  protected getItemString(): string { return "load followee items"; }
}