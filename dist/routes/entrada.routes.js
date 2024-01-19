"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const entrada_controller_1 = __importDefault(require("../controllers/entrada.controller"));
const router = express_1.Router();
router.get('/getEntries', entrada_controller_1.default.getEntries);
router.get('/getAllEntries', entrada_controller_1.default.getAllEntries);
router.post('/createEntry', entrada_controller_1.default.createEntry);
router.post('/updateEntry', entrada_controller_1.default.updateEntry);
module.exports = router;
