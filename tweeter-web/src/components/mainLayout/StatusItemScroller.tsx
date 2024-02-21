import { Status } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/StatusItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { StatusItemView, StatusItemPresenter } from "../../presenter/StatusItemPresenter";

interface Props { //Split so this doesnt have duplicated code from feed and story??
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
  // userItems: (
  //   authToken: AuthToken,
  //   user: User,
  //   pageSize: number,
  //   lastItem: Status | null
  // ) => Promise<[Status[], boolean]>;
  // itemDescription: String;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  // const [hasMoreItems, setHasMoreItems] = useState(true);
  // const [lastItem, setLastItem] = useState<Status | null>(null);

  // Required to allow the addItems method to see the current value of 'items'
  // instead of the value from when the closure was created.
  const itemsReference = useRef(items);
  itemsReference.current = items;

  const { displayedUser, authToken } = useUserInfo();

  // const addItems = (newItems: Status[]) =>
  //   setItems([...itemsReference.current, ...newItems]);

  // const { displayedUser, authToken } =
  //   useUserInfo();

  // Load initial items   // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadMoreItems(); }, []);

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) => setItems([...itemsReference.current, ...newItems]),
    displayErrorMessage: displayErrorMessage
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!);
  };

  // const loadMoreItems = async () => {
  //   try {
  //     if (hasMoreItems) {
  //       let [newItems, hasMore] = await props.userItems(
  //         authToken!,
  //         displayedUser!,
  //         PAGE_SIZE,
  //         lastItem
  //       );

  //       setHasMoreItems(hasMore);
  //       setLastItem(newItems[newItems.length - 1]);
  //       addItems(newItems);
  //     }
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to load feed ${props.itemDescription} because of exception: ${error}`
  //     );
  //   }
  // };

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
            <StatusItem status={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;