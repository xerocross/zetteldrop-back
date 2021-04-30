import { ZettelKasten } from "./ZettelKasten";
import { User } from "./User";
import { UserBase } from "./UserBase";
import { PersistenceLayer } from "../helpers/PersistenceLayer";
export declare class ZettelDrop {
    zettelKasten: ZettelKasten | null;
    userBase: UserBase | null;
    user: User | null;
    persistenceLayer: PersistenceLayer | null;
    init(): Promise<any>;
    logout(): void;
    registerNewUser(username: string, password: string): any;
    isLoggedIn(): boolean;
    login(username: string, password: string): boolean;
    createNewZettel(zettelText: string): Promise<any>;
    constructor();
}
