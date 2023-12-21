var login = (function(){
	var loaded = false;

	var init = function init(){
		cl('[login] initializing...');
		
		$('.pwd-wrapper .material-icons-outlined').on('click', function(){
			$(this).parent('.pwd-wrapper').toggleClass('showpwd');

			if($(this).parent('.pwd-wrapper').hasClass('showpwd')){
				$(this).parent('.pwd-wrapper').find('input').attr('type','text');
			} else {
				$(this).parent('.pwd-wrapper').find('input').attr('type','password');
			}
		});

		$('.login-slider .slider').slick({
			arrows: false,
			dots: true,
			slidesToShow: 1,
			adaptativeHeight: false,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 3000,
			fade: true
		});	

		$('#btnForgot').on('click', function(){
			$('#resetPwdUsername').removeClass('error');
			$('#forgotPwd .error-message').hide();
			$('#loginForm').fadeOut('fast', function(){
				$('#forgotPwd').fadeIn();
			});
		});

		$('#btnResetPassword').on('click', function(e){
			e.preventDefault();
			$('#resetPwdUsername').removeClass('error');
			$('#forgotPwd .error-message').hide();
			var email = $('#resetPwdUsername').val();
			if(validateEmail(email)){
				$('#resendUsername').val(email);
				apiCall('start');
				$.ajax({
					method: 'GET',
					url:'/users/forgotpassword?email='+email,
					success: function (data) {
						console.log('success');
						console.log(data);
						$('#forgotPwd').fadeOut('fast', function(){
							$('#pwdSent').fadeIn();
						});
						apiCall('end');
					},
					error: function (data) {
						$('#resetPwdUsername').addClass('error');
						$('#forgotPwd .error-message').show().text('E-mail não encontrado.');
						apiCall('end');
					}
				});							
			} else {
				$('#resetPwdUsername').addClass('error');
				$('#forgotPwd .error-message').show().text('E-mail inválido.');			
			}
		});		

		$('#btnResendPassword').on('click', function(e){
			e.preventDefault();
			var email = $('#resetPwdUsername');
			$('#resetPwdUsername').removeClass('error');
			$('#forgotPwd .error-message').hide();
			$('#resendUsername').val(email);
			$('#pwdSent').fadeOut('fast', function(){
				$('#pwdSent').fadeIn();
			});
		});	

		$('#btnStart').on('click', function(e){
			e.preventDefault();
			$('#resetPwdUsername').removeClass('error');
			$('#forgotPwd .error-message').hide();
			$('#login input').val('');
			$('.pwd-wrapper input').attr('type','password');
			$('.pwd-wrapper').removeClass('showpwd');
			$('#pwdSent').fadeOut('fast', function(){
				$('#loginForm').fadeIn();
			});			
		});

		formMasks.init();

		cl('[login] initiated.');
	};


	return {
		init: init
	}
})();