const mongoose = require('mongoose');

const agendaSchema = mongoose.Schema({
    idPsicologo: String,
    start: Date,
    end: Date,
    title: String,
    color: {
        primary: String,
        secondary: String
    },
    actions: [{
        id: String,
        label: String,
        cssClass: String,
        a11yLabel: String
    }],
    allDay: Boolean,
    cssClass: String,
    resizable: {
        beforeStart: {type: Boolean, default: true},
        afterEnd: {type: Boolean, default: true},
    },
    draggable: {type: Boolean, default: true},
    meta: String
})

// Duplicate the ID field.
agendaSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
agendaSchema.set('toJSON', {
    virtuals: true
});

agendaSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Agenda', agendaSchema);
