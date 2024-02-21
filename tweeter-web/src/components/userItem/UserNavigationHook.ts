import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

const useUserNavigation = () => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage
  };
  const presenter = new UserNavigationPresenter(listener);
  const navigateToUser= async (event: React.MouseEvent) => {
    presenter.navigateToUser(currentUser!, authToken!, event);
  };

  return navigateToUser;
};

export default useUserNavigation;