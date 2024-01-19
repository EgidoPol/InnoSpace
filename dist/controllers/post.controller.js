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
const post_1 = __importDefault(require("../models/post"));
const user_created_1 = __importDefault(require("../models/user_created"));
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield post_1.default.find({ "user": { "_id": req.body._id } });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield post_1.default.find({ "user": { "_id": req.body._id } });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_1.default({
        "title": "newPost",
        "date": new Date(Date.now()),
        "description": req.body.description,
        "picture": req.body.picture,
    });
    post.save().then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data) {
            yield user_created_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $addToSet: { "posts": post.id } });
        }
        return res.status(200).json(data);
    })).catch((err) => {
        return res.status(500).json(err);
    });
});
function updatePost(req, res) {
    const id = req.body._id;
    const title = req.params.title;
    const description = req.body.description;
    post_1.default.update({ "_id": id }, { $set: { "title": title, "description": description } }).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function deletePost(req, res) {
    post_1.default.deleteOne({ "_id": req.params._id }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
const verifyLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var isLiked = false;
    let result = yield post_1.default.find({ "_id": req.body.postID }).populate('likes');
    if (result != null) {
        result.forEach(liked => {
            if (liked.id == req.body.name) {
                isLiked;
            }
        });
    }
    if (isLiked) {
        return res.status(200).json(isLiked);
    }
    else
        return res.status(509).json(isLiked);
});
const doLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var isLiked = false;
    let result = yield post_1.default.find({ "_id": req.body.postID }).populate('likes');
    if (result != null) {
        result.forEach(liked => {
            if (liked.id == req.body.name) {
                isLiked;
            }
        });
    }
    if (isLiked) {
        return res.status(200).json(req.body.postID);
    }
    else {
        let res = yield user_created_1.default.updateOne({ "_id": req.body.postID }, { $addToSet: { likes: req.body.requestedPostOwnerID } });
        if (res.nModified <= 0) {
            res.status(409).send(isLiked);
        }
        else {
            res.status(200).send(isLiked);
        }
    }
});
exports.default = { getPost, getPosts, newPost, verifyLike, doLike };
