'use strict';

//
// app.js is the entry point for the entire client-side
// application. Any necessary top level libraries should be
// required here (e.g. pym.js), and it should also be
// responsible for instantiating correct viewcontrollers.
//
// require('./lib/jquery.modal.js');

$(function() {

    var DesktopViewController = require('./views/desktop-controller');
    // var MobileViewController = require('./views/mobile-controller');
    // var emitter = require('./emitter');
    // var _ = require('lodash');
    var utils = require('./utils');

    var desktopView = null;
    // var mobileView = null;
    // var MOBILE_BREAKPOINT = 760;

    var $desktopEl = $('.desktop');


    var $days = $('.days-container');
    var $hours = $('.hours-container');
    var $minutes = $('.minutes-container');
    // var $seconds = $('.seconds-container');
    setInterval(function() {
        $days.text(utils.getDaysAway());
        $hours.text(utils.getHoursAway());
        $minutes.text(utils.getMinutesAway());
        // $seconds.text(utils.getSecondsAway());
    }, 1000);

    if($(window).width() > 799) {
        desktopView = new DesktopViewController($desktopEl);
    } else {
        $('.mini-participant').click(function() {
            $(this).parent().find('.mobile-description').fadeToggle();
        })
    }

    $('.overflow-hidden').css('overflow', 'hidden');


    // setTimeout(function() {
    //     $('.welcome.modal').modal({
    //         fadeDuration: 500
    //     });
    // }, 100)

});