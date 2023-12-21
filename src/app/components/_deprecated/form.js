var form = (function() {
    var init = function init() {
		cl('[form] initializing...');

		$('input, select').trigger('blur');

		$('.form-select.select2').select2({
			'language': {
		       	'noResults': function(){
		           return "Nenhum resultado encontrado.";
		       	}
		   	},
		});

		if($(".img-upload-container").length > 0){
			$('#cropModal').on('shown.bs.modal', function(){ 
				$('#imgToCrop').croppie({
					enableExif: true,
					viewport: {
						width: 300,
						height: 300,
						type: 'circle'
					},
					boundary: {
						width: 300,
						height: 350
					}
				});				
			});	

			$('#cropModal').on('hidden.bs.modal', function(){ 
				$('#imgToCrop').croppie('destroy');				
			});	

			
			$('#selectCrop').on('click', function(){
				$('#imgToCrop').croppie('result', {
					type: 'base64',
					size: 'viewport'
				}).then(function (resp) {
					$('#imgbase64').val(resp);
					$('.imgPreview').attr('src', resp).css('opacity', 1);
					$('#cropModal').modal('hide');
				});
			});

			$('#cancelCrop').on('click', function(){
				// Em caso da gente precisar de algo especial para esse evento.
			});

			$(".img-upload-container .img-input").off().on('change', function(e){
				if(e.target.files.length > 0){
					var el = $('#imgToCrop')[0];
					var reader = new FileReader();
					reader.onload = function()
					{
					  el.src = reader.result;
					  $('#cropModal').modal('show');
					}
					reader.readAsDataURL(e.target.files[0]);
				}
			});
		};


		cl('[form] initiated');
    };

    // [POST] para /settings/change_notification  o data recebe dois campos: field: 'email_update_terms', value: 0

    var toggleEdit = function toggleEdit(status){
        if(!status){
            $('.form-field').prop('disabled', true); 
            $('.btn-save').toggleClass('d-none'); 
            $('.btn-edit').toggleClass('d-none');
        } else {
            $('.form-field').prop('disabled', false).trigger('blur');
            $('.btn-save').toggleClass('d-none'); 
            $('.btn-edit').toggleClass('d-none');
        }
    }    

    return {
        init: init,
        toggleEdit: toggleEdit
    }
}());

var setNotifications = (function() {
    var init = function init() {
		cl('[setNotifications] initializing...');

		var cp = $('[cp-name="setNotifications"]').eq(0);
		var inputs = cp.find('input[type="checkbox"]');

		inputs.off('click').on('click', function(e){
			var formData = new FormData();
			formData.append('field', $(this).attr('name'));
			formData.append('value', ($(this).is(":checked") ? 1 : 0));
			fetch('/settings/notifications/change_notification', {
			  method: 'POST',
			  body: formData
			})

		});

    };

    // [POST] para /settings/change_notification  o data recebe dois campos: field: 'email_update_terms', value: 0

    return {
        init: init
    }
}());