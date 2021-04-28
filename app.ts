import express from 'express';
import { Zettel } from "./objects/zettel";
const { ZettelKasten } = require("./objects/zettelkasten")

import fs from 'fs';
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}));
app.use(express.json({}));

let zettelkasten = new ZettelKasten();

function loadTestZettels() {
    let rawdata = fs.readFileSync('specZettels.json');
    let zettelObjects = JSON.parse(rawdata.toString());
    for (let zettelObj of zettelObjects) {
        let zet = new Zettel(zettelObj.id, zettelObj.text, zettelObj.user)
        zettelkasten.addZettel(zet);
    }
}


app.get("/zettel/:zettelId", (req : any, res : any) => {
        if (req.params.zettelId) {
        let queryId = req.params.zettelId;
        let zet = zettelkasten.getZettelById(queryId);
        res.json({
            "zettel" : zet
        })
    } else {
        res.setStatus(400);
    }
});

app.post('/zettel', (req : any, res : any) => {
    try {
        if (req.body.text) {
            let zettelText = req.body.text;
            let zettelId = zettelkasten.getNewZettelId()
            let user = req.body.user;
            let zet = new Zettel(zettelId, zettelText, user);
            zettelkasten.addZettel(zet);
            res.json(zet);
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


loadTestZettels()

app.listen(port, () => {
    if (console) {
        console.log(`App listening on port ${port}!`)
    }
});