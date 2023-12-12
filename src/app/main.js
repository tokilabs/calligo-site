if (!console) console = { log: function() {} };
var debug = true;

if (window.location.hostname != "localhost") {
  debug = false;
}

var cl = function cl(msg) {
  if (debug) {
    console.log(msg);
  }
};

if (!debug) {
  console = { log: function() {} };
}

var app = (function($) {

  var init = function init($) {
    cl('Application initializing...');
    var errors = 0;
    // var scroll = new SmoothScroll('a[href*="#"]');

    setTimeout(function() {
      $(window).scroll();
    }, 100);

    $('.form-control, .form-select').on('blur', function(){
      if($(this).val().length > 0){
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });

    $('.component').each(function() {
      var componentName = $(this).attr('cp-name');
      var check = typeof window[componentName];
      if (check != "undefined" && window[componentName].init) {
        window[componentName].init();
      } else {
        if (typeof componentName != "undefined") {
          cl('+++[ERROR]+++ Unable to load component [' + componentName + '], function was not found or missing init().');
        } else {
          cl('+++[ERROR]+++ Component missing "cp-name" parameter.');
          console.log($(this));
        }
        errors++;
      }
    });   

    if (errors > 0) {
      cl('Application was initiaded but ' + errors + ' component(s) did not load.');
    } else {
      cl('All application components initiated.');
    }
    
    $(".loader").addClass('loaded');
  };

  //write new functions here

  return {
    init: init
  }
})();

jQuery(document).ready(function($) {
  app.init($);
});