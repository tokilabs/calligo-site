var searchPage = (function(){
	var loaded = false;

	var init = function init(){
		cl('[searchPage] initializing...');

		$('.btn_filter').on('click', function(e){
			e.preventDefault();
			$('.filter_container').slideToggle();
			$('#homeSearch').toggleClass('filter_active');
		});

		$('.form-select').select2({
			'language': {
		       	'noResults': function(){
		           return "Nenhum resultado encontrado.";
		       	}
		   	},
		});

		
		cl('[searchPage] initiated.');
	};

	return {
		init: init
	}
})();