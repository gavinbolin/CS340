import { AuthToken, User } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { render, screen } from "@testing-library/react"
// import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mock, instance, verify, anything, capture } from "ts-mockito";
import React from "react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));    

beforeAll(() => {
  let mockUser = mock<User>();
  let mockAuth = mock<AuthToken>();
  const mockUserInstance = instance(mockUser);
  const mockAuthTokenInstance = instance(mockAuth);
  (useUserInfo as jest.Mock).mockReturnValue({
    currentUser: mockUserInstance,
    authToken: mockAuthTokenInstance,
  });      
});

describe("PostStatusComponent", () => {
  it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
    const { postB, clearB } = renderPostStatusAndElem();
    expect(postB).toBeDisabled();
    expect(clearB).toBeDisabled();
  });
  it("Both buttons are enabled when the text field has text.", async () => {
    const { postB, clearB, post, user } = renderPostStatusAndElem();
    await user.type(post, "yeehaw");
    expect(postB).toBeEnabled();
    expect(clearB).toBeEnabled();
  });
  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postB, clearB, post, user } = renderPostStatusAndElem();
    await user.type(post, "yeehaw");
    expect(postB).toBeEnabled();
    expect(clearB).toBeEnabled();

    user.clear(post);
    expect(postB).toBeDisabled();
    expect(clearB).toBeDisabled();
  });
  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const p = "yessir";
    const { postB, clearB, post, user } = renderPostStatusAndElem(mockPresenterInstance);
    const { currentUser, authToken } = useUserInfo();
    await user.type(post, p);
    await user.click(postB);
    const [cap1, cap2, cap3] = capture(mockPresenter.submitPost).last(); 
    expect(cap1 == currentUser).toEqual(true);
    expect(cap2 == authToken).toEqual(true);
    expect(cap3).toEqual(p);  
    verify(mockPresenter.submitPost(anything(), anything(), p)).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => { 
  return render (
    <MemoryRouter>
      { !!presenter ? (<PostStatus _presenter={presenter}/>) : (<PostStatus/>)}
    </MemoryRouter>
  ); 
}
const renderPostStatusAndElem = (presenter?: PostStatusPresenter) => { 
  const user = userEvent.setup();
  renderPostStatus(presenter); //presenter
  const postB = screen.getByLabelText("postB");
  const clearB = screen.getByLabelText("clearB");
  const post = screen.getByLabelText("post");
  return { postB, clearB, post, user };
}
