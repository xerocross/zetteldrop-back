"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username, password) {
        this.username = username;
        this.password = password;
    }
    User.getPersistenceObject = function (user) {
        return {
            username: user.username,
            password: user.password
        };
    };
    return User;
}());
exports.User = User;
