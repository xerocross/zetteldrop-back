import express from 'express';
import { Zettel } from "./objects/zettel";
const { ZettelKasten } = require("./objects/zettelkasten");
const { User } = require("./objects/User");
const { UserBase } = require("./objects/UserBase");
import { PersistenceLayer } from "./helpers/PersistenceLayer"
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


app.get('/count', function(req: any, res : any) {
    console.log("inside count");
    if(req.session.page_views){
       req.session.page_views++;
       res.send("You visited this page " + req.session.page_views + " times");
    } else {
       req.session.page_views = 1;
       res.send("Welcome to this page for the first time!");
    }
 });


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
        res.sendStatus(500);
    }
 });


app.get("/zettel/:zettelId", (req : any, res : any) => {
    try {
        if (!isLoggedIn(req)) {
            res.sendStatus(403);
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
                res.sendStatus(403);
            }

            
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
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
        res.sendStatus(500);
    }
});


loadTestZettels();
loadTestUsers();
app.use('/', express.static('public'));


persistenceLayer.init()
.then(()=>{
    app.listen(port, () => {
        if (console) {
            console.log(`App listening on port ${port}!`)
        }
    });
})


