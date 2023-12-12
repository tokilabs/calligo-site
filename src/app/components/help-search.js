var helpSearch = (function(){
	var loaded = false;

	var init = function init(){
		cl('[helpSearch] initializing...');

		if($('.desktop').css('display') === 'none') {
			var count = $('.accordion_categories').length;
			var size = count * 200;
			var sizeVW = size * 100 / 320;

			$('.row_mobile-width').css('width', ''+sizeVW+'vw')
		}

		$('.accordion_categories').on('click', function(){
			var thisCategory = $(this).attr('data-category');
			$('.accordion_categories.active').removeClass('active');
			$('.accordion_list').show();
			$(this).addClass('active');

			$('.help_accordion_category.active').removeClass('active');
			$('.help_accordion_category[data-category="'+thisCategory+'"]').addClass('active');
		});

		$('#help_search-input').keypress(function(event){
			if(event.keyCode == 13){
				$('#help_search-trggr').click();
			}
		});

		$('#help_search-trggr').on('click', function(){
			var searched = $('#help_search-input').val();
			$('.help_accordion_category').removeClass('active');
			$('.accordion_list').each(function(ind, val){
				var buttonText = $(this).find('.accordion-button').text();
				var contentText = $(this).find('.accordion-body').text();

				if(buttonText.toLowerCase().search(searched.toLowerCase()) != -1) {
					$(this).show();
					$(this).parent('.help_accordion_category').addClass('active');
				} else if(contentText.toLowerCase().search(searched.toLowerCase()) != -1) {
					$(this).show();
					$(this).parent('.help_accordion_category').addClass('active');
				} else {
					$(this).hide();
				}
			})
		});
		
		cl('[helpSearch] initiated.');
	};

	return {
		init: init
	}
})();