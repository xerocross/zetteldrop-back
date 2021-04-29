export declare class Zettel {
    id: string;
    text: string;
    user: string;
    static getPersistenceObject(zettel: Zettel): {
        id: string;
        text: string;
        user: string;
    };
    constructor(id: string, text: string, user: string);
}
