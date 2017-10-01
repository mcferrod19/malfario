/**
 * Functions.
 */

(function($) {

  'use strict';
  $(document).ready(function() {
    $('.single-item').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true
    });
  });

})(jQuery);
