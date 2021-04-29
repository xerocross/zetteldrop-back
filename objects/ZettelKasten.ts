import { PersistenceLayer } from "helpers/PersistenceLayer";
import { MongoClient } from "mongodb";
import { Zettel } from "./zettel";


export class ZettelKasten {
    zettels : Zettel[] = [];
    persistenceLayer : PersistenceLayer;
    ZETTEL : string = "ZETTEL";

    constructor(persistenceLayer : PersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
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


    
    // async saveZettels () {
    //     try {
    //         if (this.client != null) {
    //             let db = await this.client.db(PersistenceLayer.ZETTELDROP);
    //             const collection = db.collection(PersistenceLayer.ZETTELKASTEN);
    //             let zetList = ZettelKasten.getPersistenceObject(this.zettelKasten)
    //             collection.deleteMany({});
    //             zetList.forEach(zettel => {
    //                 collection.insertOne(zettel);
    //             });
    //         } else {
    //             console.log("client was null");
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         // if (this.client) {
    //         //     await this.client.close();
    //         // }
    //     }
    // // }



    async saveZettel(zettel : Zettel) {
        try {
            return this.persistenceLayer.getClient()
            .then((client) => {
                if (client != null) { 
                    let db = client.db(PersistenceLayer.ZETTELDROP);
                    const collection = db.collection(this.ZETTEL);
                    return collection.insertOne(Zettel.getPersistenceObject(zettel));
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

    getLinkedZettels (zettel : Zettel) {
    }

    async loadZettelsFromPersistenceLayer() {
        return this.persistenceLayer.getClient()
        .then((client) => { 
            
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