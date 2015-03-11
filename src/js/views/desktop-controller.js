'use strict';

var _ = require('lodash');
var utils = require('../utils');
var Viz = require('../viz/viz');

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
    new Viz(this.$el.find('.svg-container'));


}



DesktopViewController.prototype.destroy = function() {
    this.$el.find('*').unbind().html();
};

module.exports = DesktopViewController;
