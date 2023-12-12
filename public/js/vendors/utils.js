//Check if element is visible on screen
function checkVisible(elm, threshold, mode) {
  threshold = threshold || 0;
  mode = mode || 'visible';

  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  var above = rect.bottom - threshold < 0;
  var below = rect.top - viewHeight + threshold >= 0;

  return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function monitorView(elm, callbackIn, callbackOut) {
	var element = elm[0];
	var observer = new IntersectionObserver(function(entries) {
		// isIntersecting is true when element and viewport are overlapping
		// isIntersecting is false when element and viewport don't overlap
		if(entries[0].isIntersecting === true) {
			// console.log('Element has just become visible in screen'); 
			callbackIn();
		}
		else {
			// console.log("Element has left the view");
			callbackOut();
		}
	}, { threshold: [0, 1] });

	observer.observe(element);
}

var apiCall = function apiCall(state){
  //state = start or end
  if(state === 'start'){
    $('html').addClass('apiLoading');
  } else {
    $('html').removeClass('apiLoading');
  }
};

window.addEventListener('load', function() {

    /**
     * Adds a class `_submit-attempted` to a form when it's attempted to be
     * submitted.
     *
     * This allows us to style invalid form fields differently for forms that
     * have and haven't been attemted to submit.
     */
    function addFormSubmitAttemptedTriggers() {

        var formEls = document.querySelectorAll('form');

        for (var i = 0; i < formEls.length; i++) {

            function addSubmitAttemptedTrigger(formEl) {

                var submitButtonEl = formEl.querySelector('input[type=submit]');

                if (submitButtonEl) {
                    submitButtonEl.addEventListener('click', function() {
                        formEl.classList.add('_submit-attempted');
                    });
                }

            }

            addSubmitAttemptedTrigger(formEls[i]);

        }

    }

    addFormSubmitAttemptedTriggers();
});