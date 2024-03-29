import { AuthToken, LoadMoreItemsRequest, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade"
import { mock, instance, verify } from "ts-mockito";
import "isomorphic-fetch";

describe("ServerFacadeTest", () => {
  let facade = new ServerFacade();

  it("Register", async () => {
    fetch("https://4oe31ik4v6.execute-api.us-west-1.amazonaws.com/dev");
    let _mock: RegisterRequest = mock<RegisterRequest>();
    const mockInstance = instance(_mock);
    let request = new RegisterRequest("g","b","gbolin","password:)",new Uint8Array);
    let response = await facade.register(request);

    expect(response._user.firstName).not.toEqual(null);
    expect(response._user.lastName).not.toEqual(null);
    expect(response._user.alias).not.toEqual(null);
    expect(response._token.token).not.toEqual(null);
  });

  it("GetFollowers", async () => {
    let _mock: LoadMoreItemsRequest<User> = mock<LoadMoreItemsRequest<User>>();
    const mockInstance = instance(_mock);
    let request = new LoadMoreItemsRequest(new AuthToken("",0),new User("","","","./"),10,new User("","","",""));
    let response = await facade.loadMoreFollowers(request);

    expect(response._items[0]).not.toEqual(null);
    expect(response._items[9]).not.toEqual(null);
    expect(response._moreItems).not.toEqual(false);
  })

  it("GetFollowersCount", async () => {

  })

  it("StatusService", async () => {

  })
})