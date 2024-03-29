import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
export const PAGE_SIZE = 10;

export interface PageItemView<T> extends View { addItems: (items: (T|null)[]) => void; }
export abstract class PageItemPresenter<T,U> extends Presenter {
  private _service: U;
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;
  public constructor(view: PageItemView<T>){
    super(view);
    this._service = this.createService();
  }

  protected get view(): PageItemView<T> { return super.view as PageItemView<T>; }
  protected get service(){ return this._service; }

  public get hasMoreItems(){ return this._hasMoreItems; }
  protected set hasMoreItems(value: boolean){ this._hasMoreItems = value; }
  protected get lastItem(){ return this._lastItem; }
  protected set lastItem(user: T | null){ this._lastItem = user; }
  
  protected abstract createService(): U;  
  protected abstract getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[(T|null)[],boolean]>
  protected abstract getItemString(): string;

  public async loadMoreItems(authToken: AuthToken, displayedUser: User) {
    this.doFailReportOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.getMoreItems(authToken, displayedUser);

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, this.getItemString());
  };
}