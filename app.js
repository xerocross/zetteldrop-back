const express = require('express')
const { Zettel } = require("./classes/zettel")

const fs = require('fs');
const cors = require("cors");
const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));

let zettels;

function loadSpecZettels() {
    let rawdata = fs.readFileSync('specZettels.json');
    let zettelObjects = JSON.parse(rawdata);
    zettels = zettelObjectToClass(zettelObjects);
}


function zettelObjectToClass(zettelObjects) {
    let zettels = [];
    for (let obj of zettelObjects) {
        zettels.push(new Zettel(obj.id, obj.text, obj.user));
    }
    return zettels;
}

function getZettelById(id) {
    for (let i = 0; i < zettels.length; i++) {
        if (zettels[i].id == id) {
            return zettels[i]
        }
    }
}

function getIds() {
    let ids = [];
    for (let zet of zettels) {
        ids.push(zet.id);
    }
    return ids;
}

function getRand() {
    const randomScale = 10000;
    return Math.floor(Math.random()*randomScale);
}

function newZettel(id, text, user) {

}

function getNewZettelId() {
    return Date.now().toString() + getRand().toString();
}


app.get('/getById', (req, res) => {
    let queryId = req.query.id;
    let zet = getZettelById(queryId);
    res.send(JSON.stringify(zet));
})

app.post('/zettel', (req, res) => {
    console.log('Got text: ', req.body.text);
    if (req.body.text) {
        let zettelText = req.body.text;
        let zettelId = getNewZettelId();
        let user = "adam";
        let zet = new Zettel(zettelId, zettelText, user);
        zettels.push(zet);
        res.json(zet);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})

loadSpecZettels()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))