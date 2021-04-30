"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
var ErrorMessages = /** @class */ (function () {
    function ErrorMessages() {
    }
    ErrorMessages.unknown = "An unknown exception occurred.";
    ErrorMessages.OUT_OF_ORDER_EXCEPTION = "Out of order exception. This usually means the app did not initialize in the expected order. Something was falsy that definitely should have been initialized by the time a given function was called";
    ErrorMessages.COULD_NOT_CREATE_ZETTEL = "Could not create zettel.";
    return ErrorMessages;
}());
exports.ErrorMessages = ErrorMessages;
