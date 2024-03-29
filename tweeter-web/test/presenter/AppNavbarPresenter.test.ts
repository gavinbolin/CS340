import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter"
import { UserService } from "../../src/model/service/UserService";
import { mock, instance, verify, spy, when, capture } from "ts-mockito";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;
  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    mockUserService = mock<UserService>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);
    const mockUserServiceInstance = instance(mockUserService)
    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
    appNavbarPresenter = instance(appNavbarPresenterSpy);
    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });

  it("The presenter tells the view to display a logging out message.", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });
  it("The presenter calls logout on the user service with the correct auth token.", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
    // let [captureAuthToken] = capture(mockUserService.logout).last(); //capture result to print or test is right (error msg)
    // expect(captureAuthToken).toEqual(authToken);
  });
  it("When the logout is successful, the presenter tells the view to clear the last info message, clear the user info, and navigate to the login page.", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0));
    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigateToLogin("")).once();
    verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An erro occured")).never();
  });
  it("When the logout is not successful, the presenter tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the user info, and navigate to the login page.", async () => {
    const error = new Error("error")
    when(mockUserService.logout(authToken)).thenThrow(error);
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigateToLogin("")).never();
    // console.log("HERE::", );
    // let [cap] = capture(mockUserService.logout).last(); //capture result to print or test is right (error msg)
    // expect(console.log(cap)).toEqual("Failed to log user out because of exception: An error occured");
    verify(mockAppNavbarView.displayErrorMessage(`Failed to log user out because of exception: error`)).once();
  });
});
