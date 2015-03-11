'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3');


var getAngle = function(i) {
    return (((i+7)%14) * Math.PI * 2) / 14;
};


/*
 * View controller
 */
function Viz($el) {
    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    this.$el = $el;

    var width = $(document).width();
    var height = $(document).height();

    // do some cool vizualization here

    var svg = d3.select($el[0])
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    
    var circleRadius = 0.8 * Math.min(width, height) / 2;


    $('.desktop .announcement').css({width: 0.5 * Math.min(width, height) + 'px'});

    var firstTransitionSpeed = 75;
    var secondTransitionSpeed = 100;
    var firstDuration = 500;
    var secondDuration = 1000;

    var dotSize = circleRadius / 25;
    
    var pairs = [];
    var shuffled = _.shuffle(_.range(14));
    _.each(_.range(14), function(i) {
        if(i % 2 === 0) {
            pairs.push([shuffled[i], shuffled[i+1]]);
        }
    });

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
        .style('stroke-width', 3)
        .transition()
        .duration(function(d, i) {
            return 300 + Math.random() * i * 200;
        })
        .delay(function(d, i) {
            return (firstDuration + (14 * firstTransitionSpeed)) + (i%7) * secondTransitionSpeed;
        })
        .attr('x2', function(d) {
            console.log(d[1]);
            return (width / 2) + circleRadius * Math.cos(getAngle(d[1]));
        })
        .attr('y2', function(d) {
            console.log(d);
            return (height / 2) + circleRadius * Math.sin(getAngle(d[1]));
        });

    var circles = svg.selectAll('.dot')
        .data(_.range(14))
        .enter()
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

        width = $(document).width();
        height = $(document).height();
        circleRadius = 0.8 * Math.min(width, height) / 2;
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
    }, 200);


}



Viz.prototype.destroy = function() {
    // destroy d3 object
};

module.exports = Viz;
