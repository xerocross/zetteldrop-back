import { Zettel } from "./zettel";


export class ZettelKasten {
    zettels : Zettel[] = [];

    static getLinksFromString (text : string) {
        let re = /\[\[([0-9a-zA-Z\-]+)\]\]/g
        let matches = text.matchAll(re)
        console.log(matches);
        //et array = [...text.matchAll(re)];
        let ids : string[] = [];
        for (let match of matches) {
            console.log("match", match);
            ids.push(match[1]);
        }
        return ids;
    } 

    private getRand() {
        const randomScale = 10000;
        return Math.floor(Math.random()*randomScale);
    }

    getNewZettelId() {
        return Date.now().toString() + this.getRand().toString();
    }

    addZettel (zettel : Zettel) {
        this.zettels.push(zettel);
    }

    getZettelById (id : string) {
        for (let i = 0; i < this.zettels.length; i++) {
            if (this.zettels[i].id == id) {
                return this.zettels[i]
            }
        }
    }

    getLinkedZettels (zettel : Zettel) {
    }



    getIds () : string[] {
        let ids = [];
        for (let zet of this.zettels) {
            ids.push(zet.id);
        }
        return ids;
    }
}