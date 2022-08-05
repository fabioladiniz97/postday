const mongoose = require('../database/bd');

const notaSchema = new mongoose.Schema({
    titulo:{type:String,required: true},
    comentario: String,
    cor: String
});

const Nota =mongoose.model('notas', notaSchema);

module.exports = Nota;