import { PersistenceLayer } from "../helpers/PersistenceLayer";
import { User } from "./User";
import { Zettel } from "./zettel";
export declare class ZettelKasten {
    zettels: Zettel[];
    persistenceLayer: PersistenceLayer;
    ZETTEL: string;
    user: User | null;
    constructor(persistenceLayer: PersistenceLayer);
    setUser(user: User): void;
    static getLinksFromString(text: string): string[];
    static getPersistenceObject(zettelkasten: ZettelKasten): any;
    private getRand;
    saveZettel(zettel: Zettel): Promise<void>;
    getNewZettelId(): string;
    addZettel(zettel: Zettel): Promise<void>;
    getZettelById(id: string): Zettel | null;
    userQueryById(username: string, id: string): Zettel | null;
    isZettleExists(id: string): boolean;
    getLinkedZettels(zettel: Zettel): void;
    queryZettles(username: string, queryString: string): Zettel[];
    findZettelsByTags(tags: string[]): void;
    getZettelsByIds(ids: string[]): Zettel[];
    loadZettelsFromPersistenceLayer(): Promise<boolean>;
    getIds(user: User): string[];
}
