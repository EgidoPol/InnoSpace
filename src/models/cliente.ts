import mongoose, { Document, Schema } from 'mongoose';
import User, {IUser} from "./user";
import ClienteData, {IClienteData} from "./clienteData";

const clienteSchema = new Schema({
    id: {
        type:String
    },
    name: {
        type:String
    },
   horasTotales: {
        type:Number
   },
   trabajadores:[{
        type: Schema.Types.ObjectId,
        ref: User
   }]/*,
   clienteData: {
        type: Schema.Types.ObjectId,
        ref: ClienteData
   }*/
});
//Interfaz para tratar respuesta como documento
export interface ICliente extends Document {
    id: string;
    name: string;
    horasTotales: Number;
    trabajadores: IUser['_id'];
    clienteData: IClienteData['_id'];
}
export interface ICliente{
    id: string;
    name: string;
    horasTotales: Number;
    trabajadores: IUser['_id'];
    clienteData: IClienteData['_id'];
}

//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ICliente>('Cliente', clienteSchema,'clientes');