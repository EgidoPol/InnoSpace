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
const nodemailer_1 = require("nodemailer");
const randomstring_1 = require("randomstring");
const jwt_1 = __importDefault(require("../helpers/jwt"));
const recovery_1 = __importDefault(require("../models/recovery"));
const user_1 = __importDefault(require("../models/user"));
const user_created_1 = __importDefault(require("../models/user_created"));
const validation_1 = __importDefault(require("../models/validation"));
const config_1 = __importDefault(require("../config/config"));
const path = require('path');
const Bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const sendEmail = (receiver, code) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.createTransport({
        host: '',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: '',
            pass: ''
        }
    });
    //var email = fs.createReadStream("../../dist/public/views/404.html");
    var message = "<h1>Welcome to Innova Soft!</h1><p>To activate your account, use the next link: <a href='http://localhost:3000/auth/validate/" + code + "'>Activate</a> Or introduce the next code in the app: </p><h3>" + code + "</h3>";
    let mailOptions = {
        from: 'egido.pol@gmail.com',
        to: receiver,
        subject: "Welcome to Innova Soft!",
        text: "Welcome to Innova Soft! To activate your account, use the next link: http://localhost:3000/auth/validate/" + code + " Or introduce the next code in the app: " + code,
        html: message
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
});
//Login User 
const accessUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log("Request Body: ", req.body);
        const filter = { 'email': req.body.email };
        console.log("Filter Query SignIn", filter);
        user_1.default.findOne(filter).then((resultUser) => __awaiter(void 0, void 0, void 0, function* () {
            //I have _id, email, password
            if (resultUser != null) {
                console.log("email: " + resultUser.email);
                if (Bcrypt.compareSync(req.body.password, resultUser.password)) {
                    resultUser.password = "password-hidden";
                    //Check if User Email
                    if (req.body != null) {
                        //Its actually a user
                        user_created_1.default.findOne({ "user": resultUser._id }).then((resUserData) => {
                            if (resUserData == null) {
                                //* NOT VALIDATED
                                let userWithoutToken = new user_1.default({
                                    "_id": resultUser._id,
                                    "password": "password-hidden",
                                    "email": resultUser.email,
                                    "name": resultUser.name,
                                    "validated": false,
                                    "token": "Not-Authorized"
                                });
                                //const userNotValidated: { "user": IUser } = {"user": userWithoutToken};
                                console.log("Line87:Login--> User hasn't Validated: " + userWithoutToken);
                                return res.status(203).json(userWithoutToken);
                            }
                            else {
                                //* Validated
                                user_created_1.default.findOne({ 'user': resultUser._id }).populate('user').populate('rol').populate({
                                    path: 'entradas',
                                    populate: [{ path: 'user' }, { path: 'cliente' }]
                                }).populate('inferior').populate('superior').lean().then((result) => {
                                    /**==============================================
                                     **      Validated & Completed Lets Get Started
                                     *===============================================**/
                                    if (result != null) {
                                        let userWithToken = {
                                            "_id": result.user._id.toString(),
                                            "password": "password-hidden",
                                            "email": result.user.email,
                                            "name": result.user.name,
                                            "validated": true,
                                            "token": jwt_1.default.createToken(resultUser)
                                        };
                                        //const result2 = customHelper.getCustomProfessor(result, userWithToken);
                                        result['user'] = userWithToken;
                                        console.log(result);
                                        //Validated and Has courses than student can login!
                                        console.log("Login--> User Validated Result: " + result.user.email);
                                        return res.status(200).json(result);
                                    }
                                    else {
                                        console.log("Error not found");
                                        return res.status(404).json("Database error, User not found");
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    return res.status(404).json({ 'error': 'User Password Incorrect!' });
                }
            }
            else {
                return res.status(404).json({ 'error': 'User Not Found!' });
            }
        }));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});
const sendEmailRecovery = (receiver, code) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'egido.pol@gmail.com',
            pass: 'polegido99'
        }
    });
    var message = "<h1>IS - Reset Password</h1><p>Need to Reset the password? Just type this code in the app, If you did not make the request, please ignore this email.</p><h3>" + code + "</h3>";
    let mailOptions = {
        from: 'egido.pol@gmail.com',
        to: receiver,
        subject: "Innova Soft - Password Reset Request",
        text: "Need to Reset the password? Just type this code in the app: " + code + " ,If you did not make the request, please ignore this email.",
        html: message
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.email == null) {
        return res.status(400).json({ "message": "Bad Request, data requiered" });
    }
    let email = req.body.email;
    //let s = await Validation.findOne({"code": code});
    console.log({ email });
    let s = yield user_1.default.findOne({ "email": email });
    if (s) {
        //User Found
        let recovery = new recovery_1.default({
            "code": randomstring_1.generate(7),
            "email": email
        });
        recovery.save().then(() => {
            sendEmailRecovery(email, recovery.code);
            return res.status(201).json({ "message": "Email Sent" });
        });
    }
    else {
        //User doesnt Exist
        return res.status(404).json({ "message": "No User Found" });
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //let code = req.params.code;
    //Request.body = {"email":email,"code":code,"password":newPassword};
    if (req.body.email == null || req.body.code == null || req.body.password == null) {
        return res.status(400).json({ "message": "Bad Request, data requiered" });
    }
    else if (req.body.password.length < 3) {
        return res.status(400).json({ "message": "Password min length 3" });
    }
    const saltRounds = 10;
    const filter = { 'code': req.body.code, 'email': req.body.email };
    let s = yield recovery_1.default.findOne(filter);
    if (s != null) {
        //let user = await User.findOne({"_id": s.user._id})
        yield user_1.default.updateOne({ "email": req.body.email }, { "password": Bcrypt.hashSync(req.body.password, saltRounds) }).then(() => {
            // @ts-ignore
            s.deleteOne();
            return res.status(200).json({ "message": "Sucessfully Changed Password" });
        });
    }
    else {
        return res.status(500).json({ "message": "Code or Email Incorrect" });
    }
});
//Validates User
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let code = req.body.code;
    console.log("Validation Code: ", code);
    let s = yield validation_1.default.findOne({ "code": code });
    console.log("Validation Mongodb user found: ", s);
    if (s != null) {
        //Check if Code is Valid!
        //else return not validated
        let dateCode = Date.parse(s.date.toString());
        let timeElapsed = (Date.now() - dateCode) / (1000 * 60 * 60);
        if (timeElapsed > config_1.default.expirationTime) {
            return res.status(405).json({ "message": "Code Expired" });
        }
        //If it is then
        let user = yield user_1.default.findOne({ "_id": s.user._id });
        if (user != null) {
            yield user_1.default.updateOne({ "_id": user._id }, { "validated": true }).then(() => {
                // @ts-ignore
                s.deleteOne();
                //Create New Data
                const data = new user_created_1.default({
                    "user": user === null || user === void 0 ? void 0 : user._id,
                });
                data.save();
                return res.status(201).sendFile(path.join(__dirname, "../public", '/views', '/confirmed.html'));
            });
        }
    }
    else {
        return res.status(404).json({ "message": "Code Incorrect" });
    }
});
exports.default = { accessUser, validateUser, forgotPassword, changePassword };
