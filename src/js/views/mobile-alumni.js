'use strict';

var AmpersandView = require('ampersand-view');
var alumni = require('../data/alumni');
var template = require('../../templates/views/alumni/includes/mobile-year.jade');
var overlayTemplate = require('../../templates/views/alumni/includes/video-overlay.jade');
var utils = require('../utils');
var _ = require('lodash');

var AlumniView = AmpersandView.extend({
    
    events: {
        "click .previous-year": "selectEvent",
        // "click .video-overlay-container": "hideVideo"
    },

    initialize: function() {
        this.currentEvent = alumni[0];
        this.$container = $(this.query('.year-container'));

        console.log('initing alumbiview')
    },

    selectEvent: function (e) {
        $(this.queryAll('.previous-year')).removeClass('selected');
        var $el = $(e.target).closest('.previous-year');
        $el.addClass('selected');
        var idx = $el.data('index');
        this.currentEvent = alumni[idx];

        var self = this;
        // this.$container.fadeTo(500, 0, function() {
            self.$container.html(template({
                sxs: alumni[idx],
                utils: utils
            }));
        // });
        
    },

    showVideo: function(e) {

        var $target = $(e.target).closest('.alumni-thumbnail, .featured-thumbnail');

        if($target.data('external-location')) {
            return window.location.href = $target.data('external-location');
        }
        
        var participantIndex = $(e.target).closest('.alumni-thumbnail, .featured-thumbnail').data('index');
        this.showVideoWithIndex(participantIndex);
    },

    showVideoWithIndex: function(i) {

        var prev;

        console.log(this.currentEvent);
        if(this.currentEvent.title === '2015') {
            prev = (i > 1) ? this.currentEvent.participants[i-1] : null;
        } else {
             prev = (i > 0) ? this.currentEvent.participants[i-1] : null;
        }
        
        var next = (i < this.currentEvent.participants.length - 1) ? this.currentEvent.participants[i+1] : null;
        var current = this.currentEvent.participants[i];

        var videoWidth = $(window).width() * 0.7;
        var videoHeight = videoWidth * 9 / 16;

        $('body, html').css({'overflow-y': 'hidden'});

        $('.video-overlay-container').html(overlayTemplate({
            previous: prev,
            previousIndex: i - 1,
            current: current,
            next: next,
            title: this.currentEvent.title,
            nextIndex: i + 1,
            videoWidth: videoWidth,
            videoHeight: videoHeight
        })).show();

        var self = this;

        $('.close-video').off().click(function() {
            $(this).closest('.video-overlay-container').html('').fadeOut();
            $('body, html').css({'overflow-y': 'auto'});
        })

        $('.video-overlay-container .previous, .video-overlay-container .next').off().click(function() {
            self.showVideoWithIndex($(this).data('index'));
        });
    },

    hideVideo: function(e) {
        console.log('hide video');
        $('.video-overlay-container').hide();  
    }
});

module.exports = AlumniView;