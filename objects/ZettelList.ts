import { Zettel } from "./zettel";
import { StringUtils } from "../helpers/StringUtils";

export class ZettelList {
    zettels : Zettel[]

    constructor(zettels : Zettel[]) {
        this.zettels = zettels
    }

    push(zettel : Zettel) {
        this.zettels.push(zettel);
    }

    filterByUser(username : string) : ZettelList {
        let filteredList : ZettelList = new ZettelList([]);
        this.zettels.forEach((zet)=> {
            if (zet.user == username) {
                filteredList.push(zet)
            }
        })
        return filteredList;
    }

    filterByTag(tag : string) : ZettelList {
        let filteredList : ZettelList = new ZettelList([]);
        this.zettels.forEach(zet=> {
            let tags : string[] = StringUtils.getHashtags(zet.text)
            if (tags.includes(tag)) {
                filteredList.push(zet);
            }
        });
        return filteredList;
    }
}