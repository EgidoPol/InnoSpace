"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("../models/user"));
const jwt = require('jsonwebtoken');
//Token created with 1 week expiration = 604800, 1 Year expiration =  
function createToken(user) {
    const payload = { id: user._id.toString(), email: user.email };
    return jwt.sign(payload, config_1.default.jwtSecret, {
        expiresIn: '365d'
    });
}
function CheckJWT(token) {
    return new Promise((resolve, reject) => {
        const element = jwt.verify(token, config_1.default.jwtSecret);
        user_1.default.findOne({ "_id": element.id }).select('_id').lean().then((usr) => {
            if (usr == null) {
                reject(new Error("No User with this token-->Invalid token!"));
            }
            //usr.password = "password-hidden";
            else
                resolve([true, usr['_id'].toString()]);
        });
    });
}
exports.default = {
    CheckJWT,
    createToken
};
