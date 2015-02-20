(function ($) {
    'use strict';

    var styles = {
        'none': {
            modifierClass: 'wall--none'
        },
        'default': {
            element: '.wall',
            modifierClass: 'wall--default'
        },
        'invert': {
            modifierClass: 'wall--style-invert'
        },
        'invert-offset': {
            modifierClass: 'wall--style-invert-offset'
        },
        'nora': {
            modifierClass: 'wall--style-nora'
        }
    };

    function setStyle (styleName) {
        var style = $.extend({}, styles['default'], styles[styleName]),
            $el = $(style.element);
        console.log(style, $el);
        $el.attr('class', 'wall '+style.modifierClass);
    }

    $(document).ready(function () {
        $('[data-js-style-nav]').each(function () {
            var $this = $(this);

            var output = '<div>';

            _.forEach(styles, function (style, name) {
                $this
                    .append('<button type="button" class="style-nav__button pure-button" data-js-wall-style="'+name+'">'+name+'</button>');
            });

            /** Bind theme navigation */
            $('[data-js-wall-style]').click(function (e) {
                var styleName = $(this).attr('data-js-wall-style');
                if (styleName && styles[styleName]) {
                    setStyle(styleName);
                }
            });
        });
    });

}(jQuery));