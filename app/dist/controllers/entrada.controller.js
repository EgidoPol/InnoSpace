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
const user_created_1 = __importDefault(require("../models/user_created"));
const entrada_1 = __importDefault(require("../models/entrada"));
const cliente_1 = __importDefault(require("../models/cliente"));
const user_1 = __importDefault(require("../models/user"));
const getEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield user_created_1.default.find({ "user": { "id": req.body.id } }).populate({ path: 'entradas',
            populate: [{ path: 'user' }, { path: 'cliente' }] });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getAllEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield entrada_1.default.find({ "_id": req.body.name }).populate('user').populate('cliente');
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const createEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield cliente_1.default.find({ "name": req.body.cliente.name }).then((data) => {
        user_1.default.find({ "name": req.body.user.name }).then((usda) => {
            const newEntry = new entrada_1.default({
                "user": req.body.user,
                "cliente": req.body.cliente,
                "date": req.body.date,
                "hours": req.body.hours,
                "description": req.body.description,
                "area": req.body.area,
                "servicio": req.body.servicio,
                "anoFiscal": req.body.anoFiscal,
                "proyecto": req.body.proyecto,
                "fase": req.body.fase,
                "horasDesplazamiento": req.body.horasDesplazamiento,
                "reunion": req.body.reunion
            });
            newEntry.date.setDate(newEntry.date.getDate() + 1);
            newEntry.save().then((datadate) => {
                console.log("!!!!!!" + datadate.date);
                user_created_1.default.findOne({ "user": datadate.user }).then((userup) => {
                    user_created_1.default.findByIdAndUpdate({ "_id": userup === null || userup === void 0 ? void 0 : userup.id }, { $addToSet: { "entradas": datadate } }).populate('user').populate('rol').populate({
                        path: 'entradas',
                        populate: [{ path: 'user' }, { path: 'cliente', populate: { path: 'trabajadores' } }]
                    }).populate('inferior').populate('superior').then((final) => {
                        entrada_1.default.findOne({ "_id": datadate._id }).populate('user').populate({
                            path: 'cliente', populate: { path: 'trabajadores' }
                        }).then((entryFinal) => {
                            return res.status(201).json(entryFinal);
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json(err);
        });
    });
});
function updateEntry(req, res) {
    console.log(req.body);
    //Only Updates Name and  Picture
    entrada_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $set: { "cliente": req.body.cliente, "date": req.body.date, "hours": req.body.hours, "description": req.body.description, "area": req.body.area, "servicio": req.body.servicio, "añoFiscal": req.body.añoFiscal, "proyecto": req.body.proyecto, "fase": req.body.fase, "horasDesplazamiento": req.body.horasDesplazamiento } }).then((data) => {
        if (data == null)
            return res.status(400).json(req.body);
        console.log("***************************************");
        console.log("ENTRADA ACTUALIZADA: " + data);
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getEntries, createEntry, updateEntry, getAllEntries };
