import { User, AuthToken } from "tweeter-shared";
import { FactoryProvider, S3DAOProvider, StatusDAOProvider, TokenDAOProvider, UserDAOProvider } from "../../providers/FactoryProvider";
import * as CryptoJS from 'crypto-js';
import { DATA } from "../../lambda/DATA";

export class UserService{
  private factory: FactoryProvider;
  private userDAO: UserDAOProvider;
  private statusDAO: StatusDAOProvider;
  private tokenDAO: TokenDAOProvider;
  private s3DAO: S3DAOProvider;
  constructor(f: FactoryProvider) { 
    this.factory = f; 
    this.userDAO = this.factory.createUserDAO();
    this.statusDAO = this.factory.createStatusDAO();
    this.tokenDAO = this.factory.createTokenDAO();
    this.s3DAO = this.factory.createS3DAO();
  }

  public async login (  // ADD user feed to static item on login and reg
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> { // SERVICE FACTORY DAOs
    alias = this.addAt(alias);
    let token = undefined;
    let user = await this.userDAO.findUserByAlias(alias);
    let hashed_password = this.hashPassword(password); // HASH PASSWORD
    DATA.feed = (await this.statusDAO.getFeedPage(alias, 10000, null))[0]; // create localized feed
    // console.log("FEEEEEEEEED", DATA.feed); //   MOVE TO STATUS SERVICE, CANT READ OVER DIFFERENT LAMBDAS

    if(user !== undefined){  // (USER) verify that user exists
      if (await this.userDAO.verifyPassword(alias, hashed_password)){  // (USER) verify password
        token = await this.tokenDAO.create(alias);  // (AUTH) verify user and create new token
      } else throw new Error("ERROR:: PASSWORD IS INCORRECT (LOGIN)");
    } else throw new Error("ERROR:: USER IS UNDEF (LOGIN)");
    return [user as unknown as User, token as unknown as AuthToken];
  };


  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string, // encrypt //
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    alias = this.addAt(alias);
    let hashed_password = this.hashPassword(password); // HASH PASSWORD
    let imageUrl = await this.s3DAO.putImage(alias, imageStringBase64); 

    const user = new User(firstName, lastName, alias, imageUrl);
    await this.userDAO.create(user, hashed_password);  // (USER) create new user to return
    const token = await this.tokenDAO.create(alias);  // (TOKEN) verify and create token to return
    return [user, token as unknown as AuthToken];
  };


  public async logout(authToken: AuthToken): Promise<void> {
    console.log("TOKEN ALIAS::", authToken._token);
    let alias = await this.tokenDAO.read(authToken._token);
    if (alias === undefined) throw new Error("ERROR:: INVALID TOKEN (LOGOUT)"); 
    DATA.clear();
    await this.tokenDAO.delete(authToken._token); // (TOKENS) verify and set current user with auth ??
    await new Promise((res) => setTimeout(res, 1000)); //Lookfor setTimeout
  };  


  public async getUser(authToken: AuthToken, alias: string): Promise<User | null>{
    if (await this.tokenDAO.read((authToken)._token) === undefined) throw new Error("ERROR:: INVALID TOKEN (GET USER)");    
    const user = await this.userDAO.findUserByAlias(alias);
    console.log("HERE GET USER IN SERVICE::", user);
    return user as unknown as User;
  };


  private hashPassword(password: string): string { // HELPER METHOD TO HASH PW
    const salt = CryptoJS.lib.WordArray.random(16); // 16 bytes (128 bits)
    const hashedPassword = CryptoJS.PBKDF2(password, salt, { keySize: 512 / 32, iterations: 1000 }).toString(CryptoJS.enc.Base64);
    return hashedPassword;
  };
  private addAt(alias:string): string { return `@${alias}` };
} 

// IFr2pARAv293j9YtaxzsOyzAZ9tOtprLAtXYmstQ30WY90iU1js2ijD+Gnl8TWN9GCAT/QUmj8C3b+1m1sFq7Q==
// IFr2pARAv293j9YtaxzsOyzAZ9tOtprLAtXYmstQ30WY90iU1js2ijD+Gnl8TWN9GCAT/QUmj8C3b+1m1sFq7Q==

// U2FsdGVkX19w3Ln1+YIjxEJlDYc78/CI1TPBNB1JGnw=
// U2FsdGVkX1/EU3clLumAYq87KQxiR3JGObMUgIHfvhk=