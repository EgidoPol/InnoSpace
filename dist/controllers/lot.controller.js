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
const lot_1 = __importDefault(require("../models/lot"));
const getlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield lot_1.default.find({ "_id": req.body._id });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const newLot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lott = new lot_1.default({
        "user": req.body.user,
        "description": req.body.description,
        "date": req.body.date,
    });
    lott.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
function updateLot(req, res) {
    lot_1.default.update({ "_id": req.body._id }, { $set: { "descrpition": req.body.description, "date": req.body.date } }).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function newParticipant(req, res) {
    lot_1.default.updateOne({ "_id": req.body.id }, { $addToSet: { participants: req.body.newParticipant } })
        .then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function winner(req, res) {
    lot_1.default.updateOne({ "_id": req.body.id }, { $Set: { winner: req.body.winner } })
        .then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function deleteLot(req, res) {
    lot_1.default.deleteOne({ "_id": req.params._id }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getlots, newLot, updateLot, newParticipant, winner, deleteLot };
