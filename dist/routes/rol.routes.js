"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const rol_controller_1 = __importDefault(require("../controllers/rol.controller"));
const router = express_1.Router();
router.get('/getRols', rol_controller_1.default.getRols);
router.post('/createRol', rol_controller_1.default.createRol);
router.post('/updateRol', rol_controller_1.default.updateRol);
router.post('/getEmployees', rol_controller_1.default.getEmployees);
module.exports = router;
