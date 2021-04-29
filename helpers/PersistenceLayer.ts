import { ZettelKasten } from "../objects/ZettelKasten"
import { UserBase } from "../objects/UserBase";
import { User } from "../objects/User";
import {MongoClient} from "mongodb";
import { timeStamp } from "node:console";



export class PersistenceLayer {
    userBase : UserBase;
    client: MongoClient | null;
    isInitiated : boolean = false;
    static ZETTELKASTEN = "zettelkasten";
    static USER = "user";
    static ZETTELDROP = "zetteldrop";
    


    // async listDatabases(client){
    //     let databasesList = await client.db().admin().listDatabases();
     
    //     console.log("Databases:");
    //     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    // };

    
    async loadUsers() {
        console.log("inside loadUsers");
        try {
            if (this.client != null) {
                let db = await this.client.db(PersistenceLayer.ZETTELDROP);
                const collection = await db.collection(PersistenceLayer.USER);

                collection.find({}).forEach(userObject => {
                    console.log("userObj: ",userObject)
                    let user = new User(userObject.username, userObject.password)
                    this.userBase.addUser(user);
                });
            } else {
                console.log("client was null");
            }
        } catch (e) {
            console.error(e);
        }
    }


    isReady() : boolean {
        return this.isInitiated;
    }

    async getClient(): Promise<MongoClient | null> {
        return this.client;
    }

    async saveNewUser(user : User) {
        try {
            if (this.client != null) {
                let db = await this.client.db(PersistenceLayer.ZETTELDROP);
                const collection = db.collection(PersistenceLayer.USER);
                collection.insertOne(User.getPersistenceObject(user))
            } else {
                console.log("client was null");
            }
        } catch (e) {
            console.error(e);
        }
    }

    async saveUsers () {
        try {
            if (this.client != null) {
                await this.client.connect();
                
                let db = await this.client.db(PersistenceLayer.ZETTELDROP);
                const collection = db.collection(PersistenceLayer.USER);
                
                collection.deleteMany({});
                let userList = UserBase.getPersistenceObject(this.userBase);

                userList.forEach((user: any) => {
                    collection.insertOne(user);
                });
            } else {
                console.log("client was null");
            }
        } catch (e) {
            console.error(e);
        } finally {
            // if (this.client) {
            //     await this.client.close();
            // }
        }
    }



    async init () {
        const uri = "mongodb://localhost:27017/zetteldrop?authSource=admin"
        this.client = new MongoClient(uri);
        await this.client.connect();
        await this.loadUsers();
        this.isInitiated = true;
    }


    constructor (userBase : UserBase) {
        this.userBase = userBase;
        this.client = null;
    }


}