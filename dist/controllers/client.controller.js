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
const cliente_1 = __importDefault(require("../models/cliente"));
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield cliente_1.default.find({ "_id": req.body._id });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield cliente_1.default.find().populate("trabajadores");
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newClient = new cliente_1.default({
        "horasTotales": req.body.horasTotales,
        "name": req.body.name,
        "trabajadores": req.body.trabajadores
    });
    newClient.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
});
function updateClient(req, res) {
    console.log(req.body);
    //Only Updates Name and  Picture
    cliente_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $set: { "horasTotales": req.body.horasTotales, "name": req.body.name, "trabajadores": req.body.trabajadores } }).then((data) => {
        if (data == null)
            return res.status(400).json(req.body);
        console.log("***************************************");
        console.log("CLIENTE ACTUALIZADO: " + data);
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getClient, getClients, createClient, updateClient };
