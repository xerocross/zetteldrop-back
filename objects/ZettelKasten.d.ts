import { Zettel } from "./zettel";
import {PersistenceLayer} from "../helpers/PersistenceLayer"
export declare class ZettelKasten {
    zettels: Zettel[];
    persistenceLayer : PersistenceLayer;
    static getLinksFromString(text: string): string[];
    private getRand;
    getNewZettelId(): string;
    addZettel(zettel: Zettel): void;
    getZettelById(id: string): Zettel | undefined;
    getLinkedZettels(zettel: Zettel): void;
    getIds(): string[];
}
