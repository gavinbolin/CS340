import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserInfoView, UserInfoPresenter } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeesCount, setFolloweesCount] = useState(-1);
  const [followersCount, setFollowersCount] = useState(-1);
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const { currentUser, authToken, displayedUser, setDisplayedUser } = useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const listener: UserInfoView = {
    setIsFollower: setIsFollower,
    setFolloweesCount: setFolloweesCount,
    setFollowersCount: setFollowersCount,
    setDisplayedUser: setDisplayedUser,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    displayErrorMessage: displayErrorMessage
  };
  const presenter = new UserInfoPresenter(listener);
  const setIsFollowerStatus = async () => {
    presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
  };
  const setNumbFollowees = async () => {
    presenter.setNumbFollowees(authToken!, displayedUser!);
  };
  const setNumbFollowers = async () => {
    presenter.setNumbFollowers(authToken!, displayedUser!);
  };
  const switchToLoggedInUser = async (event: React.MouseEvent) => {
    presenter.switchToLoggedInUser(currentUser!, event);
  };
  const followDisplayedUser = async (event: React.MouseEvent) => {
    presenter.followDisplayedUser(authToken!, displayedUser!, event);
  };
  const unfollowDisplayedUser = async (event: React.MouseEvent) => {
    presenter.unfollowDisplayedUser(authToken!, displayedUser!, event);
  };

  useEffect(() => {
    setIsFollowerStatus;
    setNumbFollowees;
    setNumbFollowers;
  });

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeesCount > -1 && followersCount > -1 && (
                <div>
                  Following: {followeesCount} Followers: {followersCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
