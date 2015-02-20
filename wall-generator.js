(function ($) {
    'use strict';

    /** Use curly braces {{ }} for lodash tempaltes */
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };

    faker.locale = 'de';

    /** Defaults */
    var elementsAmount = zub.elementsAmount || 80,
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
                patternName     = pattern.replace(/\//g,'').replace(/\./g,''),
                backgroundColor = _.sample(theme.colors),
                patternColor    = _.sample(_.without(theme.colors, backgroundColor)),
                title           = _.sample(theme.titles) || faker.company.catchPhrase();
                console.log(_.sample(theme.titles));
            _.remove(theme.titles, title);

            output += template({
                hasImage: !!(Math.random() > 0.33), // results in a ~50/50 boolean
                title: title,
                image: image,
                pattern: pattern,
                patternName: patternName,
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
                    html = html.replace(/#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?\b/g, svgColor);
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
     * Get theme by name
     * @param {string} themeName – Name of the theme.
     * @returns {object} – Returns theme.
     */
    function getTheme (themeName) {
        return $.extend(
                    {},
                    zub.wallThemes['default'],
                    zub.wallThemes[themeName]
                );
    }

    /**
     * Ready Event / Setup
     */
    $(document).ready(function () {

        var $template = $('#poster-template'),
            templateStr = $template.html() || 'No Template found!',
            template = _.template(templateStr),
            $wall = $('[data-js-wall]');

        /** Set theme from hash if available */
        var hash = window.location.hash.replace('#', '');
        if (hash && zub.wallThemes[hash]) {
            currentTheme = getTheme(hash);
        }

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
                window.location.hash = themeName;
                currentTheme = getTheme(themeName);
                initWall($wall, template, currentTheme, elementsAmount);
            }
        });

    });


}(jQuery))