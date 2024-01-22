"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const router = express_1.Router();
router.post('/getPosts', post_controller_1.default.getPosts);
router.post("/getPostById", post_controller_1.default.getPost);
router.post('/newPost', post_controller_1.default.newPost);
router.post('/verifyLike', post_controller_1.default.verifyLike);
router.post('/doLike', post_controller_1.default.doLike);
module.exports = router;
