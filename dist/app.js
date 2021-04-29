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
//const { User } = require("./objects/User");
var UserBase = require("./objects/UserBase").UserBase;
var User_1 = require("./objects/User");
var ErrorMessages = require("./helpers/ErrorMessages").ErrorMessages;
// import { PersistenceLayer } from "./helpers/PersistenceLayer"
var PersistenceLayer = require("./helpers/PersistenceLayer").PersistenceLayer;
var express_session_1 = __importDefault(require("express-session"));
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var port = process.env.PORT || 3000;
var user = null;
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({}));
app.use(express_session_1.default({ secret: "Shh, its a secret!" }));
var userBase = new UserBase();
var persistenceLayer = new PersistenceLayer(userBase);
var zettelkasten = new ZettelKasten(persistenceLayer);
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
function loadTestUsers() {
    var e_2, _a;
    var rawData = fs_1.default.readFileSync('specUsers.json');
    var userObjects = JSON.parse(rawData.toString());
    try {
        for (var userObjects_1 = __values(userObjects), userObjects_1_1 = userObjects_1.next(); !userObjects_1_1.done; userObjects_1_1 = userObjects_1.next()) {
            var userObj = userObjects_1_1.value;
            var user_1 = new User_1.User(userObj.username, userObj.password);
            userBase.addUser(user_1);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (userObjects_1_1 && !userObjects_1_1.done && (_a = userObjects_1.return)) _a.call(userObjects_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
app.get('/usertest', function (req, res) {
    if (req.session.user) {
        res.send("Welcome, " + req.session.user + ".");
    }
    else {
        res.send("You are not logged in.");
    }
});
function isLoggedIn(req) {
    return (req.session.user);
}
app.get('/isloggedin', function (req, res) {
    if (req.session.user) {
        res.send("true");
    }
    else {
        res.send("false");
    }
});
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var isValidCredentials = userBase.checkUserLogin(username, password);
    if (isValidCredentials) {
        user = userBase.getUserByName(username);
        req.session.user = user === null || user === void 0 ? void 0 : user.username;
        res.send("Welcome, " + req.session.user + ".");
    }
    else {
        res.send("Invalid credentials.");
    }
});
app.post('/logout', function (req, res) {
    req.session.user = null;
    res.send("User has been logged out.");
});
app.post('/register', function (req, res) {
    try {
        if (isLoggedIn(req)) {
            res.status(400).send("You are logged in as " + req.session.user + ". To register as a new user, log out first.");
            return;
        }
        var username = req.body.username;
        var password = req.body.password;
        console.log("creating new user", username, password);
        var isUserExists = userBase.checkUsernameExists(username);
        if (isUserExists) {
            res.status(400).send("Invalid username.");
            return;
        }
        else {
            var user_2 = new User_1.User(username, password);
            userBase.addUser(user_2);
            persistenceLayer.saveNewUser(user_2);
            req.session.user = username;
            res.status(200).send("Created new user " + username);
            return;
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown, "guid:41be23f8-9ca5-4944-9261-7d85364d7d7c");
        console.log(e);
        res.sendStatus(500);
    }
});
app.get("/zettel/:zettelId", function (req, res) {
    try {
        if (!isLoggedIn(req)) {
            res.sendStatus(403);
            return;
        }
        var username = req.session.user;
        if (req.params.zettelId) {
            var queryId = req.params.zettelId;
            var zet = zettelkasten.getZettelById(queryId);
            if (zet != null && zet.user == username) {
                res.json({
                    "zettel": zet
                });
            }
            else {
                console.log("responding forbidden because user is not allowed to see zettel without logging in");
                res.sendStatus(403);
                return;
            }
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown, "guid:e4e4d583-a729-48b4-b594-42f67763e290");
        console.log(e);
        res.sendStatus(500);
    }
});
function authenticate(username, password) {
}
function login(username, password) {
}
app.post('/zettel', function (req, res) {
    try {
        if (isLoggedIn(req) && req.body.text) {
            var zettelText = req.body.text;
            var zettelId = zettelkasten.getNewZettelId();
            var user_3 = req.session.user;
            var zet_1 = new zettel_1.Zettel(zettelId, zettelText, user_3);
            zettelkasten.addZettel(zet_1)
                .then(function () {
                res.json(zet_1);
            })
                .catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown, "guid: 034402be-ba15-4f62-b63f-745e8d8b280c");
        console.log(e);
        res.sendStatus(500);
    }
});
app.post('/parselinks', function (req, res) {
    try {
        if (req.body.text) {
            var searchText = req.body.text;
            var ids = ZettelKasten.getLinksFromString(searchText);
            res.json(ids);
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (e) {
        console.log(ErrorMessages.unknown, "guid: 915d1e04-6af8-4218-aee7-3b9486c5ccb6");
        console.log(e);
        res.sendStatus(500);
    }
});
app.get("/zettels", function (req, res) {
    if (user == null) {
        res.status(400).send("not logged in");
        return;
    }
    else {
        var zettels = zettelkasten.getIds(user);
        res.json(zettels);
        return;
    }
});
app.post("/zettels/query", function (req, res) {
    var queryString = req.body.query;
    if (queryString == null) {
        res.status(400).send("no query string");
        return;
    }
    if (user == null) {
        res.status(400).send("not logged in");
        return;
    }
    var username = user.username;
    var zettels = zettelkasten.queryZettles(username, queryString);
    res.json(zettels);
});
app.use('/', express_1.default.static('public'));
persistenceLayer.init()
    .then(function () {
    zettelkasten.loadZettelsFromPersistenceLayer();
    app.listen(port, function () {
        if (console) {
            console.log("App listening on port " + port + "!");
        }
    });
});
