(function ($) {
    'use strict';

    /** Use curly braces {{ }} for lodash tempaltes */
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };


    /** Defaults */
    var elementsAmount = 80,
        currentTheme = $.extend({}, zub.wallThemes['default']);

    /**
     * Generates a random wall of images and patterns.
     * @param {dom-element} el – Wall element to "wallify".
     * @param {function} template – A template function.
     * @param {object} theme – A theme object to generate elements from.
     * @param {integer} [elementsAmount] – Number of elements to render.
     */
    function initWall (el, template, theme, elementsAmount) {
        var output = '<div>';

        for (var i = 0; i < (elementsAmount||40); i++) {
            var image           = _.sample(theme.images),
                pattern         = _.sample(theme.patterns),
                backgroundColor = _.sample(theme.colors),
                patternColor    = _.sample(_.without(theme.colors, backgroundColor));

            output += template({
                hasImage: !!Math.round(Math.random()), // results in a ~50/50 boolean
                image: image,
                pattern: pattern,
                bgColor: backgroundColor,
                patternColor: patternColor
            });
        }

        output += '</div>'
        $(el).empty().append(output);

        replaceSVGs();
    }


    /**
     * Replace all SVG images with inline SVG
     */
    function replaceSVGs () {
        $('img[src$=".svg"]').each(function(){
            var $img = $(this),
                imgID = $img.attr('id'),
                imgStyle = $img.attr('style'),
                imgClass = $img.attr('class'),
                imgURL = $img.attr('src'),
                svgColor = $img.attr('data-js-svg-fill'),
                html;

            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                $svg = $svg.attr('style', imgStyle);

                /**
                 * Replace all colors (black) inside the svg
                 */
                if (svgColor) {
                    html = $svg[0].innerHTML;
                    html = html.replace(/#000000/g, svgColor);
                    $svg.html(html);
                }


                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');
        });
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
        initWall($wall, template, currentTheme, elementsAmount);

        /** Generate theme navigation */
        _.forEach(zub.wallThemes, function (theme, name) {
            $('[data-js-theme-nav]')
                .append('<button type="button" class="theme-nav__button pure-button" data-js-wall-theme="'+name+'">'+name+'</button>');
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
                initWall($wall, template, currentTheme, elementsAmount);
            }
        });

    });


}(jQuery))