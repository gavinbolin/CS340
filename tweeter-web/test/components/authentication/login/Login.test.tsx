import Login from "../../../../src/components/authentication/login/Login"
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { mock, instance, verify } from "ts-mockito";
import React from "react";

library.add(fab);
describe("Login Component", () => {
  it("When first rendered the sign-in button is disabled.", () => {
    const { signInB } = renderLoginAndGetElem("/");
    expect(signInB).toBeDisabled();
  });
  it("The sign-in button is enabled when both the alias and password fields have text.", async () => {
    const { signInB, alias, password, user } = renderLoginAndGetElem("/");
    await user.type(alias, "g");
    await user.type(password, "b");
    expect(signInB).toBeEnabled();
  });
  it("The sign-in button is disabled if either the alias or password field is cleared.", async () => {
    const { signInB, alias, password, user } = renderLoginAndGetElem("/");
    await user.type(alias, "g");
    await user.type(password, "b");
    expect(signInB).toBeEnabled();

    user.clear(alias);
    expect(signInB).toBeDisabled();
    await user.type(alias, "g");
    expect(signInB).toBeEnabled();

    user.clear(password);
    expect(signInB).toBeDisabled();
    await user.type(password, "b");
    expect(signInB).toBeEnabled();
  });
  it("The presenter's login method is called with correct parameters when the sign-in button is pressed.", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const ogUrl = "https://yeehaw.com";
    const a = "@gbolin";
    const p = "password";
    const { signInB, alias, password, user } = renderLoginAndGetElem(ogUrl, mockPresenterInstance);
    await user.type(alias, a);
    await user.type(password, p);
    await user.click(signInB);
    verify(mockPresenter.auth(a, p, false, null, null, null, ogUrl)).once;
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      { !!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
        ) : (
        <Login originalUrl={originalUrl} />
        )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElem = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);
  const signInB = screen.getByRole("button", {name: /Sign in/i});
  const alias = screen.getByLabelText("alias");
  const password = screen.getByLabelText("password");
  return { signInB, alias, password, user };
}