import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: (path: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthPresenter {
  public get view(): RegisterView { return super.view as RegisterView; }

  protected getItemString(): string { return "register user"; }
  public async auth(alias:string, password:string, rememberMe:boolean, firstName: string, lastName:string, imageBytes:Uint8Array, originalUrl?: string|null) {
    let [user, authToken] = await this.service.register(firstName, lastName, alias, password, imageBytes);
    this.view.updateUserInfo(user, user, authToken, rememberMe);
    this.view.navigate("/");
  };

  public handleImageFile(file: File | undefined){
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;        
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1]; // Remove unnecessary file metadata from the start of the string.
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents,"base64");
        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };
}