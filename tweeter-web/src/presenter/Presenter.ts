export interface View { displayErrorMessage: (message: string) => void; }

export class Presenter{
  private _view: View;
  protected constructor(view: View) { this._view = view; }
  protected get view(): View { return this._view; }
  protected async doFailReportOperation(op: ()=> Promise<void>, opDesc: string) {
    try { await op(); } 
    catch (error) { this.view.displayErrorMessage(`Failed to ${opDesc} because of exception: ${(error as Error).message}`); }
  };
}