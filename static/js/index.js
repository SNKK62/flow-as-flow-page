window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Toggle navbar on mobile
    $(".navbar-burger").click(function() {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });

    // --- Dark / light mode toggle ---
    const checkbox = document.getElementById('theme-checkbox');

    function updateSwitch() {
      checkbox.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    }

    updateSwitch();

    checkbox.addEventListener('change', function() {
      const next = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Follow system preference when no manual choice is stored
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateSwitch();
      }
    });
});
