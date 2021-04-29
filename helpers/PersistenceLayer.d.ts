import { UserBase } from "../objects/UserBase";
import { User } from "../objects/User";
import { MongoClient } from "mongodb";
export declare class PersistenceLayer {
    userBase: UserBase;
    client: MongoClient | null;
    isInitiated: boolean;
    static ZETTELKASTEN: string;
    static USER: string;
    static ZETTELDROP: string;
    loadUsers(): Promise<void>;
    isReady(): boolean;
    getClient(): Promise<MongoClient | null>;
    saveNewUser(user: User): Promise<void>;
    saveUsers(): Promise<void>;
    init(): Promise<void>;
    constructor(userBase: UserBase);
}
