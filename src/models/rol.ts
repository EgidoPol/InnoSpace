import mongoose, { Document, Schema } from 'mongoose';

const rolSchema = new Schema({
    level: {
        type:Number
   },
   name: {
    type:String
   }
});
//Interfaz para tratar respuesta como documento
export interface IRol extends Document {
    level: number;
    name: string;
}
export interface IRol{

    level: number;
    name: string;
}

//Exportamos modelo para poder usarlo correctamente
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IRol>('Rol', rolSchema,'rols');