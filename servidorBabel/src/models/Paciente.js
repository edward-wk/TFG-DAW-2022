const mongoose = require('mongoose');

const DatosSchema = mongoose.Schema(
    {
        nomApe1Ape2: {type: String},
        nombre: {type: String},
        apellido1: {type: String},
        apellido2: {type: String},
        tipo_doc: {type: String},
        documento: {type: String},
        fecha_nacimiento: {type: Date},
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
        aseguradora: {type: String},
        company: {type: String},
        numero_historia: {type: String},
        contacto: {
            nombre: {type: String},
            telefono: {type: String},
            usu: {type: String},
            f_usu: {type: Date},
            acion_usu: {type: String}
        },
        permiso_grabacion: {type: Boolean},
        firma_proteccion_datos: {type: Boolean},
        datosMedicos: {
            antecedentes: {
                familiares: {
                    observaciones: {type: String}, usu: {type: String}, f_usu: {type: Date}, acion_usu: {type: String}
                },
                personales: {
                    observaciones: {type: String}, usu: {type: String}, f_usu: {type: Date}, acion_usu: {type: String}
                }
            },
            valoracion:
                [
                    {
                        procedencia: {type: String},
                        fecha_inicio: {type: Date},
                        fecha_alta: {type: Date},
                        psicologo: {type: String},
                        motivo_consulta: {type: String},
                        sintomas: {type: String},
                        usu: {type: String},
                        f_usu: {type: Date},
                        acion_usu: {type: String},
                        diagnostico_medico: {
                            patologia_medica: {type: String},
                            fecha_diagnostico: {type: Date},
                            posologia: {type: String},
                            usu: {type: String},
                            f_usu: {type: Date},
                            acion_usu: {type: String}
                        },
                        test_diagnosticos: {
                            cognitiva: {
                                fecha_valoracion: {type: Date},
                                observaciones: {type: String},
                                usu: {type: String},
                                f_usu: {type: Date},
                                acion_usu: {type: String}
                            },
                            emocional: {
                                fecha_valoracion: {type: Date},
                                observaciones: {type: String},
                                usu: {type: String},
                                f_usu: {type: Date},
                                acion_usu: {type: String}
                            },
                            pruebasPsicodiagnostico: {
                                fecha_prueba: {type: Date},
                                observaciones: {type: String},
                                usu: {type: String},
                                f_usu: {type: Date},
                                acion_usu: {type: String}
                            }
                        },
                        diagnostico_psicologico: {
                            diagnostico: {type: String},
                            fecha_diagnostico: {type: Date},
                            observaciones_personales: {type: String},
                            usu: {type: String},
                            f_usu: {type: Date},
                            acion_usu: {type: String}
                        },
                        seguimiento: [
                            {
                                fecha_cita: {type: Date},
                                observaciones: {type: String},
                                conducta_a_seguir: {type: String},
                                anotaciones: {type: String},
                                usu: {type: String},
                                f_usu: {type: Date},
                                acion_usu: {type: String}
                            }
                        ]
                    }
                ]
        }
    }
)

module.exports = mongoose.model('Clientes', DatosSchema);
