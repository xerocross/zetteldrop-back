import { PersistenceLayer } from "../helpers/PersistenceLayer";
import { User } from "./User"
import { Zettel } from "./zettel";


export class ZettelKasten {
    zettels : Zettel[] = [];
    persistenceLayer : PersistenceLayer;
    ZETTEL : string = "ZETTEL";
    user : User | null = null;

    constructor(persistenceLayer : PersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    setUser (user : User) : void {
        this.user = user;
    }

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

    static getPersistenceObject(zettelkasten : ZettelKasten) : any {
        let persistenceArray : any = [];
        let zettels = zettelkasten.zettels;
        zettels.forEach(zettel => {
            console.log("adding zettel to database: ", zettel)
            persistenceArray.push(Zettel.getPersistenceObject(zettel))
        })
        return zettels;
    }

    // static getTags (text : string) {
    //     let re = / /g
    //     let matches = text.matchAll(re)
    //     console.log(matches);
    //     let ids : string[] = [];
    //     for (let match of matches) {
    //         ids.push(match[1]);
    //     }
    //     return ids;
    // }

    private getRand() {
        const randomScale = 10000;
        return Math.floor(Math.random()*randomScale);
    }

    async saveZettel(zettel : Zettel) {
        try {
            return this.persistenceLayer.getClient()
            .then((client) => {
                if (client != null) { 
                    let db = client.db(PersistenceLayer.ZETTELDROP);
                    const collection = db.collection(this.ZETTEL);
                    console.log("saving zettel")
                    return collection.insertOne(Zettel.getPersistenceObject(zettel))
                    .then(()=>{
                        console.log("saved zettel", zettel)
                    })
                    .catch(()=> {
                        console.log("could not save zettel", zettel)
                    })
                } else {
                    throw new Error("client was null");
                }
            })
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    getNewZettelId() {
        return Date.now().toString() + this.getRand().toString();
    }

    async addZettel (zettel : Zettel) {
        this.zettels.push(zettel);
        await this.saveZettel(zettel);
    }

    getZettelById (id : string) : Zettel | null {
        let zet : Zettel | null = null;
        for (let i = 0; i < this.zettels.length; i++) {
            if (this.zettels[i].id == id) {
                zet = this.zettels[i];
                break;
            }
        }
        return zet;
    }

    isZettleExists( id : string) {
        return (this.getZettelById(id) != null);
    }

    getLinkedZettels (zettel : Zettel) {
    }

    

    async loadZettelsFromPersistenceLayer() {
        return this.persistenceLayer.getClient()
        .then((client) => { 
            if (client!= null) {
                let db = client.db(PersistenceLayer.ZETTELDROP);
                const collection = db.collection(this.ZETTEL);
                collection.find({}).forEach(storedZettel => {
                    let id = storedZettel.id;
                    let isZettleAlreadyExists = this.isZettleExists(id);
                    if (this.isZettleExists(id)) {
                        throw new Error("found duplicate zettle")
                    } else {
                        let zettel = new Zettel(storedZettel.id, storedZettel.text, storedZettel.user);
                        console.log("init load of zettel ", zettel);
                        this.zettels.push(zettel);
                    }

                })
            }
            
        });
    }

    getIds () : string[] {
        let ids: string[] = [];
        for (let zet of this.zettels) {
            ids.push(zet.id);
        }
        return ids;
    }
}