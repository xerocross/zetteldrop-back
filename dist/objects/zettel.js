"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zettel = void 0;
var Zettel = /** @class */ (function () {
    function Zettel(id, text, user) {
        this.id = id;
        this.text = text;
        this.user = user;
    }
    Zettel.getPersistenceObject = function (zettel) {
        return {
            id: zettel.id,
            text: zettel.text,
            user: zettel.user
        };
    };
    return Zettel;
}());
exports.Zettel = Zettel;
