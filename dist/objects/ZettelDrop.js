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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZettelDrop = void 0;
var ZettelKasten_1 = require("./ZettelKasten");
var zettel_1 = require("./zettel");
var User_1 = require("./User");
var UserBase_1 = require("./UserBase");
var PersistenceLayer_1 = require("../helpers/PersistenceLayer");
var ErrorMessages_1 = require("../helpers/ErrorMessages");
var ZettelDrop = /** @class */ (function () {
    function ZettelDrop() {
        this.zettelKasten = null;
        this.userBase = null;
        this.user = null;
        this.persistenceLayer = null;
    }
    ZettelDrop.prototype.init = function () {
        var _this = this;
        console.log("inside ZettelDrop init");
        this.userBase = new UserBase_1.UserBase();
        this.persistenceLayer = new PersistenceLayer_1.PersistenceLayer(this.userBase);
        this.zettelKasten = new ZettelKasten_1.ZettelKasten(this.persistenceLayer);
        return this.persistenceLayer.init().then(function () {
            if (_this.zettelKasten == null) {
                throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
            }
            return _this.zettelKasten.loadZettelsFromPersistenceLayer();
        });
    };
    ZettelDrop.prototype.logout = function () {
        this.user = null;
    };
    ZettelDrop.prototype.registerNewUser = function (username, password) {
        console.log("Attempting to register new user ", username);
        if (this.userBase == null) {
            throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        if (this.persistenceLayer == null) {
            throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        var isUserExists = this.userBase.checkUsernameExists(username);
        if (isUserExists) {
            return {
                status: 400,
                message: "Invalid username"
            };
        }
        else {
            var user = new User_1.User(username, password);
            this.userBase.addUser(user);
            this.persistenceLayer.saveNewUser(user);
            return {
                status: 201,
                message: "Created new user " + username
            };
        }
    };
    ZettelDrop.prototype.isLoggedIn = function () {
        return (this.user != null);
    };
    ZettelDrop.prototype.login = function (username, password) {
        if (this.userBase == null) {
            throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
        }
        var foundUser = this.userBase.getUserByName(username);
        if (foundUser == null) {
            return false;
        }
        if (foundUser.password == password) {
            this.user = foundUser;
            return true;
        }
        else {
            return false;
        }
    };
    ZettelDrop.prototype.createNewZettel = function (zettelText) {
        return __awaiter(this, void 0, void 0, function () {
            var zettelId, username, zet, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.zettelKasten == null) {
                            throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
                        }
                        if (this.userBase == null) {
                            throw new Error(ErrorMessages_1.ErrorMessages.OUT_OF_ORDER_EXCEPTION);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!(this.user == null)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.resolve({
                                status: 403,
                                message: "not logged in"
                            })];
                    case 2:
                        if (!!zettelText) return [3 /*break*/, 3];
                        return [2 /*return*/, Promise.resolve({
                                status: 400,
                                message: "zettel must contain text"
                            })];
                    case 3:
                        zettelId = this.zettelKasten.getNewZettelId();
                        username = this.user.username;
                        zet = new zettel_1.Zettel(zettelId, zettelText, username);
                        return [4 /*yield*/, this.zettelKasten.addZettel(zet)];
                    case 4:
                        _a.sent();
                        console.log("added new zettel");
                        console.log(zet);
                        return [2 /*return*/, {
                                zettel: zet,
                                status: 201,
                                message: "zettel created"
                            }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ZettelDrop;
}());
exports.ZettelDrop = ZettelDrop;
