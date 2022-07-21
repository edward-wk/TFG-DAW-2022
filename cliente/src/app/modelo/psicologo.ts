export interface Psicologo {
    _id: String,
    username: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    tipo_doc: String,
    documento: String,
    titulacion: String,
    especialidad: String,
    credenciales_adic: String,
    num_colegiado: String,
    telefono: String,
    email: String,
    direccion: {
        calle: String,
        cod_postal: String,
        ciudad: String,
        provincia: String,
        pais: String,
        usu: String,
        f_usu: Date,
        acion_usu: String
    }
}
