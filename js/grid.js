(function($) {
    var $grid = $("<div>"),
        $content = $('#siteTable'),
        $entries = $content.find('.thing'),
        template = _.template("<article class='element'><header><%= title %></header><%= thumbnail %></article>"),
        pendingImages = 0;

    console.log("Loading images");

    $entries.each(function(i, e) {
        var $entry = $(e), 
            $title = $entry.find('p.title > a.title'),
            $thumbnail = $entry.find('a.thumbnail'),
            $item;

        // always open links in new tab
        $entry.find('a').attr('target', '_blank');

        // load full-sized image, if the target is an image
        if($thumbnail.attr('href') && $thumbnail.attr('href').match(/.jpg$|.jpeg$|.png$|.gif|imgur.com$/)) {
            $thumbnail.find('img').addClass('loading').attr('src', $thumbnail.attr('href')).attr('height', 'auto').attr('width', 'auto');
            pendingImages += 1; // we need to keep track of images that are loading
        }

        $item = template({ 
            'title': $title[0].outerHTML,
            'thumbnail': $thumbnail[0].outerHTML
        });
        $grid.append($item);
    });

    // hide promoted link
    $('#siteTable_organic, .side').hide();

    // replace content with our grid
    $content.html($grid.html()).addClass('grid clearfix');
    $('.element img').on('load', function() {
        if($(this).width() && $(this).hasClass('loading')) {
            $(this).removeClass('loading');
            pendingImages -= 1; // note that the images has finished loading
            //console.log("Pending images: ", pendingImages, $(".element img.loading").parents('.element'));
            if(pendingImages <= 0) {
                console.log("All images loaded!");
                $content.isotope();
            }
        } 
    });

    $content.on('resize', function() {
        console.log("Element resized");
    });

    setTimeout(function() {
        if(!$content.hasClass('.isotope')) {
            console.log("Timed out!");
            //$content.isotope();
        }
    }, 1500);

    $content.isotope();

})(jQuery, undefined);