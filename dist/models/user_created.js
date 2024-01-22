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
const entrada_1 = __importDefault(require("./entrada"));
const rol_1 = __importDefault(require("./rol"));
const user_1 = __importDefault(require("./user"));
//import piñata, { IPiñata } from './piñata';
//import lot, { ILot } from './lot';
//import poll, { IPoll } from './poll';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userCreatedSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default
    },
    rol: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: rol_1.default
    },
    entradas: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: entrada_1.default
        }],
    superior: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default
    },
    inferior: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: user_1.default
        }]
});
//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
exports.default = mongoose_1.default.model('UserCreated', userCreatedSchema, 'usersCreated');
