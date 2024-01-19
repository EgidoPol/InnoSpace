import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import user_created, { IUserCreated } from '../models/user_created';
import { generate } from "randomstring";
import entrada from '../models/entrada';
import cliente, { ICliente} from '../models/cliente';
import user from '../models/user';

const getEntries = async (req: Request, res: Response) => {
    try{
        const results = await user_created.find({"user": {"id":req.body.id}}).populate({path: 'entradas',
        populate: [{path: 'user'},{path: 'cliente'}]});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getAllEntries = async (req: Request, res: Response) => {
    try{
        const results = await entrada.find({"_id":req.body.name}).populate('user').populate('cliente');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const createEntry = async (req:Request,res: Response) => {
    await cliente.find({"name": req.body.cliente.name}).then((data) => {
        user.find({"name":req.body.user.name}).then((usda) => {
            const newEntry = new entrada({
                "user": req.body.user,
                "cliente": req.body.cliente,
                "date": req.body.date,
                "hours": req.body.hours,
                "description": req.body.description,
                "area": req.body.area,
                "servicio": req.body.servicio,
                "anoFiscal": req.body.anoFiscal,
                "proyecto": req.body.proyecto,
                "fase": req.body.fase,
                "horasDesplazamiento": req.body.horasDesplazamiento,
                "reunion": req.body.reunion
            });
            newEntry.date.setDate(newEntry.date.getDate() +1);
            newEntry.save().then((datadate) => {
                console.log("!!!!!!" + datadate.date);
                user_created.findOne({"user":datadate.user}).then((userup) => {
                    user_created.findByIdAndUpdate({"_id": userup?.id}, {$addToSet: {"entradas": datadate}}).populate('user').populate('rol').populate({
                        path: 'entradas',
                        populate: [{path: 'user'},{path: 'cliente', populate: {path: 'trabajadores'}}]}).populate('inferior').populate('superior').then((final) => {
                            entrada.findOne({"_id": datadate._id}).populate('user').populate({
                            path: 'cliente', populate: {path: 'trabajadores'}}).then((entryFinal) => {
                            return res.status(201).json(entryFinal);
                        });
                    })
                });
        });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json(err);
        })
    })
    
   
}

function updateEntry (req: Request, res: Response){
    console.log(req.body);
    //Only Updates Name and  Picture
    entrada.findByIdAndUpdate({"_id": req.body._id}, {$set: {"cliente": req.body.cliente, "date": req.body.date, "hours": req.body.hours, "description": req.body.description, "area": req.body.area, "servicio": req.body.servicio, "añoFiscal": req.body.añoFiscal, "proyecto":req.body.proyecto, "fase": req.body.fase, "horasDesplazamiento" : req.body.horasDesplazamiento}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        console.log("***************************************");
          console.log("ENTRADA ACTUALIZADA: " + data);
          res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}

export default{getEntries, createEntry, updateEntry, getAllEntries}