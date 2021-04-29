import { Zettel } from "./zettel";
export declare class ZettelList {
    zettels: Zettel[];
    constructor(zettels: Zettel[]);
    push(zettel: Zettel): void;
    filterByUser(username: string): ZettelList;
    filterByTag(tag: string): ZettelList;
}
