import { User } from "./User"

export class UserBase {


    static getPersistenceObject (userBase : UserBase ) : any {
        let userArray : any[] = [];
        userBase.users.forEach(user => {
            userArray.push(User.getPersistenceObject(user))
        })
        return userArray;
    }

    users : User[] = [];

    checkUsernameExists(username : string) : boolean {
        let user = this.getUserByName(username);
        return (user != null);
    }

    getUserByName(username : string) : User | null {
        for (let user of this.users) {
            if (user.username == username) {
                return user;
            }
        }
        return null;
    }

    addUser(user : User) {
        let isUsernameTaken = this.checkUsernameExists(user.username);
        if (isUsernameTaken) {
            throw new Error("the chosen username is not available or allowed");
        } else {
            this.users.push(user);
        }
    }



    checkUserLogin(username : string, password : string) : boolean {
        let user = this.getUserByName(username);
        if (user != null) {
            if (password == user.password) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    register(username : string, password : string) :void {
        let user = new User(username, password);
        this.addUser(user);
    }

    static getFromStorage(usersArray : any) {
        for (let storageUser of usersArray) {
            let userbase = new UserBase();

        }

    }
}