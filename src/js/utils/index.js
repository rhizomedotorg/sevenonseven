'use strict';
var _ = require('lodash');
var moment = require('moment');
var start = moment("20150502 12:00", "YYYYMMDD h:mm");

module.exports = {



    sortByKey: function(list, key) {
        return _.sortBy(list, key);
    },

    getRandomArbitrary: function(min, max) {
        var val = Math.random() * (max - min) + min;
        return val;
    },

    getDaysAway: function() {
        var val = start.diff(moment(), 'days');
        return (val === 1) ? val + ' day ' : val + ' days ';
    },

    getHoursAway: function() {
        var val = start.diff(moment(), 'hours') - start.diff(moment(), 'days') * 24;
        return (val === 1) ? val + ' hr ' : val + ' hrs ';
    },

    getMinutesAway: function() {
        var val = 1 + start.diff(moment(), 'minutes') - start.diff(moment(), 'hours') * 60;
        return (val === 1) ? val + ' min ' : val + ' mins ';
    },

    getSecondsAway: function() {
        var val = start.diff(moment(), 'seconds') - start.diff(moment(), 'minutes') * 60;
        return (val === 1) ? val + ' sec ' : val + ' secs ';
    },

    preloadImage: function(url){
        var img=new Image();
        img.src=url;
    },
    
    groupArrayByN: function(arr, n) {

        return _.reduce(arr, function (prev, item, i) {

            if(i % n === 0) {
              prev.push([item]);
            } else {
              prev[prev.length - 1].push(item);
            }

            return prev;

        }, []);

    }


};
