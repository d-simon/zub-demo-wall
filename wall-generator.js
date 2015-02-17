(function ($) {
    'use strict';

    /** Use curly braces {{ }} for lodash tempaltes */
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };


    /** Defaults */
    var elementsAmount = 200,
        currentTheme = $.extend({}, zub.wallThemes['default']);

    /**
     * Generates a random wall of images and patterns.
     * @param {dom-element} el – Wall element to "wallify".
     * @param {function} template – A template function.
     * @param {function} theme – A theme object to generate elements from.
     */
    function initWall (el, template, theme) {
        var output = '<div>';

        for (var i = 0; i < elementsAmount; i++) {
            var image           = _.sample(theme.images),
                backgroundColor = _.sample(theme.colors),
                patternColor    = _.sample(_.without(theme.colors, backgroundColor));

            console.log(image, backgroundColor, patternColor);

            output += template({
                hasImage: !!Math.round(Math.random()), // results in a ~50/50 boolean
                image: image,
                bgColor: backgroundColor,
                patternColor: patternColor
            });
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
                currentTheme = $.extend(
                                        {},
                                        zub.wallThemes['default'],
                                        zub.wallThemes[themeName]
                                );
                initWall($wall, template, currentTheme);
            }
        });

    });


}(jQuery))