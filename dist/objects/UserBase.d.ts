import { User } from "./User";
export declare class UserBase {
    static getPersistenceObject(userBase: UserBase): any;
    users: User[];
    checkUsernameExists(username: string): boolean;
    getUserByName(username: string): User | null;
    addUser(user: User): void;
    checkUserLogin(username: string, password: string): boolean;
    register(username: string, password: string): void;
    static getFromStorage(usersArray: any): void;
}
