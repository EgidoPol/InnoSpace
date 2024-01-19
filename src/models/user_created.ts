import mongoose, { Document, Schema } from 'mongoose';
import entrada from './entrada';
import rol, {IRol} from './rol';
import User, {IUser} from "./user";
//import piñata, { IPiñata } from './piñata';
//import lot, { ILot } from './lot';
//import poll, { IPoll } from './poll';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userCreatedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User 
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: rol
    },
    entradas: [{
        type: Schema.Types.ObjectId,
        ref: entrada
    }],
    superior:{
        type: Schema.Types.ObjectId,
        ref:User
    },
    inferior: [{
        type: Schema.Types.ObjectId,
        ref:  User
    }]

});
//Interfaz para tratar respuesta como documento
export interface IUserCreated extends Document {
    user: IUser['_id'];
    rol: IRol['_id'];
    entradas: IUser['_id'];
    superior: IUser['_id'];
    inferior: IUser['_id'];
}
export interface IUserCreated{
    user: IUser['_id'];
    rol: IRol['_id'];
    entradas: IUser['_id'];
    superior: IUser['_id'];
    inferior: IUser['_id'];
}

//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IUserCreated>('UserCreated', userCreatedSchema,'usersCreated');