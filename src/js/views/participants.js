

var AmpersandView = require('ampersand-view');
var participants = require('../data/participants');
var fullParticipant = require('../../templates/views/participants/includes/full-participant.jade');

var ParticipantsView = AmpersandView.extend({
    
    events: {
        "click .mini-participant": "selectParticipant"
    },

    selectParticipant: function (e) {
        $(this.queryAll('.mini-participant')).removeClass('selected');
        var $el = $(e.target).closest('.mini-participant');
        $el.addClass('selected');
        var idx = $el.data('participant-id');
        this.query('#selected-participant-container').innerHTML = fullParticipant({ 
            participant: participants[idx],
            i: idx
        });
    }
});

module.exports = ParticipantsView;