export class User {
    username : string;
    password : string;

    static getPersistenceObject(user : User) : any {
        return {
            username : user.username,
            password : user.password
        };
    }

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}