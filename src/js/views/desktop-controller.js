'use strict';

var _ = require('lodash');
var utils = require('../utils');
var Viz = require('../viz/viz');

var ParticipantView = require('./participants');
var AlumniView = require('./alumni');

/*
 * View controller
 */
function DesktopViewController($el) {
    if (!(this instanceof DesktopViewController)) {
        return new DesktopViewController($el);
    }

    this.$el = $el;
    // maybe you want to instantiate a vizualization:
    //


    var viz = new Viz(this.$el.find('.svg-container'));



    var $header = this.$el.find('.header');
    var headerHeight = $header.height();

    $(document).on('scroll', onScroll);

    var contentOffset = $('.content').offset().top;

    this.$el.find('.header a, .navigation a').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - headerHeight
        }, 1000, 'swing', function () {
            // window.location.hash = target;
            // onScroll();
            $(document).on("scroll", onScroll);
        });
    });


    function onScroll(event){
        var scrollPos = $(document).scrollTop();
        var pos = contentOffset - scrollPos;
        if(pos < 0 && pos > -headerHeight) {
            $header.css({
                opacity: Math.min(1, (Math.abs(pos) / headerHeight) + 0.5),
                'z-index': 1
            });
        } else if(pos < 0) {
            $header.css({
                opacity: 1.0,
                'z-index': 999
            });
        } else {
            $header.css({
                opacity: 0,
                'z-index': -10
            });
        }

        $('.header .navigation a').each(function () {
            var curLink = $(this);
            var refElement = $(curLink.attr('href'));
            // console.log(curLink.attr('href'));
            if(!refElement) {
                // console.log(curLink.attr('href'));
            }

            var elOffset = refElement.offset().top;
            // console.log('scroll pos', scrollPos);
            // console.log('el pos', elOffset);
            if (elOffset <= scrollPos + headerHeight && elOffset + refElement.height() > scrollPos) {
                $('.header .navigation a').removeClass('active');
                curLink.addClass('active');
            }
            else{
                curLink.removeClass('active');
            }
        });
    }

    var participantView = new ParticipantView({
        el: this.$el.find('#participants')[0]
    });
    // new AlumniView({
    //     el: this.$el.find('#alumni')[0]
    // });
    viz.on('select', function(i) {
        $('.header a[href=#participants]').trigger('click');
        participantView.setParticipant(i);
    });

    var $ticketBox = $('.ticket-box');
    $ticketBox.height($ticketBox.closest('.row').height());

    onScroll();

}



DesktopViewController.prototype.destroy = function() {
    this.$el.find('*').unbind().html();
};

module.exports = DesktopViewController;
