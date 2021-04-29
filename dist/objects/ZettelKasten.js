"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZettelKasten = void 0;
var PersistenceLayer_1 = require("../helpers/PersistenceLayer");
var zettel_1 = require("./zettel");
var ZettelKasten = /** @class */ (function () {
    function ZettelKasten(persistenceLayer) {
        this.zettels = [];
        this.ZETTEL = "ZETTEL";
        this.user = null;
        this.persistenceLayer = persistenceLayer;
    }
    ZettelKasten.prototype.setUser = function (user) {
        this.user = user;
    };
    ZettelKasten.getLinksFromString = function (text) {
        var e_1, _a;
        var re = /\[\[([0-9a-zA-Z\-]+)\]\]/g;
        var matches = text.matchAll(re);
        console.log(matches);
        //et array = [...text.matchAll(re)];
        var ids = [];
        try {
            for (var matches_1 = __values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                var match = matches_1_1.value;
                console.log("match", match);
                ids.push(match[1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ids;
    };
    ZettelKasten.getPersistenceObject = function (zettelkasten) {
        var persistenceArray = [];
        var zettels = zettelkasten.zettels;
        zettels.forEach(function (zettel) {
            console.log("adding zettel to database: ", zettel);
            persistenceArray.push(zettel_1.Zettel.getPersistenceObject(zettel));
        });
        return zettels;
    };
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
    ZettelKasten.prototype.getRand = function () {
        var randomScale = 10000;
        return Math.floor(Math.random() * randomScale);
    };
    ZettelKasten.prototype.saveZettel = function (zettel) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.persistenceLayer.getClient()
                            .then(function (client) {
                            if (client != null) {
                                var db = client.db(PersistenceLayer_1.PersistenceLayer.ZETTELDROP);
                                var collection = db.collection(_this.ZETTEL);
                                console.log("saving zettel");
                                return collection.insertOne(zettel_1.Zettel.getPersistenceObject(zettel))
                                    .then(function () {
                                    console.log("saved zettel", zettel);
                                })
                                    .catch(function () {
                                    console.log("could not save zettel", zettel);
                                });
                            }
                            else {
                                throw new Error("client was null");
                            }
                        })];
                }
                catch (e) {
                    console.error(e);
                    throw new Error(e);
                }
                return [2 /*return*/];
            });
        });
    };
    ZettelKasten.prototype.getNewZettelId = function () {
        return Date.now().toString() + this.getRand().toString();
    };
    ZettelKasten.prototype.addZettel = function (zettel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.zettels.push(zettel);
                        return [4 /*yield*/, this.saveZettel(zettel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ZettelKasten.prototype.getZettelById = function (id) {
        var zet = null;
        for (var i = 0; i < this.zettels.length; i++) {
            if (this.zettels[i].id == id) {
                zet = this.zettels[i];
                break;
            }
        }
        return zet;
    };
    ZettelKasten.prototype.isZettleExists = function (id) {
        return (this.getZettelById(id) != null);
    };
    ZettelKasten.prototype.getLinkedZettels = function (zettel) {
    };
    ZettelKasten.prototype.loadZettelsFromPersistenceLayer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.persistenceLayer.getClient()
                        .then(function (client) {
                        if (client != null) {
                            var db = client.db(PersistenceLayer_1.PersistenceLayer.ZETTELDROP);
                            var collection = db.collection(_this.ZETTEL);
                            collection.find({}).forEach(function (storedZettel) {
                                var id = storedZettel.id;
                                var isZettleAlreadyExists = _this.isZettleExists(id);
                                if (_this.isZettleExists(id)) {
                                    throw new Error("found duplicate zettle");
                                }
                                else {
                                    var zettel = new zettel_1.Zettel(storedZettel.id, storedZettel.text, storedZettel.user);
                                    console.log("init load of zettel ", zettel);
                                    _this.zettels.push(zettel);
                                }
                            });
                        }
                    })];
            });
        });
    };
    ZettelKasten.prototype.getIds = function () {
        var e_2, _a;
        var ids = [];
        try {
            for (var _b = __values(this.zettels), _c = _b.next(); !_c.done; _c = _b.next()) {
                var zet = _c.value;
                ids.push(zet.id);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return ids;
    };
    return ZettelKasten;
}());
exports.ZettelKasten = ZettelKasten;
