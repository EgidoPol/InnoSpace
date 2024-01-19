"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const user_created2_controller_1 = __importDefault(require("../controllers/user_created2.controller"));
const router = express_1.Router();
router.get('/getUserCreated/:id', user_created2_controller_1.default.getUserCreated);
router.get('/getUnidades', user_created2_controller_1.default.getUnidades);
router.post('/newUserCreated', user_created2_controller_1.default.newUserCreated);
router.post('/registerUser', user_created2_controller_1.default.registerUser);
router.post('/upgradeRol', user_created2_controller_1.default.upgradeRol);
module.exports = router;
