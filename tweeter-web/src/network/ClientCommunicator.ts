import { TweeterRequest } from "tweeter-shared";

export class ClientCommunicator {
  private SERVER_URL: string;
  constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  async doPost<REQ extends TweeterRequest, RES>(req:REQ, endpoint:string): Promise<RES> {
    const url = this.SERVER_URL + endpoint;
    // console.log("REQUEST::BEFORE::", req); ////
    const request = {
      method: "post",
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      }),
      body: JSON.stringify(req),
    };
    // console.log("REQUEST::AFTER::", request); ////

    try {
      const resp: Response = await fetch(url, request);
      console.log("RESP OK", resp);
      if (resp.ok) {
        const response: RES = await resp.json();
        // console.log("RESPONSE::HERE", response);
        return response;
      } else {
        console.log("HERE BAD RESPONSE!!!");
        const error = await resp.json();
        throw new Error("ERROR WITH RESPONSE", error.errorMessage);
      }
    } catch (err) {
      throw new Error(
        "Client communicator doPost failed:\n" + (err as Error).message
      );
    }
  }
}