import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import { generate } from "randomstring";
import jwtHelper from "../helpers/jwt";
import Recovery from "../models/recovery";
import User from "../models/user";
import UserCreated from "../models/user_created";
import Validation from "../models/validation";
import config from "../config/config";
import * as fs from "fs";

 

const path = require('path');
const Bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const sendEmail: any = async (receiver: string, code: string) =>  {
    const  transporter = createTransport({
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
    var message = "<h1>Welcome to Innova Soft!</h1><p>To activate your account, use the next link: <a href='http://localhost:3000/auth/validate/"+code+"'>Activate</a> Or introduce the next code in the app: </p><h3>"+ code +"</h3>";
    let mailOptions: MailOptions = {
        from: 'egido.pol@gmail.com',
        to: receiver,
        subject: "Welcome to Innova Soft!",
        text: "Welcome to Innova Soft! To activate your account, use the next link: http://localhost:3000/auth/validate/" +code+ " Or introduce the next code in the app: "+ code,
        html: message
    }
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    })
}



//Login User 
const accessUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        console.log("Request Body: ",req.body);
        const filter = {'email':req.body.email};
        console.log("Filter Query SignIn",filter);
        User.findOne(filter).then(async (resultUser)=>{
        //I have _id, email, password
        if(resultUser!=null){
            console.log("email: "+ resultUser.email);
            if(Bcrypt.compareSync(req.body.password, resultUser.password)){
                resultUser.password = "password-hidden";
                //Check if User Email
                if (req.body != null) {
                    //Its actually a user
                    UserCreated.findOne({"user": resultUser._id}).then((resUserData) => {
                        if (resUserData == null) {
                            //* NOT VALIDATED
                            let userWithoutToken = new User({
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
                        } else {
                            //* Validated
                            UserCreated.findOne({'user': resultUser._id}).populate('user').populate('rol').populate({
                                path: 'entradas',
                                populate: [{path: 'user'},{path: 'cliente'}]}).populate('inferior').populate('superior').lean().then((result) => {
                                /**==============================================
                                 **      Validated & Completed Lets Get Started
                                 *===============================================**/
                                if (result != null) {
                                    let userWithToken: any = {
                                        "_id": result.user._id.toString(),
                                        "password": "password-hidden",  
                                        "email": result.user.email,
                                        "name": result.user.name,
                                        "validated": true,
                                        "token": jwtHelper.createToken(resultUser)
                                    };
                                    //const result2 = customHelper.getCustomProfessor(result, userWithToken);
                                    result['user'] = userWithToken;
                                    console.log(result);
                                    //Validated and Has courses than student can login!
                                    console.log("Login--> User Validated Result: " + result.user.email);
                                    return res.status(200).json(result);
                                } else {
                                   console.log("Error not found");
                                   return res.status(404).json("Database error, User not found");
                                }
                            });
                        }

                    });
                }
            }else{
                return res.status(404).json({'error':'User Password Incorrect!'});
            }
        }else{
            return res.status(404).json({'error':'User Not Found!'});
        }});
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
const sendEmailRecovery: any = async (receiver: string, code: string) =>  {
    const  transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'egido.pol@gmail.com',
            pass: 'polegido99'
        }
    });
    var message = "<h1>IS - Reset Password</h1><p>Need to Reset the password? Just type this code in the app, If you did not make the request, please ignore this email.</p><h3>"+ code +"</h3>";
    let mailOptions: MailOptions = {
        from: 'egido.pol@gmail.com',
        to: receiver,
        subject: "Innova Soft - Password Reset Request",
        text: "Need to Reset the password? Just type this code in the app: "+code+ " ,If you did not make the request, please ignore this email.",
        html: message
    }
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    })
}
const forgotPassword = async (req: Request, res: Response) => {
    if(req.body.email==null){
        return res.status(400).json({"message":"Bad Request, data requiered"});
    }
    
    let email = req.body.email;
    //let s = await Validation.findOne({"code": code});
    console.log({email})
    let s = await User.findOne({"email": email});
    if (s) {
        //User Found
        let recovery = new Recovery({
            "code": generate(7),
            "email": email
        })
        recovery.save().then(() => {
            sendEmailRecovery(email,recovery.code);
            return res.status(201).json({"message": "Email Sent"});
        });
    }else{
        //User doesnt Exist
        return res.status(404).json({"message":"No User Found"});
    }
}
const changePassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //let code = req.params.code;
    //Request.body = {"email":email,"code":code,"password":newPassword};
    if(req.body.email==null||req.body.code==null||req.body.password==null){
        return res.status(400).json({"message":"Bad Request, data requiered"});
    }else if(req.body.password.length<3){
        return res.status(400).json({"message":"Password min length 3"});
    }
    const saltRounds = 10;
    const filter = {'code':req.body.code,'email':req.body.email};
    let s = await Recovery.findOne(filter);
    if (s != null) {
        //let user = await User.findOne({"_id": s.user._id})
        await User.updateOne({"email": req.body.email}, {"password":Bcrypt.hashSync(req.body.password,saltRounds) }).then(() => {
            // @ts-ignore
            s.deleteOne();
            return res.status(200).json({"message":"Sucessfully Changed Password"});
            }
        );
    }else {
        return res.status(500).json({"message":"Code or Email Incorrect"});
    }
}
//Validates User
const validateUser = async (req: Request, res: Response) => {
    let code = req.body.code;
    console.log("Validation Code: ",code);
    let s = await Validation.findOne({"code": code});
    console.log("Validation Mongodb user found: ",s);
    if (s != null) {
        //Check if Code is Valid!
        //else return not validated
        let dateCode = Date.parse(s.date.toString());
        let timeElapsed = (Date.now() -dateCode) / (1000*60*60);
        if(timeElapsed > config.expirationTime){
            return res.status(405).json({"message": "Code Expired"});
        }
        //If it is then
        let user = await User.findOne({"_id": s.user._id})
        if (user != null) {
            await User.updateOne({"_id": user._id}, {"validated": true}).then(() => {
                // @ts-ignore
                s.deleteOne();
                //Create New Data
                const data = new UserCreated({
                    "user": user?._id,
                });
                data.save();
                return res.status(201).sendFile(path.join(__dirname, "../public",'/views', '/confirmed.html'));
            });
    }}else{
        return res.status(404).json({"message":"Code Incorrect"});
    }
}



export default {accessUser, validateUser,forgotPassword,changePassword};

