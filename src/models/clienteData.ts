
import mongoose, { Document, Schema } from 'mongoose';

import { userInfo } from 'os';
import { markAsUntransferable } from 'worker_threads';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const clienteDataSchema = new Schema({
    
});

//Interfaz para tratar respuesta como documento
export interface IClienteData extends Document {
    id:string
    name: string;
    email: string;
    password: string;
    validated: boolean;
}
//Interface for User without mongoose document
export interface IClienteDataModel {
    _id:string
    name: string;
    email: string;
    password: string;
    validated: boolean;
}

//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IClienteData>('ClienteData', clienteDataSchema,'clienteDatas');
