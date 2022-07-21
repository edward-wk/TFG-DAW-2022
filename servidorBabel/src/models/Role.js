import {model, Schema} from 'mongoose';

export const ROLES = ["user", "psicologo", "admin"];

const roleSchema = new Schema({
    name: String
},{
    versionKey: false
})

export default model('Role', roleSchema);