"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const client_controller_1 = __importDefault(require("../controllers/client.controller"));
const entrada_controller_1 = __importDefault(require("../controllers/entrada.controller"));
const router = express_1.Router();
router.get('/getCliente', client_controller_1.default.getClient);
router.get('/getClientes', client_controller_1.default.getClients);
router.post('/createCliente', client_controller_1.default.createClient);
router.post('/updateCliente', client_controller_1.default.updateClient);
router.post('/createEntry', entrada_controller_1.default.createEntry);
module.exports = router;
