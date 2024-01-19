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
const rol_1 = __importDefault(require("../models/rol"));
const user_created_1 = __importDefault(require("../models/user_created"));
const getRols = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield rol_1.default.find({ "user": { "_id": req.body._id } });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const createRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newRol = new rol_1.default({
        "level": req.body.level,
        "name": req.body.name
    });
    newRol.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
function updateRol(req, res) {
    console.log(req.body);
    //Only Updates Name and  Picture
    rol_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $set: { "level": req.body.level, "name": req.body.name } }).then((data) => {
        if (data == null)
            return res.status(400).json(req.body);
        console.log("***************************************");
        console.log("ROL ACTUALIZADO: " + data);
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function employeByRol(usrTmp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_created_1.default.findOne({ 'user': usrTmp.email }).populate('user').populate('rol').populate('superior').populate('inferior').then((data) => {
            console.log(data);
            return data;
        }).catch((err) => {
            return err;
        });
    });
}
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let values;
    let valuesName;
    let finalValues;
    finalValues = [];
    values = [];
    valuesName = [];
    yield user_created_1.default.findOne({ 'user': req.body._id }).populate('inferior').then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data != null) {
            let usrOriginal = new user_created_1.default();
            usrOriginal = data;
            let i = 0;
            if (usrOriginal.inferior != null) {
                while (i < usrOriginal.inferior.length) {
                    let emp;
                    emp = new user_created_1.default();
                    yield user_created_1.default.findOne({ 'user': usrOriginal.inferior[i]._id }).populate({
                        path: 'entradas',
                        populate: [{ path: 'user' }, { path: 'cliente' }]
                    }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                        emp = emp2;
                    });
                    let final = false;
                    while (!final && (emp.user._id != usrOriginal.user._id)) {
                        let superior;
                        superior = new user_created_1.default();
                        if ((emp.superior != null) && (emp.user._id != usrOriginal.user._i)) {
                            yield user_created_1.default.findOne({ 'user': emp.superior._id }).populate({
                                path: 'entradas',
                                populate: [{ path: 'user' }, { path: 'cliente' }]
                            }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                superior = emp2;
                            });
                        }
                        if ((emp.inferior != null) && !valuesName.includes(emp.user.name) && (emp.inferior.length > 0) && (emp.user._id != usrOriginal.user._i)) {
                            let sup = 0;
                            let y = 0;
                            while ((y < emp.inferior.length)) {
                                let tmpEmple;
                                tmpEmple = new user_created_1.default();
                                yield user_created_1.default.findOne({ 'user': emp.inferior[y]._id }).populate({
                                    path: 'entradas',
                                    populate: [{ path: 'user' }, { path: 'cliente' }]
                                }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                    tmpEmple = emp2;
                                });
                                if ((!valuesName.includes(tmpEmple.user.name))) {
                                    yield user_created_1.default.findOne({ 'user': emp.inferior[y]._id }).populate({
                                        path: 'entradas',
                                        populate: [{ path: 'user' }, { path: 'cliente' }]
                                    }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                        emp = emp2;
                                    });
                                }
                                else {
                                    sup = sup + 1;
                                    if ((sup == emp.inferior.length) && (emp.user._id != usrOriginal.user._id)) {
                                        if (!valuesName.includes(emp.user.name)) {
                                            valuesName.push(emp.user.name);
                                            values.push(emp);
                                        }
                                        if ((superior.user._id != data.user._id) && (emp.superior != null) && (emp.superior.length > 0) && (emp.user._id != data.user._id) && (emp.superior.user._id != data.user._id) && (emp.user._id != usrOriginal.user._i)) {
                                            yield user_created_1.default.findOne({ 'user': emp.superior._id }).populate({
                                                path: 'entradas',
                                                populate: [{ path: 'user' }, { path: 'cliente' }]
                                            }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                                emp = emp2;
                                            });
                                        }
                                        else {
                                            final = true;
                                        }
                                    }
                                }
                                y = y + 1;
                            }
                        }
                        else if ((!valuesName.includes(emp.user.name)) && (emp.user._id != usrOriginal.user._id)) {
                            if (!valuesName.includes(emp.user.name)) {
                                valuesName.push(emp.user.name);
                                values.push(emp);
                                yield user_created_1.default.findOne({ 'user': emp.superior._id }).populate({
                                    path: 'entradas',
                                    populate: [{ path: 'user' }, { path: 'cliente' }]
                                }).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                    emp = emp2;
                                });
                            }
                            else {
                                final = true;
                            }
                        }
                        else {
                            final = true;
                        }
                    }
                    i = i + 1;
                }
                for (var userOut in values) {
                    if (values[userOut].user._id == req.body._id) {
                        values.splice(Number.parseInt(userOut));
                    }
                }
                return res.status(200).json(values);
            }
            else {
                return res.status(404);
            }
        }
        else {
            return res.status(401).json(null);
        }
    })).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
});
exports.default = { getRols, createRol, updateRol, getEmployees };
