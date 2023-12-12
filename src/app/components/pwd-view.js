var pwdView = (function(){
	var loaded = false;

	var init = function init(){
		cl('[pwd-view] initializing...');
		
		$('.pwd-wrapper .material-icons-outlined').on('click', function(){
			$(this).parent('.pwd-wrapper').toggleClass('showpwd');

			if($(this).parent('.pwd-wrapper').hasClass('showpwd')){
				$(this).parent('.pwd-wrapper').find('input').attr('type','text');
			} else {
				$(this).parent('.pwd-wrapper').find('input').attr('type','password');
			}
		});

		cl('[pwd-view] initiated.');
	};


	return {
		init: init
	}
})();