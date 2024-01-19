import mongoose, { Document, Schema } from 'mongoose';
import cliente, { ICliente } from './cliente';
import User, {IUser} from "./user";

const entradaSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
   cliente: {
        type: Schema.Types.ObjectId,
        ref: cliente
   }, 
   date:{
     type:Date
   },
   hours:{
     type:Number
   },
   description:{
     type:String
   },
   area:{
     type: String
   },
   servicio:{
     type: String
   },
   anoFiscal:{
     type: Date
   },
   proyecto:{
     type: String
   },
   fase:{
     type: String
   },
   horasDesplazamiento:{
     type: Number
   },
   reunion: {
    type:String
   }
});
//Interfaz para tratar respuesta como documento
export interface IEntrada extends Document {
    user: IUser['_id'];
    cliente: ICliente['_id'];
    date: Date;
    hours: number;
    description: string;
    area:string;
    servicio: string;
    anoFiscal: String;
    proyecto: string;
    fase: string;
    horasDesplazamiento: number;
    reunion: string;
}
export interface IEntrada{
    user: IUser['_id'];
    cliente: ICliente['_id'];
    date: Date;
    hours: number;
    description: string;
    area:string;
    servicio: string;
    anoFiscal: String;
    proyecto: string;
    fase: string;
    horasDesplazamiento: number;
    reunion: string;
}

//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IEntrada>('Entrada', entradaSchema,'entradas');