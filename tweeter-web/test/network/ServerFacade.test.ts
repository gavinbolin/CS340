import { AuthToken, GetUserItemRequest, LoadMoreItemsRequest, RegisterRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade"
import { StatusService } from "../../src/model/service/StatusService"
import { mock, instance, spy, when } from "ts-mockito";
import "isomorphic-fetch";

describe("ServerFacadeTest", () => {
  const url = "https://4oe31ik4v6.execute-api.us-west-1.amazonaws.com/dev";
  fetch(url);
  const facade = new ServerFacade();

  it("Register", async () => {
    const firstName = "gavin";
    const lastName = "bolin";
    const alias = "@gbolin";
    const password = "password:)";
    const imageStringBase64 = "1234";
    let mockRegister: RegisterRequest = mock<RegisterRequest>();
    mockRegister = { firstName, lastName, alias, password, imageStringBase64};
    const response = await facade.register(mockRegister);

    // console.log("HERE REGISTERINST::", response.user);
    expect(response.success).not.toEqual(false);
    expect(response.user.firstName).not.toBeNull();
    expect(response.user.alias).not.toBeNull();
    expect(response.token.token).not.toBeNull();
  });

  it("GetFollowers", async () => {
    const token = new AuthToken("41f0abf3-60ee-4a4a-a8b8-67ee883f0f5c", 1711766744800);
    const user = new User("Allen","Anderson","@allen","https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
    const pageSize = 10;
    const lastItem = new User("Elizabeth","Engle","@elizabeth","https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png");
    let mockGetFollowers: LoadMoreItemsRequest<User> = mock<LoadMoreItemsRequest<User>>();
    mockGetFollowers = { token, user, pageSize, lastItem };
    const response = await facade.loadMoreFollowers(mockGetFollowers);

    // console.log("HERE::", response);
    expect(response.success).not.toEqual(false);
    expect(response.items[0]).not.toBeNull();
    expect(response.items[9]).not.toBeNull();
    expect(response.moreItems).not.toEqual(false);
  })

  it("GetFollowersCount", async () => {
    const authToken = new AuthToken("41f0abf3-60ee-4a4a-a8b8-67ee883f0f5c", 1711766744800);
    const user = new User("Allen","Anderson","@allen","https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
    let mockUserItemRequest: GetUserItemRequest = mock<GetUserItemRequest>();
    mockUserItemRequest = {authToken, user};
    const response = await facade.getFollowersCount(mockUserItemRequest);

    // console.log("HERE::", response);
    expect(response.success).not.toEqual(false);
    expect(response.item).not.toBeNull();
    expect(response.item).not.toEqual(0);
  })

  it("StatusService", async () => {
    // let stats:(Status|null)[] = [];
    // let bool:boolean = false;
    // let result:[(Status|null)[], boolean] = [stats, bool];
    const token = new AuthToken("41f0abf3-60ee-4a4a-a8b8-67ee883f0f5c", 1711766744800);
    const user = new User("Allen","Anderson","@allen","https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
    const pageSize = 10;
    const lastItem = null;

    const request:LoadMoreItemsRequest<Status> = {token,user,pageSize,lastItem};
    // const cc = new ClientCommunicator(url);
    // const endpoint = "/loadMoreStoryItems";
    const response = await facade.loadMoreStoryItems(request);
    const statuses:(Status|null)[] = response.items;
    const bool:boolean = response.moreItems;

    const mockService = mock<StatusService>();
    const serviceSpy = spy(mockService);
    const inst = instance(serviceSpy);
    when(await inst.loadMoreStoryItems(token, user, pageSize, lastItem))
    .thenReturn([statuses,bool]);
      
    
    // .thenResolve([
    //     ((await facade.loadMoreStoryItems(request)).items),
    //     ((await facade.loadMoreStoryItems(request)).moreItems)
    //   ]);

    // mockStatusService = mock<StatusService>();
    // const mockPostStatusViewInstance = instance(mockPostStatusView);
    // const mockStatusServiceInstance = instance(mockStatusService)
    // const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    // postStatusPresenter = instance(postStatusPresenterSpy);
    // when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);

    // const mockServiceInstance = instance(mockService);

    // when(inst.loadMoreStoryItems(token, user, pageSize, lastItem)).thenResolve(result);

    const page:[(Status|null)[],boolean] = await inst.loadMoreStoryItems(token, user, pageSize, lastItem);
    // page.then(([stats, bool]) => {
      console.log("RETURN OF STATUS PAGE INSTANCE :: ", page);
      expect(page[1]).not.toBeNull();
      expect(page[0][0]).not.toBeNull();
      expect(page[0][0]).not.toBeUndefined();
      // expect(stats[9]).not.toBeNull();
      // expect(stats[9]).not.toBeUndefined();
    // });
  })
})