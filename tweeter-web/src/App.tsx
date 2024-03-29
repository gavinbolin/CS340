import "./App.css";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook"
import { Status, User } from "tweeter-shared";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { FollowersPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PageItemView } from "./presenter/PageItemPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();
  const isAuthenticated = (): boolean => { return !!currentUser && !!authToken; };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const statusItemGenerator = (status: Status|null) => <StatusItem status={status!} />;
  const userItemGenerator = (value: User|null) => <UserItem value={value!} />;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed" 
          element={
            <ItemScroller //
              key = {1}
              presenterGenerator={(view: PageItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={statusItemGenerator}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <ItemScroller
              key = {2}
              presenterGenerator={(view: PageItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={statusItemGenerator}
            />
          }
        />
        <Route
          path="following"
          element={
            <ItemScroller
              key = {3}
              presenterGenerator={(view: PageItemView<User>) => new FollowingPresenter(view)}
              itemComponentGenerator={userItemGenerator}
            />
          }
        />
        <Route
          path="followers" 
          element={
            <ItemScroller
              key = {4}
              presenterGenerator={(view: PageItemView<User>) => new FollowersPresenter(view)}
              itemComponentGenerator={userItemGenerator}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;


// presenterGenerator={(view: AuthView) => new LoginPresenter(view)}
// presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)} 

// "testMatch": [
//       "<rootDir>/test/**/*.test.tsx",
//       "<rootDir>/test/**/*.test.ts"
//     ],