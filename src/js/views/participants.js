

var AmpersandView = require('ampersand-view');
var participants = require('../data/participants');
var fullParticipant = require('../../templates/views/participants/includes/full-participant.jade');
var _ = require('lodash');
var utils = require('../utils');

var ParticipantsView = AmpersandView.extend({
    
    events: {
        "click .mini-participant": "selectParticipant"
    },

    initialize: function() {

        this.$container = $(this.query('#selected-participant-container'));
        _.each(participants, function(participant) {
            utils.preloadImage(participant.artist.photo);
            utils.preloadImage(participant.technologist.photo);
        });
    },

    selectParticipant: function (e) {
        $(this.queryAll('.mini-participant')).removeClass('selected');
        var $el = $(e.target).closest('.mini-participant');
        $el.addClass('selected');
        var idx = $el.data('participant-id');

        var self = this;
        this.$container.fadeTo(500, 0, function() {
            self.$container.html(fullParticipant({ 
                participant: participants[idx],
                i: idx
            })).fadeTo(500, 1);
        });
    }
});

module.exports = ParticipantsView;