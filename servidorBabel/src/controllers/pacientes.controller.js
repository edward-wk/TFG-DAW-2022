import Paciente from '../models/Paciente';
import NombrePacientes from '../models/NombrePacientes';

export const createPaciente = async (req, res) => {
    try {

        const newPaciente = new Paciente(req.body)

        let letra;

        switch (newPaciente.aseguradora[0]) {
            case "C":
            case "c":
                letra = "C";
                break;
            case "J":
            case "j":
                letra = "J";
                break;
            default:
                letra = "P";
                break;
        }

        let historia = '';
        let buscar;

        do {
            const numero = Math.floor(Math.random() * (999999999 - 1)) + 1
            buscar = letra + numero
            historia = await Paciente.findOne({numero_historia: buscar})
        } while (historia)

        newPaciente.numero_historia = buscar
        const pacienteSaved = await newPaciente.save();

        const nombreConcat = req.body.nombre + ' ' + req.body.apellido1 + ' ' + req.body.apellido2
        const newNombre = new NombrePacientes({name: nombreConcat.toUpperCase()})
        await newNombre.save();
        res.status(200).json(pacienteSaved);
    } catch (e) {
    }
}

export const getPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.find();
        res.json(paciente);
    } catch (e) {
    }
}

export const getPacienteById = async (req, res) => { // GET
    try {
        const paciente = await Paciente.findById(req.params.pacienteId);
        res.json(paciente);
    } finally {
    }
}

export const getPacienteNombre = async (req, res) => { // GET
    try { //const paciente = await Paciente.findOne({nombre: req.params.nombre}, {datosMedicos:1})
        const paciente = await Paciente.findOne({nombre: req.params.nombre})
        res.json(paciente);
    } catch (e) {
    }
}

export const updatePacienteById = async (req, res) => { // PUT
    try {

        const paciente = await Paciente.findOneAndUpdate({_id: req.params.pacienteId}, req.body, {
            new: true
        });
        res.status(200).json(paciente);
    } catch (e) {
    }
}

export const deletePacienteById = async (req, res) => { // DELETE
    try {
        await Paciente.findOneAndDelete({name: req.params.pacienteId});
        res.status(204).json();
    } catch (e) {
    }
}

export const getPacientesNombre = async (req, res) => {
    try {
        const projection = {_id: 1, nomApe1Ape2: 1};
        const dato = await Paciente.find({nomApe1Ape2: new RegExp(req.params.nombre)}, projection);
        res.send(dato)
    } catch (error) {
    }
}

export const altaConsultaPaciente = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;

        const validarFormato = new Date(datos.fecha_diagnostico)
        if (validarFormato > 0) {
            await Paciente.updateOne(
                {_id: idPaciente,},
                {
                    $push:
                        {
                            "datosMedicos.valoracion": {
                                procedencia: datos.procedencia,
                                motivo_consulta: datos.con_motivo,
                                sintomas: datos.con_sintomas,
                                fecha_inicio: datos.fecha_inicio,
                                diagnostico_medico: {
                                    fecha_diagnostico: datos.fecha_diagnostico,
                                    patologia_medica: datos.patologia_medica,
                                    posologia: datos.posologia
                                }
                            }
                        }
                })
        } else {
            await Paciente.updateOne(
                {_id: idPaciente,},
                {
                    $push:
                        {
                            "datosMedicos.valoracion": {
                                procedencia: datos.procedencia,
                                motivo_consulta: datos.con_motivo,
                                sintomas: datos.con_sintomas,
                                fecha_inicio: datos.fecha_inicio,
                            }
                        }
                })
        }

        return res.status(200).json({message: 'Alta consulta realizada.'})

    } catch (e) {
    }
}

export const modificacionConsulta = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;
        const indiceValoracion = req.params.valoracion

        if (indiceValoracion < 0) {
            return res.status(420).json({message: 'Crea una consulta primero.'})
        }

        const validarFormato = new Date(datos.fecha_diagnostico)
        if (validarFormato > 0) {
            await Paciente.findByIdAndUpdate(
                {
                    _id: idPaciente
                },
                {
                    $set:
                        {
                            [`datosMedicos.valoracion.${indiceValoracion}.motivo_consulta`]: datos.con_motivo,
                            [`datosMedicos.valoracion.${indiceValoracion}.sintomas`]: datos.con_sintomas,
                            [`datosMedicos.valoracion.${indiceValoracion}.diagnostico_medico.fecha_diagnostico`]: datos.fecha_diagnostico,
                            [`datosMedicos.valoracion.${indiceValoracion}.diagnostico_medico.patologia_medica`]: datos.patologia_medica,
                            [`datosMedicos.valoracion.${indiceValoracion}.diagnostico_medico.posologia`]: datos.posologia
                        }
                })
        } else {
            await Paciente.findByIdAndUpdate(
                {
                    _id: idPaciente
                },
                {
                    $set:
                        {
                            [`datosMedicos.valoracion.${indiceValoracion}.motivo_consulta`]: datos.con_motivo,
                            [`datosMedicos.valoracion.${indiceValoracion}.sintomas`]: datos.con_sintomas
                        }
                })
        }

        return res.status(200).json({message: 'Alta consulta realizada.'})

    } catch (e) {
    }
}

