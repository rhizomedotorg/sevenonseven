

var AmpersandView = require('ampersand-view');
var alumni = require('../data/alumni');
var template = require('../../templates/views/alumni/includes/year.jade');
var utils = require('../utils');

var AlumniView = AmpersandView.extend({
    
    events: {
        "click .previous-year": "selectEvent"
    },

    initialize: function() {
        this.$container = $(this.query('.year-container'));
    },

    selectEvent: function (e) {
        console.log('selectEvent');
        $(this.queryAll('.previous-year')).removeClass('selected');
        var $el = $(e.target).closest('.previous-year');
        $el.addClass('selected');
        var idx = $el.data('index');

        console.log(idx);
        console.log(alumni[idx]);

        var self = this;
        this.$container.fadeTo(500, 0, function() {
            self.$container.html(template({
                sxs: alumni[idx],
                utils: utils
            })).fadeTo(500, 1);
        });
        
    }
});

module.exports = AlumniView;