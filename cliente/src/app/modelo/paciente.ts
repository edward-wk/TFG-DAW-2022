export interface Paciente {
    _id: String
    nomApe1Ape2: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    tipo_doc: String,
    documento: String,
    fecha_nacimiento: Date,
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
    },
    aseguradora: String,
    company: String,
    numero_historia: String,
    contacto: {
        nombre: String,
        telefono: String,
        usu: String,
        f_usu: Date,
        acion_usu: String
    },
    permiso_grabacion: Boolean,
    firma_proteccion_datos: Boolean,
    datosMedicos: {
        antecedentes: {
            familiares: {
                observaciones: String,
                usu: String,
                f_usu: Date,
                acion_usu: String
            },
            personales: {
                observaciones: String,
                usu: String,
                f_usu: Date,
                acion_usu: String
            }
        },
        valoracion: [
            {
                procedencia: String,
                fecha_inicio: Date,
                fecha_alta: Date,
                psicologo: String,
                motivo_consulta: String,
                sintomas: String,
                usu: String,
                f_usu: Date,
                acion_usu: String,
                diagnostico_medico:
                    {
                        patologia_medica: String,
                        fecha_diagnostico: Date,
                        posologia: String,
                        usu: String,
                        f_usu: Date,
                        acion_usu: String
                    },
                test_diagnosticos:
                    {
                        cognitiva: {
                            fecha_valoracion: Date,
                            observaciones: String,
                            usu: String,
                            f_usu: Date,
                            acion_usu: String
                        },
                        emocional: {
                            fecha_valoracion: Date,
                            observaciones: String,
                            usu: String,
                            f_usu: Date,
                            acion_usu: String
                        },
                        pruebasPsicodiagnostico: {
                            fecha_valoracion: Date,
                            observaciones: String,
                            usu: String,
                            f_usu: Date,
                            acion_usu: String
                        }

                    },
                diagnostico_psicologico:
                    {
                        diagnostico: String,
                        fecha_diagnostico: Date,
                        observaciones_personales: String,
                        usu: String,
                        f_usu: Date,
                        acion_usu: String
                    },
                seguimiento: [
                    {
                        fecha_cita: Date,
                        observaciones: String,
                        conducta_a_seguir: String,
                        anotaciones: String,
                        usu: String,
                        f_usu: Date,
                        acion_usu: String
                    }
                ]
            }
        ]
    }
}
