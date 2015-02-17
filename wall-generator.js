(function ($) {
    'use strict';

    /** Use curly braces {{ }} for lodash tempaltes */
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };


    var elementsAmount = 200;


    /**
     * Generates a random wall of images and patterns.
     * @param {dom-element} Wall element to "wallify".
     * @param {function} A template function.
     */
    function initWall (el, template) {
        var output = '<div>';

        for (var i = 0; i < elementsAmount; i++) {
            output += template();
        }

        output += '</div>'
        $(el).append(output);
    }


    $(document).ready(function () {
        var $template = $('#poster-template'),
            templateStr = $template.html() || 'No Template found!',
            template = _.template(templateStr);

        $('[data-js-wall]').each(function (index, el) {
            initWall(el, template);
        });

    });


}(jQuery))