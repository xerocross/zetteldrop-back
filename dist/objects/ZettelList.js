"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZettelList = void 0;
var StringUtils_1 = require("../helpers/StringUtils");
var ZettelList = /** @class */ (function () {
    function ZettelList(zettels) {
        this.zettels = zettels;
    }
    ZettelList.prototype.push = function (zettel) {
        this.zettels.push(zettel);
    };
    ZettelList.prototype.filterByUser = function (username) {
        var filteredList = new ZettelList([]);
        this.zettels.forEach(function (zet) {
            if (zet.user == username) {
                filteredList.push(zet);
            }
        });
        return filteredList;
    };
    ZettelList.prototype.filterByTag = function (tag) {
        var filteredList = new ZettelList([]);
        this.zettels.forEach(function (zet) {
            var tags = StringUtils_1.StringUtils.getHashtags(zet.text);
            if (tags.includes(tag)) {
                filteredList.push(zet);
            }
        });
        return filteredList;
    };
    return ZettelList;
}());
exports.ZettelList = ZettelList;
