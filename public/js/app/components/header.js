var header = (function(){
	var loaded = false;

	var init = function init(){
		cl('[header] initializing...');

		if($("#home").length){
			$(window).on("scroll", function(){
				if(window.scrollY > 100) {
					$('#navbar').addClass('bg-primary');
					$('#navbar .logo').removeClass('primary');
					$('#navbar .nav-link').removeClass('text-dark').addClass('text-white');
					$('#navbar .justify-content-end > .btn-outline-primary').removeClass('btn-outline-primary').addClass('btn-outline-light');
					$('#navbar .justify-content-end > .btn-primary').removeClass('btn-primary').addClass('btn-light');
					$('#navbar .header-icon').addClass('text-white');
				} else {
					$('#navbar').removeClass('bg-primary');
					$('#navbar .logo').addClass('primary');
					$('#navbar .nav-link').addClass('text-dark').removeClass('text-white');
					$('#navbar .justify-content-end > .btn-outline-light').removeClass('btn-outline-light').addClass('btn-outline-primary');
					$('#navbar .justify-content-end > .btn-light').removeClass('btn-light').addClass('btn-primary');
					$('#navbar .header-icon').removeClass('text-white');
				}
			});
		} else {
			$('#navbar').addClass('bg-primary');
			$('#navbar .logo').removeClass('primary');
			$('#navbar .nav-link').removeClass('text-dark').addClass('text-white');
			$('#navbar .justify-content-end > .btn-outline-primary').removeClass('btn-outline-primary').addClass('btn-outline-light');
			$('#navbar .justify-content-end > .btn-primary').removeClass('btn-primary').addClass('btn-light');			
			$('#navbar .header-icon').addClass('text-white');
		}

		$('.flyoutMenu').on('click', function(e){
			e.stopPropagation();
		});

		$('.hasFlyoutMenu').on('click', function(e){
			e.stopPropagation();
			if($(this).hasClass('open')){
				$(this).toggleClass('open');
			} else {
				$('.hasFlyoutMenu').removeClass('open');
				$(this).addClass('open');
			}
		});

		$('#markAllAsRead').on('click', function(){
			cl("Marking all notifications as read...");

			$('.notification').removeClass('notRead');

			cl("Marked all notifications as read!");
		});

		$('body').on('click', function(){
			$('.hasFlyoutMenu').removeClass('open');
		});

		$('#btnResendEmail').on('click', function(){
			var mail = $(this).attr('data-email');
			$.getJSON(_BASE_URL_+'users/resendmail?email='+mail+'', function(response){
				console.log(response);
			});
		});

		$('#menu_mobile').on('click', function(){
			$('#menu_mobile_container').addClass('active');
		});

		$('.close-menu-button').on('click', function(){
			$('#menu_mobile_container').removeClass('active');
		});

		
		cl('[header] initiated.');
	};

	return {
		init: init
	}
})();