import { Console } from 'console';
import { Request, Response } from 'express';
import rol from '../models/rol';
import user, { IUser } from '../models/user';
import user_created, { IUserCreated } from '../models/user_created';

const getRols = async (req: Request, res: Response) => {
    try{
        const results = await rol.find({"user": {"_id":req.body._id}});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const createRol = async (req:Request,res: Response) => {
    const newRol = new rol({
        "level": req.body.level,
        "name": req.body.name
    });
    newRol.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}

function updateRol (req: Request, res: Response){
    console.log(req.body);
    //Only Updates Name and  Picture
    rol.findByIdAndUpdate({"_id": req.body._id}, {$set: {"level": req.body.level, "name": req.body.name}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        console.log("***************************************");
          console.log("ROL ACTUALIZADO: " + data);
          res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
async function employeByRol(usrTmp :any) : Promise<any>{
    await user_created.findOne({'user': usrTmp.email}).populate('user').populate('rol').populate('superior').populate('inferior').then((data) =>{
        console.log(data);
        return data;
    }).catch((err) =>{
        return err;
    })
}

const getEmployees = async (req:Request, res: Response) => {
    let values: IUserCreated[];
    let valuesName : string[];
    let finalValues : string[];
    finalValues = [];
    values = [];
    valuesName = [];
    await user_created.findOne({'user': req.body._id}).populate('inferior').then(async (data) => {
        if(data!=null){
            let usrOriginal = new user_created();
            usrOriginal = data;
            let i = 0;
        if(usrOriginal.inferior != null){
            while(i < usrOriginal.inferior.length){

                let emp : IUserCreated;
                emp = new user_created();
                await user_created.findOne({'user': usrOriginal.inferior[i]._id}).populate({
                    path: 'entradas',
                    populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                    emp = emp2!;
                });
                let final = false;

                    while (!final && (emp.user._id != usrOriginal.user._id)){    
                        let superior : IUserCreated;
                        superior = new user_created();
                        if((emp.superior != null)&& (emp.user._id != usrOriginal.user._i)){
                            await user_created.findOne({'user': emp.superior._id}).populate({
                                path: 'entradas',
                                populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                superior = emp2!;
                            });
                        }        
                        if((emp.inferior != null) && !valuesName.includes(emp.user.name) && (emp.inferior.length > 0)&& (emp.user._id != usrOriginal.user._i)){
                            let sup = 0;
                            let y = 0;
                            while((y < emp.inferior.length)){
                                let tmpEmple : IUserCreated;
                                tmpEmple = new user_created();
                                await user_created.findOne({'user': emp.inferior[y]._id}).populate({
                                    path: 'entradas',
                                    populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                    tmpEmple = emp2!;
                                });
                                if((!valuesName.includes(tmpEmple.user.name))){
                                    await user_created.findOne({'user': emp.inferior[y]._id}).populate({
                                        path: 'entradas',
                                        populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                        emp = emp2!;                                    
                                    });
                                }                            
                                else{
                                    sup = sup + 1;
                                    if((sup == emp.inferior.length)&&(emp.user._id != usrOriginal.user._id)){
                                        if(!valuesName.includes(emp.user.name)){
                                            valuesName.push(emp.user.name);
                                            values.push(emp);
                                        }
                                        if((superior.user._id != data.user._id) && (emp.superior!= null) && (emp.superior.length > 0) && (emp.user._id != data.user._id) && (emp.superior.user._id != data.user._id) && (emp.user._id != usrOriginal.user._i)){
                                        await user_created.findOne({'user': emp.superior._id}).populate({
                                            path: 'entradas',
                                            populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                            emp = emp2!;
                                        });}
                                        else{final = true;}
                                    }
                                }
                                y = y+1;
                            }
                        }
                        else if((!valuesName.includes(emp.user.name))&&(emp.user._id != usrOriginal.user._id)){
                            if(!valuesName.includes(emp.user.name)){
                                valuesName.push(emp.user.name);
                                values.push(emp);
                            await user_created.findOne({'user': emp.superior._id}).populate({
                                path: 'entradas',
                                populate: [{path: 'user'},{path: 'cliente'}]}).populate('user').populate('rol').populate('superior').populate('inferior').then((emp2) => {
                                emp = emp2!;
                            });}
                            else{final = true;}
                        }
                        else{
                            final = true;
                        }   
                    }
                i = i+1;
            }
            for(var userOut in values){
                if(values[userOut].user._id == req.body._id){
                    values.splice(Number.parseInt(userOut));
                }
            }
            return res.status(200).json(values);
        }else{
            return res.status(404);
        }
    }else{
        return res.status(401).json(null);
    }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
}





export default{getRols, createRol, updateRol, getEmployees}