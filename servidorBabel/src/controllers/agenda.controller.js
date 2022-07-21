import AgendaSchema from '../models/Agenda'

export const getByPsicologo = async (req, res) => {
    try {
        //const idPsicologo = req.params.idPsicologo;
        const agenda = await AgendaSchema.find()

        return res.status(200).json(agenda)
    }catch (e) {
    }
}

export const addCita = async (req, res) => {
    try {
        const cita = new AgendaSchema(req.body)
        if (!cita.color.primary){
            cita.color.primary = '#000000'
        }
        await cita.save()
        return res.status(200).json(cita)
    }catch (e) {
    }
}

export const modificarCita = async (req, res) => {
    try {
        const datos = req.body
        const id = datos.id
        const cita = await AgendaSchema.findByIdAndUpdate(id, {
            title: datos.title,
            start: datos.start,
            end: datos.end,
            "color.primary": datos.color.primary
        }, {new: true})  // OLGA

        //const cita = await AgendaSchema.findById(datos.id)

        return res.status(200).json(cita)
    }catch (e) {
    }
}

export const eliminarCita = async (req, res) => {
    try {
        const id = req.params.id
        await AgendaSchema.findByIdAndRemove(id)

        return res.status(200).json({message: 'Correcto'})
    }catch (e) {
    }
}