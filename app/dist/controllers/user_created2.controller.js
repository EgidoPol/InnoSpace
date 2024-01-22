"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const user_created_1 = __importDefault(require("../models/user_created"));
const randomstring_1 = require("randomstring");
const validation_1 = __importDefault(require("../models/validation"));
const rol_1 = __importDefault(require("../models/rol"));
const path = require('path');
const Bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        console.log(req.body.password);
        let newUser = new user_1.default({
            "name": req.body.name,
            //"email": req.body.email.toLowerCase(),
            "email": req.body.email,
            "password": yield Bcrypt.hashSync(req.body.password, saltRounds),
            "validated": false,
        });
        console.log(newUser);
        yield user_1.default.findOne({ "email": newUser.email }).then((e) => {
            if (e == null) { // si Email no está registrado
                user_1.default.findOne({ "name": newUser.name }).then((n) => {
                    if (n == null) { // y nombre no está registrado
                        newUser.save().then((data) => {
                            newUser = data;
                            const userCreated = new user_created_1.default({
                                "user": newUser,
                                "rol": req.body.rol,
                                "superior": req.body.superior,
                            });
                            userCreated.save().then((data) => {
                                return res.status(201).json({ "message": "User registered correctly." });
                            }).catch((err) => {
                                console.log(err);
                                return res.status(500).json(err);
                            });
                        });
                    }
                    else {
                        return res.status(454).json({ "message": "Name in used by other user." });
                    }
                });
            }
            else if (!e.validated) {
                // El usuario se puede registrar dado que el email anterior no estaba validado
                user_1.default.deleteOne({ "email": newUser.email }).then(() => {
                    newUser.save().then((data) => {
                        newUser = data;
                        let validation = new validation_1.default({
                            "code": randomstring_1.generate(7),
                            "user": newUser,
                            "date": Date.now(),
                        });
                        validation.save().then(() => {
                            //sendEmail(newUser.email,validation.code);
                            return res.status(201).json({ "message": "User registrated correctly",
                                "code": validation.code });
                        });
                    });
                });
            }
            else {
                return res.status(452).json({ "message": "Email is used and validated by other user." });
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500);
    }
});
/*********************************************************************/
// Función para completar el perfil
const newUserCreated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userCreated = new user_created_1.default({
        "user": req.body.user,
        "rol": req.body.rol
    });
    userCreated.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
});
/*********************************************************************/
// Obtener usuario según su id
const getUserCreated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield user_created_1.default.find({ "user": { "_id": req.params.id } });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
/*********************************************************************/
const upgradeRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    //Only Updates Name and  Picture
    try {
        const majorRol = yield user_created_1.default.find({ "user": { "id": req.body.majorId } }).populate('rol').populate('level');
        if (majorRol) {
            const rolUpUser = yield user_created_1.default.find({ "user": { "id": req.body.majorId } }).populate('rol').populate('level');
            if (rolUpUser) {
                if (majorRol > rolUpUser) {
                    let newRol = new rol_1.default({
                        "name": req.body.name,
                        "level": rolUpUser
                    });
                    user_created_1.default.findByIdAndUpdate({ "user": { "id": req.body.majorId } }, { $set: { "rol": newRol } }).then((data) => {
                        if (data == null)
                            return res.status(400);
                        else
                            return res.status(200).json(data);
                    });
                }
                else {
                    return res.status(406);
                }
            }
            else {
                return res.status(404);
            }
        }
        else {
            return res.status(404);
        }
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getUnidades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let values;
        values = [];
        //const results = await rol.find({ level : { $gt :  2, $lt : 3}});
        const results = yield rol_1.default.find({ 'level': 2 });
        for (var element in results) {
            yield user_created_1.default.find({ 'rol': results[element]._id }).populate({
                path: 'entradas',
                populate: [{ path: 'user' }, { path: 'cliente' }]
            }).populate('user').populate('rol').populate('superior').populate('inferior').then((data) => {
                if (data != null) {
                    for (var e in data) {
                        values.push(data[e]);
                    }
                }
            });
        }
        return res.status(200).json(values);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
exports.default = { newUserCreated, getUserCreated, registerUser, upgradeRol, getUnidades };
