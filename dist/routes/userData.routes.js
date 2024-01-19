"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const user_data_controller_1 = __importDefault(require("../controllers/user_data.controller"));
const router = express_1.Router();
router.get("/getUserData", user_data_controller_1.default.getUserData);
router.post('/newUserData', user_data_controller_1.default.newUserData);
router.get('/verifyFollowing', user_data_controller_1.default.verifyFollowing);
router.post('/startFollow', user_data_controller_1.default.follow);
router.post('/uploadUser', user_data_controller_1.default.updateProfile);
module.exports = router;
