var tables = (function(){
	var loaded = false;

	var init = function init(){
		cl('[tables] initializing...');


		$('.customDataTable').each(function(){
			$(this).DataTable( {
		        scrollX:        true,
		        scrollCollapse: false,
		        paging:         true,
		        order: [[ 0, "desc" ]]
	    	} );
		});

		
		cl('[tables] initiated.');
	};

	return {
		init: init
	}
})();