import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PageItemPresenter, PageItemView } from "../../presenter/PageItemPresenter";


interface Props<T,U> { 
  presenterGenerator: (view: PageItemView<T>) => PageItemPresenter<T,U>; 
  itemComponentGenerator: (item: T|null) => JSX.Element; 
}

const ItemScroller = <T,U>(props: Props<T,U>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<(T|null)[]>([]);
  const itemsReference = useRef(items);
  itemsReference.current = items;   
  const { displayedUser, authToken } = useUserInfo();
  useEffect(() => { loadMoreItems(); }, []);

  const listener: PageItemView<T> = {
    addItems: (newItems: (T|null)[]) => setItems([...itemsReference.current, ...newItems]),
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
          <div key={index} 
            className="row mb-3 mx-0 px-0 border rounded bg-white">
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;