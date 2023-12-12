var payment = (function(){
	var loaded = false;

	var init = function init(){
		cl('[payment] initializing...');

		$('.btn_appointmentPay').on('click', function(e){
			e.preventDefault();
			var form = $('#form_identifier > form');
			var formData = new FormData();
			var card = $('.form-check-input[name=card]:checked').val();

			if(card != '') {
				$('#card_number').attr('disabled', true);
				$('#card_first-name').attr('disabled', true);
				$('#card_last-name').attr('disabled', true);
				$('#card_month-val').attr('disabled', true);
				$('#card_year-val').attr('disabled', true);
				$('#card_verify').attr('disabled', true);

				$('#address').attr('disabled', true);
				$('#address-number').attr('disabled', true);
				$('#neighborhood').attr('disabled', true);
				$('#complement').attr('disabled', true);
				$('#zip-code').attr('disabled', true);
				$('#state-id').attr('disabled', true);
				$('#city-id').attr('disabled', true);
				$('#phone').attr('disabled', true);
				$('#emergency-phone').attr('disabled', true);

				$(form).submit();
			}
		});

		cl('[payment] initiated.');
	};


	return {
		init: init
	}
})();
