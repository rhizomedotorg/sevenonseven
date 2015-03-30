

var AmpersandView = require('ampersand-view');
var participants = require('../data/participants');
var fullParticipant = require('../../templates/views/participants/includes/full-participant.jade');
var smallParticipant = require('../../templates/views/participants/includes/mini-participant.jade')
var _ = require('lodash');
var utils = require('../utils');

var ParticipantsView = AmpersandView.extend({
    
    events: {
        "click .mini-participant": "selectParticipant"
    },

    initialize: function() {

        this.currentIndex = 0;
        this.$el = $(this.el);
        this.$container = $(this.query('#selected-participant-container'));

        var self = this;

        setTimeout(function() {
            self.$el.find('.mini-participant-container').css({'height': self.$el.find('.mini-participant-container').height(), overflow: 'hidden'});
        }, 2000);
        
        this.$container.css({'min-height': this.$container.height()});
        this.$container.find('.image-container').removeClass('outro');
        _.each(participants, function(participant) {
            utils.preloadImage(participant.artist.photo);
            utils.preloadImage(participant.technologist.photo);
        });
    },

    selectParticipant: function (e) {
        // $(this.queryAll('.mini-participant')).removeClass('selected');
        var $el = $(e.target).closest('.mini-participant');
        var idx = $el.data('participant-id');

        this.setParticipant(idx);

    },

    setParticipant: function(idx) {
        if(idx === this.currentIndex) {
            return;
        }
        var self = this;
        this.$container.find('.image-container').addClass('outro');

        setTimeout(function() {
            self.$container.fadeTo(500, 0, function() {
                self.$container.html(fullParticipant({ 
                    participant: participants[idx],
                    i: idx
                })).fadeTo(500, 1);
                setTimeout(function() {
                    self.$container.find('.image-container').removeClass('outro');
                }, 500);
            });
        }, 500)
        

        var $removeEl = this.$el.find('[data-participant-id=' + idx + ']').parent();
        $removeEl.find('.participant-names').remove();
        $removeEl.animate({width: 0}, function() {
            $removeEl.remove();
            setTimeout(function() {
                $('.mini-participant-container').append(smallParticipant({
                    participant: participants[self.currentIndex],
                    i: self.currentIndex-1
                }));
                self.currentIndex = idx;
            }, 750);
        });
    }

});

module.exports = ParticipantsView;