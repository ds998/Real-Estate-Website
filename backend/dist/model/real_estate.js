"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Real_Estate = new Schema({
    name: {
        type: String
    },
    microlocation: {
        type: String
    },
    street: {
        type: String
    },
    area: {
        type: Number
    },
    lines: {
        type: Array
    },
    type: {
        type: String
    },
    rooms: {
        type: Number
    },
    construction_year: {
        type: Number
    },
    state: {
        type: String
    },
    heating: {
        type: String
    },
    floor: {
        type: Number
    },
    total_floors: {
        type: Number
    },
    parking: {
        type: String
    },
    monthly_utilities: {
        type: Number
    },
    price: {
        type: Number
    },
    about: {
        type: String
    },
    characteristics: {
        type: Array
    },
    advertiser: {
        type: Object
    },
    pictures: {
        type: Array
    },
    selling_month: {
        type: Number
    },
    change_time: {
        type: Date
    }
});
exports.default = mongoose_1.default.model('Real_Estate', Real_Estate, 'real_estates');
//# sourceMappingURL=real_estate.js.map