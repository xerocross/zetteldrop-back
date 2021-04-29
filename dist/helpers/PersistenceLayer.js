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
exports.PersistenceLayer = void 0;
var UserBase_1 = require("../objects/UserBase");
var User_1 = require("../objects/User");
var mongodb_1 = require("mongodb");
var PersistenceLayer = /** @class */ (function () {
    function PersistenceLayer(userBase) {
        this.isInitiated = false;
        this.userBase = userBase;
        this.client = null;
    }
    // async listDatabases(client){
    //     let databasesList = await client.db().admin().listDatabases();
    //     console.log("Databases:");
    //     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    // };
    PersistenceLayer.prototype.loadUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("inside loadUsers");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!(this.client != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.client.db(PersistenceLayer.ZETTELDROP)];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.collection(PersistenceLayer.USER)];
                    case 3:
                        collection = _a.sent();
                        collection.find({}).forEach(function (userObject) {
                            console.log("userObj: ", userObject);
                            var user = new User_1.User(userObject.username, userObject.password);
                            _this.userBase.addUser(user);
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        console.log("client was null");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PersistenceLayer.prototype.isReady = function () {
        return this.isInitiated;
    };
    PersistenceLayer.prototype.getClient = function () {
        return this.client;
    };
    PersistenceLayer.prototype.saveNewUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.client != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.db(PersistenceLayer.ZETTELDROP)];
                    case 1:
                        db = _a.sent();
                        collection = db.collection(PersistenceLayer.USER);
                        collection.insertOne(User_1.User.getPersistenceObject(user));
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("client was null");
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PersistenceLayer.prototype.saveUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection_1, userList, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        if (!(this.client != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.db(PersistenceLayer.ZETTELDROP)];
                    case 2:
                        db = _a.sent();
                        collection_1 = db.collection(PersistenceLayer.USER);
                        collection_1.deleteMany({});
                        userList = UserBase_1.UserBase.getPersistenceObject(this.userBase);
                        userList.forEach(function (user) {
                            collection_1.insertOne(user);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("client was null");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [3 /*break*/, 7];
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PersistenceLayer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = "mongodb://localhost:27017/zetteldrop?authSource=admin";
                        this.client = new mongodb_1.MongoClient(uri);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadUsers()];
                    case 2:
                        _a.sent();
                        this.isInitiated = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    PersistenceLayer.ZETTELKASTEN = "zettelkasten";
    PersistenceLayer.USER = "user";
    PersistenceLayer.ZETTELDROP = "zetteldrop";
    return PersistenceLayer;
}());
exports.PersistenceLayer = PersistenceLayer;
