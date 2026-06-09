window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Toggle navbar on mobile
    $(".navbar-burger").click(function() {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });
})
