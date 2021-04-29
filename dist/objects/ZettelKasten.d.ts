import { PersistenceLayer } from "helpers/PersistenceLayer";
import { Zettel } from "./zettel";
export declare class ZettelKasten {
    zettels: Zettel[];
    persistenceLayer: PersistenceLayer;
    constructor(persistenceLayer: PersistenceLayer);
    static getLinksFromString(text: string): string[];
    static getPersistenceObject(zettelkasten: ZettelKasten): any;
    private getRand;
    private static saveZettel;
    getNewZettelId(): string;
    addZettel(zettel: Zettel): void;
    getZettelById(id: string): Zettel | null;
    getLinkedZettels(zettel: Zettel): void;
    getIds(): string[];
}
