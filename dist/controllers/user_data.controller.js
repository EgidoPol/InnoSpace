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
const user_1 = __importDefault(require("../models/user"));
const user_data_1 = __importDefault(require("../models/user_data"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield user_data_1.default.find({ "user": { "email": req.body.email } }).populate('users');
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
/*********************************************************************/
const newUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = new user_data_1.default({
        "user": req.body.user,
        "posts": req.body.posts,
        "picture": req.body.picture,
        "description": req.body.description,
        "affinity": req.body.affinity,
    });
    userData.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
/*********************************************************************/
/*function updateUserProfile (req: Request, res: Response){
    console.log(req.body);
    //Only Updates Name and  Picture
    User.findByIdAndUpdate({"_id": req.body.user._id}, {$set: {"name": req.body.user.name,"picture":req.body.user.picture}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        Student.findByIdAndUpdate({"_id": req.body._id},{$set: {"ratings": req.body.ratings,"trophies":req.body.trophies,"insignias":req.body.insignias}},{
            new: true
          }).then((resultStudent)=>{
          if(resultStudent==null){return res.status(400).json(req.body);}
          console.log("***************************************");
          console.log(resultStudent);
          res.status(200).json(req.body);
        })
    }).catch((err) => {
        res.status(500).json(err);
    })
}*/
const verifyFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    var isFollowing = false;
    let result = yield user_1.default.find({ "_id": req.body.requestedProfileID }).populate('following');
    let follow;
    if (result != null) {
        result.forEach(follow => {
            if (follow.id == req.body.name) {
                isFollowing;
            }
        });
    }
    if (isFollowing) {
        return res.status(200).json(isFollowing);
    }
    else
        return res.status(509).json(req.body);
});
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    var isFollowing = false;
    let result = yield user_data_1.default.find({ "_id": req.body.userID }).populate('following');
    if (result != null) {
        result.forEach(follow => {
            if (follow.id == req.body.name) {
                isFollowing;
            }
        });
    }
    if (isFollowing) {
        return res.status(200).json(req.body.requestedProfileID);
    }
    else {
        let res = yield user_data_1.default.updateOne({ "_id": req.body.id }, { $addToSet: { following: req.body.requestedProfileID } });
        if (res.nModified <= 0) {
            res.status(409).send({ message: 'User was already following' });
        }
        else {
            res.status(200).send({ message: 'User now following' });
        }
    }
});
function updateProfile(req, res) {
    console.log(req.body);
    //Only Updates Name and  Picture
    user_1.default.findByIdAndUpdate({ "_id": req.body.user._id }, { $set: { "name": req.body.user.name } }).then((data) => {
        if (data == null)
            return res.status(400).json(req.body);
        user_data_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $set: {} }, {
            new: true
        }).then((resultStudent) => {
            if (resultStudent == null) {
                return res.status(400).json(req.body);
            }
            console.log("***************************************");
            console.log(resultStudent);
            res.status(200).json(req.body);
        });
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getUserData, newUserData, verifyFollowing, follow, updateProfile };
