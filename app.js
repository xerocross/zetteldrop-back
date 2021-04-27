const express = require('express')
const { Zettel } = require("./objects/zettel")
const { ZettelKasten } = require("./objects/zettelkasten")

const fs = require('fs');
const cors = require("cors");
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));

let zettelkasten = new ZettelKasten();

function loadTestZettels() {
    let rawdata = fs.readFileSync('specZettels.json');
    let zettelObjects = JSON.parse(rawdata);
    for (let zettelObj of zettelObjects) {
        let zet = new Zettel(zettelObj.id, zettelObj.text, zettelObj.user)
        zettelkasten.addZettel(zet);
    }
}


app.get("/zettel/:zettelId", (req, res) => {
        console.log("inside get 2");
        if (req.params.zettelId) {
        let queryId = req.params.zettelId;
        let zet = zettelkasten.getZettelById(queryId);
        res.json(zet)
    } else {
        res.setStatus(400);
    }
});

app.post('/zettel', (req, res) => {
    console.log('Got text: ', req.body.text);
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
})


loadTestZettels()
app.listen(port, () => console.log(`App listening on port ${port}!`))