import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";

interface Props {_presenter?: PostStatusPresenter}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");

  const listener: PostStatusView = {
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setPost: setPost,
    displayErrorMessage: displayErrorMessage
  };
  const [presenter] = useState(props._presenter ?? new PostStatusPresenter(listener));
  const submitPost = async (event: React.MouseEvent) => { 
    event.preventDefault();
    presenter.submitPost(currentUser!, authToken!, post); 
  };
  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };
  const checkButtonStatus: () => boolean = () => { return !post.trim() || !authToken || !currentUser; };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="post"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          aria-label="postB"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          onClick={(event) => submitPost(event)}
        >
          Post Status
        </button>
        <button
          id="clearStatusButton"
          aria-label="clearB"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={(event) => clearPost(event)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
