import express from 'express';
import { Zettel } from "./objects/zettel";
const { ZettelKasten } = require("./objects/zettelkasten");
const { User } = require("./objects/User");
const { UserBase } = require("./objects/UserBase");
const { ErrorMessages } = require("./helpers/ErrorMessages")
// import { PersistenceLayer } from "./helpers/PersistenceLayer"
const { PersistenceLayer } = require("./helpers/PersistenceLayer")
import session from "express-session"

import fs from 'fs';
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}));
app.use(express.json({}));
app.use(session({secret: "Shh, its a secret!"}));



let userBase = new UserBase();
let persistenceLayer =  new PersistenceLayer(userBase);
let zettelkasten = new ZettelKasten(persistenceLayer);


function loadTestZettels() {
    let rawdata = fs.readFileSync('specZettels.json');
    let zettelObjects = JSON.parse(rawdata.toString());
    for (let zettelObj of zettelObjects) {
        let zet = new Zettel(zettelObj.id, zettelObj.text, zettelObj.user)
        zettelkasten.addZettel(zet);
    }
}

function loadTestUsers() {
    let rawData = fs.readFileSync('specUsers.json');
    let userObjects = JSON.parse(rawData.toString());
    for (let userObj of userObjects) {
        let user = new User(userObj.username, userObj.password);
        userBase.addUser(user);
    }
}

 app.get('/usertest', function(req: any, res : any) {
    if(req.session.user) {
       res.send("Welcome, " + req.session.user + ".");
    } else {
       res.send("You are not logged in.");
    }
 });

function isLoggedIn(req: any) {
    return (req.session.user);
}

 app.get('/isloggedin', function(req: any, res : any) {
    if (req.session.user) {
        res.send("true");
    } else {
        res.send("false");
    }
 });

 app.post('/login', function(req: any, res : any) {
    let username = req.body.username;
    let password = req.body.password;
    let isValidCredentials = userBase.checkUserLogin(username, password);
    if (isValidCredentials) {
        req.session.user = username
        res.send("Welcome, " + req.session.user + ".");
    } else {
        res.send("Invalid credentials.");
    }
 });
 
 app.post('/logout', function(req: any, res : any) {
    req.session.user = null;
    res.send("User has been logged out.");
 });


 app.post('/register', function(req: any, res : any) {
    try {
        if (isLoggedIn(req)) {
            res.status(400).send("You are logged in as " + req.session.user + ". To register as a new user, log out first.");
            return;
        }

        let username = req.body.username;
        let password = req.body.password;
        console.log("creating new user", username, password);
        let isUserExists = userBase.checkUsernameExists(username);
        if (isUserExists) {
            res.status(400).send("Invalid username.");
            return;
        } else {
            let user = new User(username, password);
            userBase.addUser(user);
            persistenceLayer.saveNewUser(user);
            req.session.user = username
            res.status(200).send("Created new user " + username);
            return;
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown,"guid:41be23f8-9ca5-4944-9261-7d85364d7d7c")
        console.log(e);
        res.sendStatus(500);
    }
 });


app.get("/zettel/:zettelId", (req : any, res : any) => {
    try {
        if (!isLoggedIn(req)) {
            res.sendStatus(403);
            return;
        }
        let username = req.session.user;

        if (req.params.zettelId) {
            let queryId = req.params.zettelId;
            let zet = zettelkasten.getZettelById(queryId);

            if (zet != null && zet.user == username) {
                res.json({
                    "zettel" : zet
                })
            } else {
                console.log("responding forbidden because user is not allowed to see zettel without logging in");
                res.sendStatus(403);
                return;
            }

            
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        console.log(ErrorMessages.unknown,"guid:e4e4d583-a729-48b4-b594-42f67763e290");
        console.log(e);
        res.sendStatus(500);
    }
});

function authenticate(username : string, password : string) {

}

function login(username : string, password : string) {

}

app.post('/zettel', (req : any, res : any) => {
    try {
        if (isLoggedIn(req) && req.body.text) {
            let zettelText = req.body.text;
            let zettelId = zettelkasten.getNewZettelId()
            let user = req.session.user;
            let zet = new Zettel(zettelId, zettelText, user);
            zettelkasten.addZettel(zet)
            .then(()=> {
                res.json(zet);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        console.log(ErrorMessages.unknown,"guid: 034402be-ba15-4f62-b63f-745e8d8b280c");
        console.log(e);
        res.sendStatus(500);
    }
})

app.post('/parselinks', (req : any, res : any) => {
    try {
        if (req.body.text) {
            let searchText = req.body.text;
            let ids = ZettelKasten.getLinksFromString(searchText);
            res.json(ids);
        } else {
            res.sendStatus(400);
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown,"guid: 915d1e04-6af8-4218-aee7-3b9486c5ccb6");
        console.log(e);
        res.sendStatus(500);
    }
});

app.use('/', express.static('public'));

persistenceLayer.init()
.then(()=>{
    zettelkasten.loadZettelsFromPersistenceLayer();
    app.listen(port, () => {
        if (console) {
            console.log(`App listening on port ${port}!`)
        }
    });
})


