import { Status } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostListItem from "../statusItem/StatusItem";
import useToastListener from "../toaster/ToastListenerHook";
import { StatusItemView, StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import useUserInfo from "../userInfo/UserInfoHook";

interface Props {
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StoryScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const itemsReference = useRef(items);
  itemsReference.current = items;

  // Load initial items
  useEffect(() => {
    loadMoreItems(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) => setItems([...itemsReference.current, ...newItems]),
    displayErrorMessage: displayErrorMessage
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <PostListItem status={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StoryScroller;
