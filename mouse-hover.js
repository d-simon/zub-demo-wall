  (function ($) {

    /**
     * Mouse Hover Effect
     */

    var defaultRadius = 15,
        responsiveRadius = [[768, defaultRadius/1.625], [480, defaultRadius/2.82]],
        radius = defaultRadius,
        ticking = false,
        hasResized = true,
        lastPos =  { x: 0, y: 0 },
        center = { x: 0, y: 0 },
        dimensions = { x: 0, y: 0 },
        $posters,
        $spans,
        $hoverRegion;

    $(document).on('ready posters:new', function () {

        $hoverRegion = $(document);
        $posters = $hoverRegion.find('.poster');
        $spans = $posters.find('.poster__span');

        /**
         * Callback for our scroll event - just
         * keeps track of the last scroll value
         */
        function onMove (event) {
            lastPos.x = event.pageX || lastPos.x;
            lastPos.y = event.pageY || lastPos.y;
            requestTick();
        }

        /**
         * Calls rAF if it's not already
         * been done already
         */
        function requestTick () {
            if(!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }


        /**
         * Our animation callback
         */
        function update () {

            if (hasResized === true) {
                // updateValues();
                hasResized = false;
            }


            $spans.each(function () {
                var transform = { x: 0, y: 0},
                    $this = $(this);

                transform.x = $this.offset().left;
                transform.y = $this.offset().top;

                transform.x -= lastPos.x;
                transform.y -= lastPos.y;

                var distance = Math.sqrt((transform.x * transform.x) + (transform.y * transform.y));
                // console.log(transform, distance);

                var opacity = Math.min(distance, 1000);
                $this.css({
                    'background': 'rgba(0,0,0,'+(1000-opacity)/1000+')'
                });
            });

            // allow further rAFs to be called
            ticking = false;
        }

        // listen for mousemove
        $hoverRegion.mousemove(onMove);
        $hoverRegion.trigger('mousemove');

        // listen for resize
        $(window).resize(function () {
            hasResized = true;
            $hoverRegion.mousemove();
        });
    });

}(jQuery));