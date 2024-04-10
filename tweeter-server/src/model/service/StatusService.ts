import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { FactoryProvider, UserDAOProvider, TokenDAOProvider, S3DAOProvider, StatusDAOProvider, FollowDAOProvider } from "../../providers/FactoryProvider";
import { DATA } from "../../lambda/DATA";

export class StatusService{
  private factory: FactoryProvider;
  private statusDAO: StatusDAOProvider;
  private followDAO: FollowDAOProvider;
  private userDAO: UserDAOProvider;
  private tokenDAO: TokenDAOProvider;
  constructor(f: FactoryProvider) { 
    this.factory = f; 
    this.statusDAO = this.factory.createStatusDAO();
    this.followDAO = this.factory.createFollowDAO();
    this.userDAO = this.factory.createUserDAO();
    this.tokenDAO = this.factory.createTokenDAO();
  }
    
  public async loadMoreStoryItems (
    pageSize: number,
    lastItem: Status | null, // last story item   
    authToken: AuthToken,
    user: User // logged in user
  ): Promise<[Status[], boolean]> {
    if (this.tokenDAO.read(authToken._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (LOAD STORY)");
    return await this.statusDAO.getStoryPage(user.alias, pageSize, lastItem ? lastItem : null);
  };

  public async loadMoreFeedItems (
    pageSize: number,
    lastItem: Status | null,
    authToken: AuthToken,
    user: User,
  ): Promise<[Status[], boolean]> {
    const alias = await this.tokenDAO.read(authToken._token);
    if (alias === undefined) throw new Error("ERROR:: INVALID TOKEN (LOAD FEED");
    return await this.statusDAO.getFeedPage(alias, pageSize, lastItem);
    // let i = 0;
    // let result:Status[] = [];
    // let moreItems = false;
    // if(lastItem !== null){ 
    //   while((DATA.feed[i]).post !== lastItem?.post){ i++; } 
    //   for (i; i<pageSize; i++){ result.push(DATA.feed[i]); }
    //   if ((DATA.feed[i+1]).post !== undefined && (DATA.feed[i+1]).post !== null) { moreItems = true; }
    // }
    // return [result, moreItems];
  };

  public async postStatus( authToken: AuthToken, newStatus: Status ): Promise<void> { 
    // await new Promise((f) => setTimeout(f, 2000));
    let alias = await this.tokenDAO.read(authToken._token);
    if (alias === undefined) throw new Error("ERROR:: INVALID TOKEN (POST STATUS)");  

    await this.statusDAO.create(newStatus); // send to statuses for story
    const flwrs:string[] = await this.followDAO.getAllFollowers(alias);
    for (let flwr of flwrs){ await this.statusDAO.createF(newStatus, flwr); } //feed table for each follower
  };
} 