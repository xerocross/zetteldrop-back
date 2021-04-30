import { ZettelKasten } from "./ZettelKasten"
import { Zettel } from "./zettel"
import { User } from "./User"
import { UserBase } from "./UserBase"
import { PersistenceLayer } from "../helpers/PersistenceLayer"
import { ErrorMessages } from "../helpers/ErrorMessages"

export class ZettelDrop {
    zettelKasten : ZettelKasten | null = null;
    userBase : UserBase | null = null;
    user : User | null = null;
    persistenceLayer : PersistenceLayer | null = null;
    

    init () : Promise<any> {
        console.log("inside ZettelDrop init")
        this.userBase = new UserBase();
        this.persistenceLayer =  new PersistenceLayer(this.userBase);
        this.zettelKasten = new ZettelKasten(this.persistenceLayer);
        return this.persistenceLayer.init().then(()=> {
            if (this.zettelKasten == null) {
                throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION)
            }
            return this.zettelKasten.loadZettelsFromPersistenceLayer();
        })
    }


    logout () : void {
        this.user = null;
    }
    registerNewUser(username : string, password : string) : any {
        console.log("Attempting to register new user ", username);
        if (this.userBase == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        if (this.persistenceLayer == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        let isUserExists = this.userBase.checkUsernameExists(username);
        if (isUserExists) {
            return {
                status: 400,
                message : "Invalid username"
            };
        } else {
            let user = new User(username, password);
            this.userBase.addUser(user);
            this.persistenceLayer.saveNewUser(user);
            return {
                status: 201,
                message: "Created new user " + username
            }
        }
    }


    isLoggedIn () : boolean {
        return (this.user != null);
    }

    login (username : string, password : string) : boolean {
        if (this.userBase == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        let foundUser = this.userBase.getUserByName(username)
        if (foundUser == null) {
            return false;
        }
        if (foundUser.password == password) {
            this.user = foundUser;
            return true;
        } else {
            return false;
        }
    }
    
    async createNewZettel(zettelText: string) : Promise<any> {
        if (this.zettelKasten == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        if (this.userBase == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        try {
            if (this.user == null) {
                return Promise.resolve({
                    status : 403,
                    message : "not logged in"
                });
            } else if (!zettelText) {
                return Promise.resolve({
                    status : 400,
                    message : "zettel must contain text"
                });
            } else {
                let zettelId = this.zettelKasten.getNewZettelId()
                let username = this.user.username;
                let zet = new Zettel(zettelId, zettelText, username);
                await this.zettelKasten.addZettel(zet);
                console.log("added new zettel");
                console.log(zet);
                return {
                    zettel : zet,
                    status : 201,
                    message : "zettel created"
                }
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    constructor () {
    }

}