var clients = (function(){
	var loaded = false;

	var init = function init(){
		cl('[clients] initializing...');
        
        $(document).on('click','a.modal-start',function(e){
            e.preventDefault();
            var id = $(this).attr('href');
            $(id).modal('show');
			if ($(this).data('edit')>0) {
				$(id).addClass('edit');
				$(id).data('editId',$(this).data('edit'));
				if (id="#newRegisterModal") {
					$('[name="record_name"]').val($(this).data('name'));
					$('[name="record_description"]').val($(this).data('description'));
					$('[name="record_description"] + .note-editor').find('.note-editable').html($(this).data('description'));
					$('[name="record_description"] + .note-editor').find('.note-placeholder').hide();
					$('[name="record_private"]').val($(this).data('private')).change();
					$('[name="record_type_of_record_id"]').val($(this).data('type_of_record_id')).change();
				}
			}
        });

		$('.inputFilterSearch + a').on('click',function(e) {
			e.preventDefault();
			$('.inputFilterSearch').toggleClass('open');
		});

		$('form.filterSearch select').on('change',function(e) {
			$('form.filterSearch').submit();
		});

		$('.client .info .more').on('click',function() {
			$(this).toggleClass('d-none');
			$(this).parent().find('.info_oculta').toggleClass('d-none');
		});
		$('.client .info .less').on('click',function() {
			$(this).parent().toggleClass('d-none');
			$(this).parent().parent().find('.more').toggleClass('d-none');
		});

		$('#closeTherapyModal button[type="submit"]').on('click', function(e){
			e.preventDefault();
			$('#closeTherapyModal').modal('hide');
			confirmationModal('closeTherapy');
		});
		$('#reportPatientModal button[type="submit"]').on('click', function(e){
			e.preventDefault();
			$('#reportPatientModal').modal('hide');
			confirmationModal('reportPatient');
		});
		$('.documents.sidebar_client a.delete').on('click', function(e){
			e.preventDefault();
			confirmationModal('docs');
			$('#confirmationModal').data('deleteId',$(this).data('id'));
		});

		$('#confirm_delete:not(:disabled)').on('click', function(e){
			e.preventDefault();
			modalConfirmation($('#confirmationModal').data('confirmation'));
		});
		$('#confirm_cancel:not(:disabled)').on('click', function(e){
			e.preventDefault();
			const modal = $(this).attr('data-modal');
			$('#confirmationModal').modal('hide');
			$(`#${modal}`).modal('show');
		});

		function confirmationModal(c) {
			$('#confirmationModal').modal('show');
			$('#confirmationModal').data('confirmation',c);
			$('#confirmationModal [class^="confirm_"]').removeClass('d-inline');
			$('#confirmationModal .confirm_'+c).addClass('d-inline');
			$('#confirmationModal .confirm_name_'+c).text($('#'+c+'ModalName').text());
			$('#confirmationModal #confirm_cancel').attr('data-modal', c + 'Modal');
			$('#confirm_cancel,#confirm_delete').removeAttr('disabled');
		}

		function modalConfirmation(confirmation) {
			$('#confirm_delete').attr('disabled','');
			$('#confirm_cancel').attr('disabled','');
			switch (confirmation) {
				case 'closeTherapy':
					cl('form iniciado');
					var formUpload = new FormData($('#closeTherapyForm')[0]);
					var closing_description = $('[name="closing_description"]').val();
					var closing_id = $('#closing_id').val();
					var closing_profile = $('#closing_profile').val();
					var closing_patient_at_risk = 0;
					var endPointPath = closing_profile == 'patient' ? 'my' : 'clients';
					if($('#closing_patient_at_risk').is(':checked')) {
						closing_patient_at_risk = 1;
					}
					var closing_attachment = $('#closeTherapyForm [name="attachment"]').val();
					data = {
						'closing_description': closing_description,
						'closing_id': closing_id,
						'closing_patient_at_risk': closing_patient_at_risk,
						'closing_file_name' : '',
						'closing_file_url' : '',
						'closing_file_size' : ''
					}

					$('#closeTherapyForm .form_buttons').attr('disabled','');

					function requestCloseTherapy() {
						var url = `${_BASE_URL_}dashboard/${endPointPath}/set_end_therapy/${closing_id}`;
						$.ajax({
							method: "POST",
							url: url,
							data: data
						}).done(function( msg ) {
							cl(msg);
							if(msg === true) {
								if(msg === true) {
									cl('realizar ações');
									$('#confirmationModal').modal('hide');
									if($('#client').length) { // verifica se está no prontuário do cliente
										cl('realizar ação');
										location.reload();
									} else {
										$('[data-patient-id="'+closing_id+'"]').find('.next_therapy').html('<p class="mb-0 bold">Terapia encerrada</p>');
										$('[data-patient-id="'+closing_id+'"]').find('.contacts').html('');
									}
								}
							}
						});
					}

					var haveFile = false;
					
					if (closing_attachment!='') {
						haveFile = true;
						$.ajax({
							method: "POST",
							url: _BASE_URL_+'uploads/send/doc',
							data: formUpload,
							processData: false,
							contentType: false
						}).done(function( msg ) {
							data['closing_file_name'] = msg.media_name;
							data['closing_file_url'] = msg.media_key;
							data['closing_file_size'] = msg.size;
							requestCloseTherapy();
						});
					}

					if (!haveFile) {
						requestCloseTherapy();
					}
				break;
				case 'reportPatient':
					cl('form iniciado');
					var report_description = $('[name="report_description"]').val();
					var report_id = $('#report_id').val();
					var report_profile = $('#report_profile').val();
					var endPointPath = report_profile == 'patient' ? 'my' : 'clients';

					var data = {
						'description': report_description
					}

					var i = 0;
					var input;
					$('.reportCheckbox').each(function() {
						input = $(this).find('input');
						if(input.is(':checked')) {
							data['items['+i+']'] = input.val();
							i++;
						}
					});
					
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'dashboard/'+endPointPath+'/set_complaint/'+report_id,
						data: data
					}).done(function( msg ) {
						if(msg === true) {
							cl('realizar ações');
							$('#confirmationModal').modal('hide');
							if($('#client').length) { // verifica se está no prontuário do cliente
								cl('realizar ação');
								location.reload();
							} else {
								$('[data-patient-id="'+report_id+'"]').find('.next_therapy').html('<p class="mb-0 bold">Terapia reportada</p>');
								$('[data-patient-id="'+report_id+'"]').find('.contacts').html('');
							}
						}
					});
				break;
				case 'docs':
					cl('form iniciado');
					var doc_id = $('#confirmationModal').data('deleteId');

					$.getJSON(_BASE_URL_+'dashboard/docs/delete/'+doc_id, function(msg){
						if(msg === true) {
							$('#confirmationModal').modal('hide');
							$('.documents.sidebar_client a.delete[data-id='+doc_id+']').parent().hide();
						}
						cl(msg);
					});
				break;
			}
		}

		
		$('#newRegisterModal button[type="submit"]').on('click', function(e){
			e.preventDefault();
			cl('form iniciado');
			var formUpload = new FormData($('#newRegisterModal form')[0]);
			var record_name = $('[name="record_name"]').val();
			var record_description = $('[name="record_description"]').val();
			var record_private = $('[name="record_private"]').val();
			var record_type_of_record_id = $('[name="record_type_of_record_id"]').val();
			var record_patient_id = $('[name="record_patient_id"]').val();
			var record_attachment = $('#newRegisterModal [name="attachment"]').val();
			data = {
				'name': record_name,
				'description': record_description,
				'private': record_private,
				'type_of_record_id': record_type_of_record_id,
				'patient_id': record_patient_id
			}

			$('#newRegisterModal .form_buttons').attr('disabled','');

			function requestNewRegister() {
				var url = _BASE_URL_+'dashboard/records/add';

				if ($('#newRegisterModal').hasClass('edit')) {
					url = _BASE_URL_+'dashboard/records/edit/'+$('#newRegisterModal').data('editId');
				}
				$.ajax({
					method: "POST",
					url: url,
					data: data
				}).done(function( msg ) {
					cl(msg);
					if(msg === true) {
						location.reload();
					}
				});
			}

			var haveFile = false;
			
			if (record_attachment!='') {
				haveFile = true;
				$.ajax({
					method: "POST",
					url: _BASE_URL_+'uploads/send/doc',
					data: formUpload,
					processData: false,
					contentType: false
				}).done(function( msg ) {
					data['docs[0][name]'] = msg.media_name;
					data['docs[0][url]'] = msg.media_key;
					data['docs[0][size]'] = msg.size;
					requestNewRegister();
				});
			}

			if (!haveFile) {
				requestNewRegister();
			}			

			
		});

		$('#newNoteModal button[type="submit"]').on('click', function(e){
			e.preventDefault();
			cl('form iniciado');
			var note_description = $('[name="note_description"]').val();
			var note_patient_id = $('[name="note_patient_id"]').val();

			$('#newNoteModal .form_buttons').attr('disabled','');

			var url = _BASE_URL_+'dashboard/notes/add';

			// if ($('#newNoteModal').hasClass('edit')) {
			// 	url = _BASE_URL_+'dashboard/notes/edit/'+$('#newNoteModal').data('editId');
			// }
			// $('#newNoteModal').removeClass('edit');
			$.ajax({
				method: "POST",
				url: url,
				data: {
					'description': note_description,
					'patient_id': note_patient_id
				}
			}).done(function( msg ) {
				if(msg === true) {
					location.reload();
				}
			});
		});

		function clearModal(modal) {
			var campos = modal.find('input,textarea');
			campos.val('');
			var selects = modal.find('select');
			var val_select;
			selects.each(function(e) {
				val_select = $(this).find('option').eq(0).val();
				$(this).val(val_select);
			});
			var summernote = modal.find('[name="record_description"] + .note-editor');
			summernote.find('.note-editable').html('');
			summernote.find('.note-placeholder').show();			
		}

		$(document).on('click', '.clear_form[data-bs-target]', function() {
			var modal = $($(this).data('bsTarget'));
			if(modal.hasClass('edit')) {
				clearModal(modal);
				modal.removeClass('edit');
			}
		});

		scheduleEvents();
		
		cl('[clients] initiated.');
	};

	var openModal = function(params) {
		console.log('Open Modal Parameters => ', params);
		var idModal = params.openIdModal;
		$(idModal).modal('show');
		$(idModal+'Name').text(params.name);
		$(idModal+' form input[name="id"]').val(params.id);
		$(idModal+' form input[name="profile"]').val(params.profile);
	};

	var scheduleEvents = function() {
		$('.appointment-button').off().on({
			'click' : function() {
				$('#appointmentModal').modal('show');
				appointments.appointmentModalEvents();
			}
		});
	};

	return {
		init: init,
		openModal: openModal
	}
})();