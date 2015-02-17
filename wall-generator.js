(function ($) {
    'use strict';

    /** Use curly braces {{ }} for lodash tempaltes */
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };


    /** Defaults */
    var elementsAmount = 200,
        currentTheme = zub.wallThemes['default'];

    /**
     * Generates a random wall of images and patterns.
     * @param {dom-element} Wall element to "wallify".
     * @param {function} A template function.
     */
    function initWall (el, template, theme) {
        var output = '<div>';

        for (var i = 0; i < elementsAmount; i++) {
            output += template(theme);
        }

        output += '</div>'
        $(el).empty().append(output);
    }

    /**
     * Ready Event / Setup
     */
    $(document).ready(function () {

        var $template = $('#poster-template'),
            templateStr = $template.html() || 'No Template found!',
            template = _.template(templateStr),
            $wall = $('[data-js-wall]');

        /** Generate inital wall */
        initWall($wall, template, currentTheme);

        /** Generate theme navigation */
        _.forEach(zub.wallThemes, function (theme, name) {
            $('[data-js-theme-nav]')
                .append('<button type="button" class="theme-nav-button" data-js-wall-theme="'+name+'">'+name+'</button>');
        });

        /** Bind theme navigation */
        $('[data-js-wall-theme]').click(function (e) {
            var themeName = $(this).attr('data-js-wall-theme');
            if (themeName && zub.wallThemes[themeName]) {
                currentTheme = zub.wallThemes[themeName];
                initWall($wall, template, currentTheme);
            }
        });

    });


}(jQuery))