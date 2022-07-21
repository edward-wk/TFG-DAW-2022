const mongoose = require('mongoose');

const DatosSchema = mongoose.Schema({
    username: {type: String},
    nombre: {type: String},
    apellido1: {type: String},
    apellido2: {type: String},
    tipo_doc: {type: String},
    documento: {type: String},
    titulacion:{type:String},
    especialidad:{type:String},
    credenciales_adic:{type:String},
    num_colegiado:{type:String},
    telefono: {type: String},
    email: {type: String},    
    direccion: {
        calle: {type: String},
        cod_postal: {type: String},
        ciudad: {type: String},
        provincia: {type: String},
        pais: {type: String},
        usu: {type: String},
        f_usu: {type: Date},
        acion_usu: {type: String}
    },
})
module.exports = mongoose.model('Psicologo', DatosSchema);