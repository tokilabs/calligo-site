var sliders = (function(){
	var loaded = false;

	var init = function init(){
		cl('[sliders] initializing...');
		
		$('.intro-slider').slick({
			dots: true,
			arrows: false,
			infinite: true,
			fade: true,
			cssEase: 'linear',
			autoplay: true,
			autoplaySpeed: 4000,
			pauseOnHover: false,
			adaptiveHeight: true
		});

		cl('[sliders] initiated.');
	};

	return {
		init: init
	}
})();