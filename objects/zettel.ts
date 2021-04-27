export class Zettel {

    id: string;
    text: string;
    user: string;

    constructor(id : string, text : string, user : string) {
      this.id = id;
      this.text = text;
      this.user = user;
    }
}