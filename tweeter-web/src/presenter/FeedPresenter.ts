import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FeedPresenter extends StatusItemPresenter{
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[(Status|null)[], boolean]> { return this.service.loadMoreFeedItems(authToken, displayedUser, PAGE_SIZE, this.lastItem); }
  protected getItemString(): string { return "load feed items"; }
}