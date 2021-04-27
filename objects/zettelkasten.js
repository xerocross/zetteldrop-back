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
exports.ZettelKasten = void 0;
var ZettelKasten = /** @class */ (function () {
    function ZettelKasten() {
        this.zettels = [];
    }
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
    ZettelKasten.prototype.getRand = function () {
        var randomScale = 10000;
        return Math.floor(Math.random() * randomScale);
    };
    ZettelKasten.prototype.getNewZettelId = function () {
        return Date.now().toString() + this.getRand().toString();
    };
    ZettelKasten.prototype.addZettel = function (zettel) {
        this.zettels.push(zettel);
    };
    ZettelKasten.prototype.getZettelById = function (id) {
        for (var i = 0; i < this.zettels.length; i++) {
            if (this.zettels[i].id == id) {
                return this.zettels[i];
            }
        }
    };
    ZettelKasten.prototype.getLinkedZettels = function (zettel) {
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
