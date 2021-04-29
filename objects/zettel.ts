export class Zettel {

    id: string;
    text: string;
    user: string;

    static getPersistenceObject(zettel: Zettel) {
      return {
        id : zettel.id,
        text : zettel.text,
        user : zettel.user
      }
    }


    constructor(id : string, text : string, user : string) {
      this.id = id;
      this.text = text;
      this.user = user;
    }
}