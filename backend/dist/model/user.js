"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    type: {
        type: String,
    },
    city: {
        type: String
    },
    birthday: {
        type: Date
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    agency: {
        type: String
    },
    licence: {
        type: Number
    },
    favorites: {
        type: Array
    },
    approved: {
        type: Number
    },
    picture: {
        type: String
    }
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map