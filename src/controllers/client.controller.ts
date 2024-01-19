import { Request, Response } from 'express';
import cliente from '../models/cliente';


import rol from '../models/rol';

const getClient = async (req: Request, res: Response) => {
    try{
        const results = await cliente.find({"_id":req.body._id});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getClients = async (req: Request, res: Response) => {
    try{
        const results = await cliente.find().populate("trabajadores");
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const createClient = async (req:Request,res: Response) => {
    const newClient = new cliente({
        "horasTotales": req.body.horasTotales,
        "name": req.body.name,
        "trabajadores": req.body.trabajadores
    });
    newClient.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    })
}

function updateClient (req: Request, res: Response){
    console.log(req.body);
    //Only Updates Name and  Picture
    cliente.findByIdAndUpdate({"_id": req.body._id}, {$set: {"horasTotales": req.body.horasTotales, "name": req.body.name,"trabajadores": req.body.trabajadores}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        console.log("***************************************");
          console.log("CLIENTE ACTUALIZADO: " + data);
          res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}

export default{getClient, getClients, createClient, updateClient}