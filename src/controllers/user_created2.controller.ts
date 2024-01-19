import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import user_created, { IUserCreated } from '../models/user_created';
import { generate } from "randomstring";
import Validation from "../models/validation";
import rol, { IRol } from '../models/rol';
import user from '../models/user';

const path = require('path');
const Bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');

const registerUser: any = async (req: Request, res: Response) => {
    try{
    const saltRounds = 10;
    console.log(req.body.password);
    let newUser = new User({
        "name": req.body.name,
        //"email": req.body.email.toLowerCase(),
        "email": req.body.email,
        "password": await Bcrypt.hashSync(req.body.password,saltRounds),
        "validated": false,
    });
    console.log(newUser);
    await User.findOne({"email": newUser.email}).then((e)=>{
        if(e==null){ // si Email no está registrado
                    User.findOne({"name":newUser.name}).then((n)=>{
                        if(n==null){ // y nombre no está registrado
                            newUser.save().then((data) => {
                            newUser = data;
                            const userCreated = new user_created({
                                "user": newUser,
                                "rol": req.body.rol,
                                "superior": req.body.superior,
                                //"inferior": req.body.inferior
                             });
                             userCreated.save().then((data) => {
                                return res.status(201).json({"message": "User registered correctly."});
                             }).catch((err) => {
                                 console.log(err);
                                 return res.status(500).json(err);
                             })
                            })
                        }else {
                            return res.status(454).json({"message": "Name in used by other user."});
                        }
                    });
        }else if(!e.validated){
            // El usuario se puede registrar dado que el email anterior no estaba validado
            User.deleteOne({"email": newUser.email}).then(()=>{
                newUser.save().then((data) => {
                    newUser = data;
                    let validation = new Validation({
                        "code": generate(7),
                        "user": newUser,
                        "date":Date.now(),
                    })
                    validation.save().then(() => {
                        //sendEmail(newUser.email,validation.code);
                        return res.status(201).json({"message": "User registrated correctly",
                            "code": validation.code});
                    });
                    
                });
            });
        }
        else {
            return res.status(452).json({"message": "Email is used and validated by other user."});
        }
    });
    }catch(err) {
        console.log(err);
        return res.status(500);
    }
};

/*********************************************************************/

// Función para completar el perfil
const newUserCreated = async (req: Request, res: Response) => {
    const userCreated = new user_created({
       "user": req.body.user,
        "rol": req.body.rol
    });
    userCreated.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    })
}



/*********************************************************************/

// Obtener usuario según su id
const getUserCreated = async (req: Request, res: Response) => {
    try{
        const results = await user_created.find({"user": {"_id":req.params.id}});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

/*********************************************************************/


const upgradeRol = async (req: Request, res: Response) => {
    console.log(req.body);
    //Only Updates Name and  Picture
    try{
        const majorRol = await user_created.find({"user": {"id":req.body.majorId}}).populate('rol').populate('level');
        if(majorRol){
            const rolUpUser = await user_created.find({"user": {"id":req.body.majorId}}).populate('rol').populate('level');
            if(rolUpUser){
                if(majorRol>rolUpUser){
                    let newRol = new rol({
                        "name":req.body.name,
                        "level": rolUpUser
                    });
                    user_created.findByIdAndUpdate({"user": {"id":req.body.majorId}},{$set: {"rol": newRol}}).then((data) =>{
                        if(data==null) return res.status(400);
                        else return res.status(200).json(data);
                    });
                }
                else{return res.status(406);}
            }
            else{return res.status(404);}
        }
        else{return res.status(404);}
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getUnidades = async (req: Request, res: Response) => {
    try{
        let values: IUserCreated[];
        values = [];
        //const results = await rol.find({ level : { $gt :  2, $lt : 3}});
        const results = await rol.find({ 'level' : 2});
        for(var element in results){
            await user_created.find({'rol': results[element]._id}).populate({
                path: 'entradas',
                populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((data) => {
                    if(data != null){
                        for(var e in data){
                            values.push(data[e]);
                        }
                    }
            });
        }
        return res.status(200).json(values);
    } catch (err) {
        return res.status(404).json(err);
    }
}

export default {newUserCreated,getUserCreated,registerUser, upgradeRol, getUnidades};