export const modificarAntecedentes = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;

        await Paciente.findByIdAndUpdate({_id: idPaciente,},
            {
                $set:
                    {
                        "datosMedicos.antecedentes.familiares.observaciones": datos.ant_familiares,
                        "datosMedicos.antecedentes.personales.observaciones": datos.ant_personales,
                    }
            })

        return res.status(200).json({message: 'Antecedentes modificados'})

    } catch (e) {
    }
}

export const modificarPruebas = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;
        const valoracion = req.params.valoracion;

        if (valoracion < 0) return res.status(420).json({message: 'Crea una consulta primero.'})

        await Paciente.updateOne(
            {_id: idPaciente,},
            {

                $set:
                    {
                        [`datosMedicos.valoracion.${valoracion}.diagnostico_psicologico.diagnostico`]: datos.dco_psicologico,
                        [`datosMedicos.valoracion.${valoracion}.test_diagnosticos.cognitiva.observaciones`]: datos.cognitiva,
                        [`datosMedicos.valoracion.${valoracion}.test_diagnosticos.emocional.observaciones`]: datos.emocional,
                        [`datosMedicos.valoracion.${valoracion}.test_diagnosticos.pruebasPsicodiagnostico.observaciones`]: datos.pruebasPsicodiagnostico,

                    }
            })

        return res.status(200).json({message: 'Modificar pruebas.'})

    } catch (e) {
    }
}
export const modificarSeguimiento = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;
        const valoracion = req.params.valoracion;
        const seguimiento = req.params.seguimiento;

        if (seguimiento < 0) {
            return res.status(420).json({message: 'Crea un seguimiento primero.'})
        }

        await Paciente.findByIdAndUpdate(idPaciente,
            {
                $set:
                    {
                        [`datosMedicos.valoracion.${valoracion}.seguimiento.${seguimiento}.observaciones`]: datos.observaciones,
                        [`datosMedicos.valoracion.${valoracion}.seguimiento.${seguimiento}.conducta_a_seguir`]: datos.conducta_a_seguir,
                        [`datosMedicos.valoracion.${valoracion}.seguimiento.${seguimiento}.anotaciones`]: datos.anotaciones
                    }
            })

        return res.status(200).json({message: 'Modificacion segumiento realizada.'})

    } catch (e) {
    }
}

export const altaSeguimiento = async (req, res) => {
    console.log('asdsadasd');
    try {
        const idPaciente = req.params.pacienteId;
        const datos = req.body;
        const valoracion = req.params.valoracion;

        const datosPaciente = await Paciente.findById(idPaciente)
        const validFecha = new Date(datosPaciente.datosMedicos.valoracion[valoracion].fecha_alta)
        if (validFecha > 0) return res.status(421).json({message: 'No se puede modificar un paciente que está dado de alta.'})

        if (valoracion < 0) return res.status(420).json({message: 'Crea una consulta primero.'})

        await Paciente.updateOne(
            {
                _id: idPaciente,
                //"datosMedicos.valoracion": datos
            },
            {
                $push:
                    {

                        [`datosMedicos.valoracion.${valoracion}.seguimiento`]: {
                            fecha_cita: datos.fecha_cita,
                            observaciones: datos.observaciones,
                            conducta_a_seguir: datos.conducta_a_seguir,
                            anotaciones: datos.anotaciones,
                            fecha_prox_cita: datos.fecha_prox_cita,
                            hora_prox_cita: datos.hora_prox_cita,
                            fin_prox_cita: datos.fin_prox_cita,
                        }
                    }
            })

        return res.status(200).json({message: 'alta segumiento realizada.'})

    } catch (e) {
        console.log(e);
    }
}
/**
 * Modifica la fecha de alta de una valoracion
 * @param {*} req
 * @param {*} res
 */
export const modificarFechaAlta = async (req, res) => {
    try {
        const idPaciente = req.params.pacienteId;
        const valoracion = req.params.valoracion;
        const fechaAlta = new Date();

        await Paciente.findByIdAndUpdate(idPaciente,

            {
                $set:
                    {
                        [`datosMedicos.valoracion.${valoracion}.fecha_alta`]: fechaAlta
                    }
            }
        )
    } catch (e) {

    }
}