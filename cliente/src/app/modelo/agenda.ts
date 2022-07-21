export interface Agenda {
    id: String
    idPsicologo: String,
    start: Date,
    end: Date,
    title: String,
    color: {
        primary: String,
        secondary: String
    },
    actions: String,
    allDay: Boolean,
    cssClass: String,
    resizable: {
        beforeStart: Boolean,
        afterEnd: Boolean,
    },
    draggable: Boolean,
    meta: String
}
