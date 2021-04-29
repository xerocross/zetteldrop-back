export declare class User {
    username: string;
    password: string;
    static getPersistenceObject(user: User): any;
    constructor(username: string, password: string);
}
