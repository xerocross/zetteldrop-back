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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBase = void 0;
var User_1 = require("./User");
var UserBase = /** @class */ (function () {
    function UserBase() {
        this.users = [];
    }
    UserBase.getPersistenceObject = function (userBase) {
        var userArray = [];
        userBase.users.forEach(function (user) {
            userArray.push(User_1.User.getPersistenceObject(user));
        });
        return userArray;
    };
    UserBase.prototype.checkUsernameExists = function (username) {
        var user = this.getUserByName(username);
        return (user != null);
    };
    UserBase.prototype.getUserByName = function (username) {
        var e_1, _a;
        try {
            for (var _b = __values(this.users), _c = _b.next(); !_c.done; _c = _b.next()) {
                var user = _c.value;
                if (user.username == username) {
                    return user;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    UserBase.prototype.addUser = function (user) {
        var isUsernameTaken = this.checkUsernameExists(user.username);
        if (isUsernameTaken) {
            throw new Error("the chosen username is not available or allowed");
        }
        else {
            this.users.push(user);
        }
    };
    UserBase.prototype.checkUserLogin = function (username, password) {
        var user = this.getUserByName(username);
        if (user != null) {
            if (password == user.password) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    UserBase.prototype.register = function (username, password) {
        var user = new User_1.User(username, password);
        this.addUser(user);
    };
    UserBase.getFromStorage = function (usersArray) {
        var e_2, _a;
        try {
            for (var usersArray_1 = __values(usersArray), usersArray_1_1 = usersArray_1.next(); !usersArray_1_1.done; usersArray_1_1 = usersArray_1.next()) {
                var storageUser = usersArray_1_1.value;
                var userbase = new UserBase();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (usersArray_1_1 && !usersArray_1_1.done && (_a = usersArray_1.return)) _a.call(usersArray_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return UserBase;
}());
exports.UserBase = UserBase;
