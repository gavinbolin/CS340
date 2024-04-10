import { FactoryProvider, FollowDAOProvider, S3DAOProvider, StatusDAOProvider, TokenDAOProvider, UserDAOProvider } from "./FactoryProvider";
import { FollowDAO } from "../DAO/FollowDAO";
import { StatusDAO } from "../DAO/StatusDAO";
import { TokenDAO } from "../DAO/TokenDAO";
import { UserDAO } from "../DAO/UserDAO";
import { S3DAO } from "../DAO/S3DAO";

export class TweeterFactory implements FactoryProvider {
  private followDAO:FollowDAOProvider|undefined = undefined;
  private statusDAO:StatusDAOProvider|undefined = undefined;
  private userDAO:UserDAOProvider|undefined = undefined;
  private tokenDAO:TokenDAOProvider|undefined = undefined;
  private s3DAO:S3DAOProvider|undefined = undefined;
  constructor(){
    this.followDAO = this.createFollowDAO();
    this.statusDAO = this.createStatusDAO();
    this.userDAO = this.createUserDAO();
    this.tokenDAO = this.createTokenDAO();
    this.s3DAO = this.createS3DAO();
  }

  createFollowDAO(): FollowDAOProvider { return this.followDAO === undefined ? new FollowDAO() : this.followDAO; }
  createStatusDAO(): StatusDAOProvider { return this.statusDAO === undefined ? new StatusDAO() : this.statusDAO; }
  createUserDAO(): UserDAOProvider { return this.userDAO === undefined ? new UserDAO() : this.userDAO; }
  createTokenDAO(): TokenDAOProvider { return this.tokenDAO === undefined ? new TokenDAO() : this.tokenDAO; }
  createS3DAO(): S3DAOProvider { return this.s3DAO === undefined ? new S3DAO() : this.s3DAO; }
}