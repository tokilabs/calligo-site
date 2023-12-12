var sidebar = (function() {
    var init = function init() {
		cl('[sidebar] initializing...');

		// if($('.desktop').css('display') === 'inline-block' || $('.desktop').css('display') === 'flex') {
		// 	$('.sidebar_mod[sidebar-type="mobile"]').remove();

		// 	$('.sidebar__navigation .control').off().on('click', function(){
		// 		$('.sidebar__navigation').toggleClass('collapsed');
		// 	});
			
		// 	$('.sidebar__navigation .sidebar__menu a').on('click', function(){
		// 		$('.sidebar__navigation .sidebar__menu li').removeClass(`active`);
		// 		$(this).closest('li').addClass('active');
		// 	});
		// } else {
		// 	$('.sidebar_mod[sidebar-type="desktop"]').remove();

			
		// }

		$('.sidebar_mod-container .control').off().on('click', function() {
			$('.sidebar_mod').toggleClass('collapsed');
		});

		$('.sidebar__navigation .control').off().on('click', function(){
			$('.sidebar__navigation').toggleClass('collapsed');
		});
		
		$('.sidebar__navigation .sidebar__menu a').on('click', function(){
			$('.sidebar__navigation .sidebar__menu li').removeClass(`active`);
			$(this).closest('li').addClass('active');
		});

		

		cl('[sidebar] initiated');
    };

    return {
        init: init
    }
}());