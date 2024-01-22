"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const pi_ata_1 = __importDefault(require("./pi\u00F1ata"));
const lot_1 = __importDefault(require("./lot"));
const poll_1 = __importDefault(require("./poll"));
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userDataSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default
    },
    posts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: post_1.default
        }],
    picture: {
        type: String
    },
    description: {
        type: String
    },
    affinity: {
        type: String
    },
    followers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: user_1.default
        }],
    following: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: user_1.default
        }],
    piñatas: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: pi_ata_1.default
        }],
    lots: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: lot_1.default
        }],
    polls: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: poll_1.default
        }],
});
//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
exports.default = mongoose_1.default.model('UserData', userDataSchema, 'usersData');
