var comments = (function(){
	var loaded = false;

	var init = function init(){
		cl('[comments] initializing...');

		$('.comments-slider').slick({
			infinite: false,
			slidesToShow: 3,
			arrows: false,
			dots: true
		});
		
		cl('[comments] initiated.');
	};

	return {
		init: init
	}
})();