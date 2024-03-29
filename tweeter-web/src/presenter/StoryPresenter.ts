import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class StoryPresenter extends StatusItemPresenter{
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[(Status|null)[], boolean]> { return this.service.loadMoreStoryItems(authToken, displayedUser, PAGE_SIZE, this.lastItem); }
  protected getItemString(): string { return "load story items"; }
}
