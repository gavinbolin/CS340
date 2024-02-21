import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginView, LoginPresenter } from "../../../presenter/LoginPresenter";
// import { AuthPresenter, AuthView } from "../../../presenter/AuthPresenter";

interface Props {
  presenterGenerator: (view: LoginView) => LoginPresenter;
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo(); 
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const checkSubmitButtonStatus = (): boolean => { return !alias || !password; };

  const listener: LoginView = {
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage
  }
  const [presenter] = useState(props.presenterGenerator(listener));
  const doLogin = async () => {
    presenter.doLogin(alias!, password!, rememberMeRef.current, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          setA={(event) => setAlias(event.target.value)} 
          setP={(event) => setPassword(event.target.value)}/>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
