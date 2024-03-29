import { AuthToken, Status, User } from "tweeter-shared";
import { MessageView, MessagePresenter } from "./MessagePresenter";

export interface PostStatusView extends MessageView { setPost: (post: string) => void; }
export class PostStatusPresenter extends MessagePresenter {
  public constructor(view: PostStatusView){ super(view); }
  public get view(): PostStatusView { return super.view as PostStatusView; }

  public async submitPost(currentUser: User|null, authToken: AuthToken|null, post: string) {
    // event.preventDefault();
    this.doFailReportOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);
      let status = new Status(post, currentUser!, Date.now());
      await this.service.postStatus(authToken!, status);
      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status")
  };
}