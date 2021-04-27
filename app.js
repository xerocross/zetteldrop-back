"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var zettel_1 = require("./objects/zettel");
var ZettelKasten = require("./objects/zettelkasten").ZettelKasten;
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var port = process.env.PORT || 3000;
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({}));
var zettelkasten = new ZettelKasten();
function loadTestZettels() {
    var e_1, _a;
    var rawdata = fs_1.default.readFileSync('specZettels.json');
    var zettelObjects = JSON.parse(rawdata.toString());
    try {
        for (var zettelObjects_1 = __values(zettelObjects), zettelObjects_1_1 = zettelObjects_1.next(); !zettelObjects_1_1.done; zettelObjects_1_1 = zettelObjects_1.next()) {
            var zettelObj = zettelObjects_1_1.value;
            var zet = new zettel_1.Zettel(zettelObj.id, zettelObj.text, zettelObj.user);
            zettelkasten.addZettel(zet);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (zettelObjects_1_1 && !zettelObjects_1_1.done && (_a = zettelObjects_1.return)) _a.call(zettelObjects_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
app.get("/zettel/:zettelId", function (req, res) {
    console.log("inside get 2");
    if (req.params.zettelId) {
        var queryId = req.params.zettelId;
        var zet = zettelkasten.getZettelById(queryId);
        res.json({
            "zettel": zet
        });
    }
    else {
        res.setStatus(400);
    }
});
app.post('/zettel', function (req, res) {
    if (req.body.text) {
        var zettelText = req.body.text;
        var zettelId = zettelkasten.getNewZettelId();
        var user = req.body.user;
        var zet = new zettel_1.Zettel(zettelId, zettelText, user);
        zettelkasten.addZettel(zet);
        res.json(zet);
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/parselinks', function (req, res) {
    console.log("links");
    if (req.body.text) {
        console.log("text", req.body.text);
        var searchText = req.body.text;
        var ids = ZettelKasten.getLinksFromString(searchText);
        res.json(ids);
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/link', function (req, res) {
    console.log("links");
    if (req.body.text) {
        console.log("text", req.body.text);
        var searchText = req.body.text;
        var ids = ZettelKasten.getLinksFromString(searchText);
        res.json(ids);
    }
    else {
        res.sendStatus(400);
    }
});
loadTestZettels();
app.listen(port, function () { return console.log("App listening on port " + port + "!"); });
