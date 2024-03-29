import { StatusService } from "../model/service/StatusService";
import { View, Presenter } from "./Presenter";

export interface MessageView extends View {
  displayInfoMessage: (message: string, num: number) => void;
  clearLastInfoMessage: () => void;
}

export class MessagePresenter extends Presenter {
  private _service: StatusService;
  protected constructor(view: MessageView) { 
    super(view); 
    this._service = new StatusService(); 
  }

  public get view(): MessageView { return super.view as MessageView; }
  public get service(): StatusService { return this._service; }
}