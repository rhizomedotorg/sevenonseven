'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var participants = require('../data/participants.json');


var getAngle = function(i) {
    return (((i+7)%14) * Math.PI * 2) / 14;
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};
/*
 * View controller
 */
function Viz($el) {
    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    this.$el = $el;

    var width = $(window).width();
    var height = $(window).height();

    // do some cool vizualization here

    var svg = d3.select($el[0])
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    
    var circleRadius = 0.7 * Math.min(width, height) / 2;


    $('.desktop .announcement').css({width: 0.5 * Math.min(width, height) + 'px'});
    $('.desktop .announcement-container').css({width: 0.5 * Math.min(width, height) + 'px'});

    var firstTransitionSpeed = 75;
    var secondTransitionSpeed = 100;
    var firstDuration = 500;
    var secondDuration = 1000;

    var dotSize = 42 / 3;//circleRadius / 25;
    
    var pairs = [];
    var partners = [];
    var shuffled = _.shuffle(_.range(14));

    var images = [
        ['i_aiweiwei', 'i_jacob'],
        ['i_trevor', 'i_mike'],
        ['i_stanya', 'i_rus'],
        ['i_hannah', 'i_thricedotted'],
        ['i_martine', 'i_gina'],
        ['i_liam', 'i_nate'],
        ['i_camille', 'i_harlo'],
    ];

    var participantNames = _.map(participants, function(participant) {
        return [participant.artist.name, participant.technologist.name];
    });

    console.log(participantNames)


    var shuffledImages = [];
    var imageLinks = [];
    var shuffledParticipants = [];
    _.each(_.range(14), function(i) {
        if(i % 2 === 0) {
            pairs.push([shuffled[i], shuffled[i+1]]);
            partners[shuffled[i]] = shuffled[i + 1];
            partners[shuffled[i+1]] = shuffled[i];
            shuffledImages[shuffled[i]] = images[i / 2][0];
            shuffledImages[shuffled[i+1]] = images[i / 2][1];

            imageLinks[shuffled[i]] = i / 2;
            imageLinks[shuffled[i+1]] = i / 2;
        }
    });

    console.log(shuffledParticipants)

    // console.log(partners);


    var self = this;

    svg.selectAll('.line')
        .data(pairs)
        .enter()
        .append('line')
        .attr('class', 'line')
        .attr('x1', function(d) {
            return (width / 2) + circleRadius * Math.cos(getAngle(d[0]));
        })
        .attr('y1', function(d) {
            return (height / 2) + circleRadius * Math.sin(getAngle(d[0]));
        })
        .attr('x2', function(d) {
            return (width / 2) + circleRadius * Math.cos(getAngle(d[0]));
        })
        .attr('y2', function(d) {
            return (height / 2) + circleRadius * Math.sin(getAngle(d[0]));
        })
        .style('stroke', '#7c62ff')
        .style('stroke-width', 2)
        .transition()
        .duration(function(d, i) {
            return 300 + Math.random() * i * 200;
        })
        .delay(function(d, i) {
            return (firstDuration + (14 * firstTransitionSpeed)) + (i%7) * secondTransitionSpeed;
        })
        .attr('x2', function(d) {
            // console.log(d[1]);
            return (width / 2) + circleRadius * Math.cos(getAngle(d[1]));
        })
        .attr('y2', function(d) {
            // console.log(d);
            return (height / 2) + circleRadius * Math.sin(getAngle(d[1]));
        });



    var $namesContainer = $('.desktop .names-container');

    var nameFadeTimeout = null;
    var circleGroup = svg.selectAll('g.circle-group')
                        .data(_.range(14))
                        .enter()
                        .append('g')
                        .attr('class', 'circle-group')
                        .on('mouseenter', function(d, idx) {

                            if(nameFadeTimeout) {
                                clearTimeout(nameFadeTimeout);
                            }
                            d3.selectAll('.dot')
                                .filter(function(d, i) {
                                    return i === partners[idx] || i === idx;
                                })
                                .transition()
                                .attr('r', dotSize * 3)
                                .each('end', function() {
                                    $('.desktop .center-container').fadeOut('fast');
                                    $namesContainer.find('.artist').text(participantNames[imageLinks[d]][0]);
                                    $namesContainer.find('.technologist').text(participantNames[imageLinks[d]][1]);
                                    $namesContainer.fadeIn('fast');
                                });

                            d3.selectAll('image')
                                .filter(function(d, i) {
                                    return i === partners[idx] || i === idx;
                                })
                                .moveToFront()
                                .transition()
                                .duration(1000)
                                .attr('opacity', 1); 

                        })
                        .on('mouseleave', function(d, idx) {

                            nameFadeTimeout = setTimeout(function() {
                                $('.desktop .center-container').fadeIn('fast');
                                $('.desktop .names-container').fadeOut('fast');     
                            }, 1000);

                            d3.selectAll('.dot')
                                .filter(function(d, i) {
                                    return i === partners[idx] || i === idx;
                                })
                                .transition()
                                .attr('r', dotSize);  
                            
                            d3.selectAll('image')
                                .filter(function(d, i) {
                                    return i === partners[idx] || i === idx;
                                })
                                .transition()
                                .attr('opacity', 0);

                            d3.selectAll('image').moveToBack();

                            

                        })
                        .on('click', function(i) {
                            console.log('select group ' + imageLinks[i]);
                            self.emit('select', imageLinks[i]);
                        });

    var imageSize = 84;
    var images = circleGroup
        .append('svg:image')
        .attr('x', function(i) {
            return (width / 2) + circleRadius * Math.cos(getAngle(i)) - imageSize / 2;
        })
        .attr('y', function(i) {
            return (height / 2) + circleRadius * Math.sin(getAngle(i)) - imageSize / 2;
        })
        .attr('width', imageSize)
        .attr('height', imageSize)
        .attr('xlink:href', function(i) {
            return './images/rollovers/' + shuffledImages[i] + '.png';
        })
        .attr('opacity', 0);



    var circles = circleGroup
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 0)
        .attr('cx', function(i) {
            return (width / 2) + circleRadius * Math.cos(getAngle(i));
        })
        .attr('cy', function(i) {
            return (height / 2) + circleRadius * Math.sin(getAngle(i));
        })
        .transition()
        .duration(firstDuration)
        .delay(function(i) {
            return i * firstTransitionSpeed;
        })
        .attr('r', dotSize / 3)
        .transition()
        .duration(secondDuration)
        .delay(function(i) {
            return (firstDuration + (14 * firstTransitionSpeed)) + (i%7) * secondTransitionSpeed;
        })
        .attr('r', dotSize)
        .attr('alpha', 0);

        setTimeout(function() {
            $('.content-container').fadeIn('slow');
        }, 200 + firstDuration + (14 * firstTransitionSpeed) + (6 * secondTransitionSpeed));


    window.onresize = _.throttle(function() {

        width = $(window).width();
        height = $(window).height();
        circleRadius = 0.7 * Math.min(width, height) / 2;
        dotSize = circleRadius / 25;

        svg
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('.dot')
            .transition()
            .attr('cx', function(i) {
                return (width / 2) + circleRadius * Math.cos(getAngle(i));
            })
            .attr('cy', function(i) {
                return (height / 2) + circleRadius * Math.sin(getAngle(i));
            })
            .attr('r', dotSize);


        svg.selectAll('.line')
            .transition()
            .attr('x1', function(d) {
                return (width / 2) + circleRadius * Math.cos(getAngle(d[0]));
            })
            .attr('y1', function(d) {
                return (height / 2) + circleRadius * Math.sin(getAngle(d[0]));
            })
            .attr('x2', function(d) {
                return (width / 2) + circleRadius * Math.cos(getAngle(d[1]));
            })
            .attr('y2', function(d) {
                return (height / 2) + circleRadius * Math.sin(getAngle(d[1]));
            })

        svg.selectAll('image')
            .attr('x', function(i) {
                return (width / 2) + circleRadius * Math.cos(getAngle(i)) - imageSize / 2;
            })
            .attr('y', function(i) {
                return (height / 2) + circleRadius * Math.sin(getAngle(i)) - imageSize / 2;
            })
    }, 200);


}



Viz.prototype.destroy = function() {
    // destroy d3 object
};

inherits(Viz, EventEmitter);

module.exports = Viz;
