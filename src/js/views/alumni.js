

var AmpersandView = require('ampersand-view');
var alumni = require('../data/alumni');
var template = require('../../templates/views/alumni/includes/year.jade');
var overlayTemplate = require('../../templates/views/alumni/includes/video-overlay.jade');
var utils = require('../utils');

var AlumniView = AmpersandView.extend({
    
    events: {
        "click .previous-year": "selectEvent",
        "click .alumni-thumbnail": "showVideo",
        // "click .video-overlay-container": "hideVideo"
    },

    initialize: function() {
        this.$container = $(this.query('.year-container'));
    },

    selectEvent: function (e) {
        $(this.queryAll('.previous-year')).removeClass('selected');
        var $el = $(e.target).closest('.previous-year');
        $el.addClass('selected');
        var idx = $el.data('index');
        this.currentEvent = alumni[idx];

        var self = this;
        this.$container.fadeTo(500, 0, function() {
            self.$container.html(template({
                sxs: alumni[idx],
                utils: utils
            })).fadeTo(500, 1);
        });
        
    },

    showVideo: function(e) {
        console.log('show video');
        console.log($('.video-overlay-container'));

        var participantIndex = $(e.target).data('index');

        var prev = (participantIndex > 0) ? this.currentEvent[participantIndex-1] : null;
        var next = (participantIndex < this.currentEvent.length - 1) ? this.currentEvent[participantIndex+1] : null;
        var current = this.currentEvent[participantIndex];

        $('.video-overlay-container').html(overlayTemplate({
            previous: prev,
            current: current,
            next: next
        })).show();

        $('.video-overlay-container').off().click(function() {
            $(this).hide();
        })
    },

    hideVideo: function(e) {
        console.log('hide video');
        $('.video-overlay-container').hide();  
    }
});

module.exports = AlumniView;