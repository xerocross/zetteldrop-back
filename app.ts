import express from 'express';
import { ErrorMessages } from "./helpers/ErrorMessages"
import {ZettelDrop} from "./objects/ZettelDrop"
import session from "express-session"

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}));
app.use(express.json({}));
app.use(session({"secret" : "31efaea8-c74e-4896-b191-c86d343d8d2c"}));

let zettelDrop = new ZettelDrop();


 app.get('/isloggedin', function(req: any, res : any) {
    if (zettelDrop.isLoggedIn()) {
        res.send("true");
    } else {
        res.send("false");
    }
 });

 app.post('/login', function(req: any, res : any) {
    let username = req.body.username;
    let password = req.body.password;
    let isLoginSuccessful = zettelDrop.login(username, password);
    if (isLoginSuccessful) {
        let username = zettelDrop.user?.username;
        req.session.user = username;
        res.send("Welcome, " + req.session.user + ".");
    } else {
        res.send("Invalid credentials.");
    }
 });
 

 app.post('/logout', function(req: any, res : any) {
    req.session.user = null;
    zettelDrop.logout();
    res.status(200).send("User has been logged out.");
 });


 app.post('/register', function(req: any, res : any) {
    try {
        if (isLoggedIn(req)) {
            res.status(400).send("You are logged in as " + req.session.user + ". To register as a new user, log out first.");
            return;
        }
        let username = req.body.username;
        let password = req.body.password;
        let response : any = zettelDrop.registerNewUser(username, password);
        res.status(response.code).send(response.message);
        return;
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
        let id = req.params.zettelId;

        if (zettelDrop.zettelKasten == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }

        if (id) {
            let zet = zettelDrop.zettelKasten.userQueryById(username, id);
            if (zet != null) {
                res.json({
                    "zettel" : zet
                })
            } else {
                console.log("requested " + id + ": no such zettel owned by the user was found")
                res.sendStatus(404);
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


function isLoggedIn(req) {
    return (req.session.user != null)
}


app.post('/zettel', (req : any, res : any) => {
    if (!isLoggedIn(req)) {
        res.sendStatus(403);
        return;
    }
    let zettelText = req.body.text;
    try {
        zettelDrop.createNewZettel(zettelText)
        .then((response)=> {
            if (response.status == 201) {
                res.status(response.status).json(response.zettel);
            } else {
                res.status(response.status).send(response.message);
            }
        })
        .catch((e)=> {
            console.log(e);
            res.sendStatus(500);
        })
    } catch (e) {
        console.log(ErrorMessages.unknown,"guid: 034402be-ba15-4f62-b63f-745e8d8b280c");
        console.log(e);
        res.sendStatus(500);
    }
})

// app.post('/parselinks', (req : any, res : any) => {
//     try {
//         if (req.body.text) {
//             let searchText = req.body.text;
//             let ids = ZettelKasten.getLinksFromString(searchText);
//             res.json(ids);
//         } else {
//             res.sendStatus(400);
//         }
//     }
//     catch (e) {
//         console.log(ErrorMessages.unknown,"guid: 915d1e04-6af8-4218-aee7-3b9486c5ccb6");
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

app.get("/zettels", (req : any, res: any) => {
    if (zettelDrop.user == null) {
        res.status(400).send("not logged in");
        return;
    } else {
        if (zettelDrop.zettelKasten == null) {
            throw new Error(ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        console.log("user", zettelDrop.user);
        let zettels = zettelDrop.zettelKasten.getIds(zettelDrop.user);
        res.json(zettels);
        return;
    }
});


// app.post("/zettels/query", (req , res) => {
//     let queryString = req.body.query;
//     if (queryString == null) {
//         res.status(400).send("no query string");
//         return;
//     }
//     if (user == null) {
//         res.status(400).send("not logged in");
//         return;
//     }
//     let username = user.username;
//     let zettels : Zettel[] = zettelkasten.queryZettles(username, queryString);
//     res.json(zettels);
// });


app.use('/', express.static('public'));

zettelDrop.init()
.then(()=>{
    //zettelkasten.loadZettelsFromPersistenceLayer();
    app.listen(port, () => {
        if (console) {
            console.log(`App listening on port ${port}!`)
        }
    });
})


