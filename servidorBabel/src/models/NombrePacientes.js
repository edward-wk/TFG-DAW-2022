const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
    name: {
        type: String
    }
})

module.exports = mongoose.model('NombrePacientes', clienteSchema);