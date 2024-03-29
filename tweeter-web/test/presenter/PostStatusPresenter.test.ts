import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { StatusService } from "../../src/model/service/StatusService";
import { mock, instance, verify, spy, when, anything } from "ts-mockito";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;
  let currentUser = new User("g","b","gbolin","");
  let authToken = new AuthToken("abc123", Date.now());
  let post = "";
  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    mockStatusService = mock<StatusService>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const mockStatusServiceInstance = instance(mockStatusService)
    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);
    when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
  });

  it("The presenter tells the view to display a posting status message.", async () => {
    await postStatusPresenter.submitPost(currentUser!, authToken!, post);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });
  it("The presenter calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postStatusPresenter.submitPost(currentUser!, authToken!, post);
    verify(mockStatusService.postStatus(authToken!, anything())).once();
  });
  it("When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message.", async () => {
    await postStatusPresenter.submitPost(currentUser!, authToken!, post);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: An error occured`)).never();
  });
  it("When posting of the status is not successful, the presenter tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message.", async () => {
    const error = new Error("error")
    when(mockStatusService.postStatus(authToken!, anything())).thenThrow(error);
    await postStatusPresenter.submitPost(currentUser!, authToken!, post);  
    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: error`)).once();
  });
});
