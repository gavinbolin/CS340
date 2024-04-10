import { AuthToken, User, FakeData } from "tweeter-shared";
import { FactoryProvider, FollowDAOProvider, StatusDAOProvider, TokenDAOProvider, UserDAOProvider } from "../../providers/FactoryProvider";

export class FollowService {
  private factory: FactoryProvider;
  private tokenDAO: TokenDAOProvider;
  private followDAO: FollowDAOProvider;
  private statusDAO: StatusDAOProvider;
  private userDAO: UserDAOProvider;
  constructor(f: FactoryProvider) { 
    this.factory = f;
    this.tokenDAO = this.factory.createTokenDAO();
    this.followDAO = this.factory.createFollowDAO();
    this.statusDAO = this.factory.createStatusDAO();
    this.userDAO = this.factory.createUserDAO();
  }

  public async loadMoreFollowers (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User|null
  ): Promise<[User[], boolean]> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (LOAD FLWRs)");
    const output = await this.followDAO.getPageOfFollowers(user.alias, pageSize, lastItem ? lastItem.alias : null);
    let users:User[] = [];
    for (let i=0; output[0][i] !== undefined; i++){
      let item = await this.userDAO.findUserByAlias(output[0][i]);
      users[i] = item as unknown as User;
    }
    return [users, output[1]];
  };
    
  public async loadMoreFollowees (
    authToken: AuthToken, // verify current user
    user: User, // followees according to user // should match user.followees
    pageSize: number,
    lastItem: User|null
  ): Promise<[User[], boolean]> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (LOAD FLWEs)");
    const output = await this.followDAO.getPageOfFollowees(user.alias, pageSize, lastItem ? lastItem.alias : null);
    let users: User[] = [];
    for (let i=0; output[0][i] !== undefined; i++){
      let item = await this.userDAO.findUserByAlias(output[0][i]);
      users.push(item as unknown as User);
    }
    return [users, output[1]];
  };

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (GET IS FLWR)");
    return await this.followDAO.isFollower(user.alias, selectedUser.alias);
  };

  public async getFollowersCount(authToken: AuthToken, user: User): Promise<number> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (GET FLWR COUNT)");
    return this.userDAO.getFollowersCount(user);
  };

  public async getFolloweesCount(authToken: AuthToken, user: User): Promise<number> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (GET FLWE COUNT)");
    return this.userDAO.getFolloweesCount(user);
  };

  public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
    // await new Promise((f) => setTimeout(f, 2000));
    const alias = await this.tokenDAO.read(authToken._token);
    if (alias === undefined) throw new Error("ERROR:: INVALID TOKEN (FOLLOW)");

    const userToFollowCount = await this.userDAO.changeFlwCount(userToFollow.alias,1,0);
    await this.userDAO.changeFlwCount(alias,0,1);
    await this.followDAO.create(alias, userToFollow.alias);  // add follow of user and other_user\

    await this.statusDAO.updateFeed(alias, [userToFollow.alias], true);
    return userToFollowCount;
  };

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
    // await new Promise((f) => setTimeout(f, 2000));
    const alias = await this.tokenDAO.read(authToken._token);
    if (alias === undefined) throw new Error("ERROR:: INVALID TOKEN (UNFOLLOW)");

    const userToFollowCount = await this.userDAO.changeFlwCount(userToUnfollow.alias,-1,0);
    await this.userDAO.changeFlwCount(alias,0,-1);
    await this.followDAO.delete(alias, userToUnfollow.alias); 
    
    await this.statusDAO.updateFeed(alias, [userToUnfollow.alias], false);
    return userToFollowCount;
  };
}