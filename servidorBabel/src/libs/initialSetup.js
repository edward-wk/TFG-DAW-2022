import Agenda from "../models/Agenda";
import Role from "../models/Role";

export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        if (count > 0) return;

        await Promise.all([
            new Role({name: 'user'}).save(),
            new Role({name: 'admin'}).save(),
            new Role({name: 'psicologo'}).save()
        ])
    } catch (error) {
    }
}

export const createAgenda = async () => {
    try {
        const count = await Agenda.estimatedDocumentCount()

        if (count > 0) return;

        await Promise.all([
            new Agenda(
                {
                    id: 'String',
                    start: new Date(),
                    end: new Date(),
                    title: 'String',
                    color: {
                        primary: 'String',
                        secondary: 'String'
                    },
                    actions: [{
                        id: 'String',
                        label: 'String',
                        cssClass: 'String',
                        a11yLabel: 'String'
                    }],
                    allDay: false,
                    cssClass: 'String',
                    resizable: {
                        beforeStart: false,
                        afterEnd: false,
                    },
                    draggable: false,
                    meta: 'String'
                }
            ).save()
        ])
    } catch (error) {
    }
}
