var cards = (function(){
	var loaded = false;

	var init = function init(){
		cl('[cards] initializing...');

		$('.add_card_page').on('click', function(){
			$('#add_card_page_modal').modal('show');
		});

		$('.btn_addCard').off('click').on('click', function(e){
			if($('#cardsIndex > form').length > 0) {
				$('#cardsIndex > form').submit(function(e) {
					e.preventDefault();
					let form = $(this);
					let actionUrl = form.attr('action');
					console.log(actionUrl);

					$.ajax({
						type: "POST",
						url: actionUrl,
						data: form.serialize(),
						success: function(data)
						{
							location.reload()
						}
					});
				});
			} else {
				$('#form_identifier > form').submit();
			}
		});

		cl('[cards] initiated.');
	};


	return {
		init: init
	}
})();
