import { Zettel } from "./zettel";
export declare class ZettelKasten {
    zettels: Zettel[];
    static getLinksFromString(text: string): string[];
    private getRand;
    getNewZettelId(): string;
    addZettel(zettel: Zettel): void;
    getZettelById(id: string): Zettel | undefined;
    getLinkedZettels(zettel: Zettel): void;
    getIds(): string[];
}
