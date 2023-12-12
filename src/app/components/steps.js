var steps = (function(){
	var loaded = false;

	var init = function init(){
		cl('[steps] initializing...');
		snackbar.init();

		var reader = new FileReader();
		var isVideo = false;

		reader.onload = function (e) {
			if(isVideo) {
				$('#video-tag').attr('src', e.target.result);
			} else {
		    	$('.step-image_placeholder').attr('src', e.target.result);
		    }
		}

		function readURL(input) {
			isVideo = false;
	        if (input.files && input.files[0]) {
	            reader.readAsDataURL(input.files[0]);
	        }
	    }

	    function readVideo(input) {
	    	isVideo = true;
	    	if(input.files && input.files[0]) {
	    		reader.readAsDataURL(input.files[0]);
	    	}
	    }

	    if($('.step.completed').length > 0) {
	    	var height = $('.attc_description-container > p').height();

	    	if(height > 60) {
	    		$('.attc_description-container').height(height * 0.5);
	    	} else {
	    		$('.attc_description-container').height(height);
	    		$('.attc_description-read-more').hide();
	    	}
	    }
	    

	    $('.agenda_hour').on('click', function(){
	    	if($(this).hasClass('active')) {
	    		$(this).removeClass('active');
	    	} else {
	    		$(this).addClass('active');
	    	}
	    });

	    $(".step-image_upload").change(function(){
	        readURL(this);
	    });

	    // $('#video_field').change(function(){
	    //     if (typeof ($("#video_field")[0].files) != "undefined") {
     //            var size = parseFloat($("#video_field")[0].files[0].size / 1024).toFixed(2);
                
     //            if(size < 5000) {
     //            	$('.error-message').html('');
     //            	readVideo(this);
     //            } else {
     //            	$('.error-message').html('Vídeo maior do que o limite de 5mb.');
     //            }
     //        }
	    // });

		$('.add_form').on('click', function(){
			var form_add = $('.form_adder').first().clone();
			$('#form_step2').append(form_add);

			if($('.form_adder').length > 1) {
				$('.remove_form').show();
			} else {
				$('.remove_form').hide();
			}
		});

		$('.remove_form').on('click', function(){
			$('.form_adder').last().remove();

			if($('.form_adder').length > 1) {
				$('.remove_form').show();
			} else {
				$('.remove_form').hide();
			}
		});

		$('.input-modalities-value').mask("#,##0.00", {reverse: true});

		$('.multiple_select').select2({
			'language': {
		       	'noResults': function(){
		           return "Nenhum resultado encontrado.";
		       	}
		   	},
		});

		var url = new URL(window.location.href);
		var editStep = url.searchParams.get('step');

		if(editStep != null) {
			var step = parseInt(editStep);
			$('.steps-control').show();
			goStep(step);
		} else {
			var step = 0;
		}

		function nextStep(steps) {
	    	$('.step[data-step='+step+']').hide();

	    	if(step < 10) {
				step++;
			}

			if(step == 10) {
				$('.steps_block').addClass('hidden');
				$('.steps-completed').fadeIn().removeClass('hidden');
			} else {
				if($('.steps_block').hasClass('hidden')) {
					$('.steps-completed').hide().addClass('hidden');
					$('.steps_block').fadeIn().removeClass('hidden');
				}
			}

			$('.step-label[data-step='+step+']').addClass('sent');
			$('.step[data-step='+step+']').fadeIn();
	    }

	    function goStep(step) {
	    	$('.step').hide();
	    	$('.step[data-step='+step+']').fadeIn();
	    	$('.steps-completed').hide().addClass('hidden');

	    	if(step == 10) {
				$('.steps_block').addClass('hidden');
				$('.steps-completed').fadeIn().removeClass('hidden');

			} else if(step == 5) {
				checkModalities();
			} else {
				if($('.steps_block').hasClass('hidden')) {
					$('.steps-completed').hide().addClass('hidden');
					$('.steps_block').fadeIn().removeClass('hidden');
				}
			}

			for(i = 1; i <= step; i++) {
				$('.step-label[data-step='+i+']').addClass('sent');
			}
			
	    }

		$('.step_button-prev').on('click', function(e){
			e.preventDefault();

			$('.step-label[data-step='+step+']').removeClass('sent');
			$('.step[data-step='+step+']').hide();

			if(step > 0) {
				step--;

				if(step === 0) {
					$('.steps-control').hide();
				}
			}

			$('.step[data-step='+step+']').fadeIn();
		});

		// CONFIGURAÇÃO AGENDA

		$('.agenda_input-hour').mask('00:00');

		$('.configuracoes_agenda').on('click', function() {
			$('.configuracoes_agenda-container').toggle();
		});

		$('.configuracoes_agenda-container').on('click', function(e){
			e.stopPropagation();
		});

		$('.cancel_session_duration').on('click', function(){
			var sess_dur = '50';
			var sess_int = '10';
			$('#session_duration_edit').val(sess_dur);
			$('#session_interval_edit').val(sess_int);
			$('.configuracoes_agenda-container').toggle();
		});
		
		$('.save_session_duration').on('click', function(){
			var session_dur = $('#session_duration_edit').val();
			var session_int = $('#session_interval_edit').val();

			if(session_duration != '' && session_interval != '') {
				$.ajax({
					method: "POST",
					url: _BASE_URL_+'settings/attendance/step6',
					data: {
						'session_duration': session_dur,
						'session_break': session_int
					}
				}).done(function( msg ) {
					if(msg === true) {
						$('#session_duration_edit').val(session_dur);
						$('#session_interval_edit').val(session_int);
						$('.configuracoes_agenda-container').toggle();
					}
				});
			} else {
				if(session_dur === '') {
					$('#session_duration_edit').addClass('error');
				} else {
					$('#session_duration_edit').removeClass('error');
				}

				if(session_int === '') {
					$('#session_interval_edit').addClass('error');
				} else {
					$('#session_interval_edit').removeClass('error');
				}
			}
		});

		function validateHour(inputField) {
			var isValid = /^(|0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(inputField);

			return isValid;
		}

		function checkModalities() {
			$('.form-check-input').each(function () {
	           	if (!this.checked) {
	            	$('.modalities-container[data-type-service="'+$(this).attr('id')+'"]').addClass('disabled');
	            	$('.modalities-container[data-type-service="'+$(this).attr('id')+'"]').find('input').attr('disabled', true);
	           	} else {
	           		$('.modalities-container[data-type-service="'+$(this).attr('id')+'"]').removeClass('disabled');
	           		$('.modalities-container[data-type-service="'+$(this).attr('id')+'"]').find('input').attr('disabled', false);
	           	}
			});
		}

		
		$('.agenda_add-hour').each(function(ind, val){
			if($(this).prev().length > 0) {
				const {day} = $(this).data();
				$('<li class="agenda_remove-hour text-center" data-day="' + day + '"><span class="material-icons-outlined">remove</span></li>').insertAfter(this);
			}
		});

		$(document).on('click', '.agenda_remove-hour', function(){
			if($(this).siblings('.agenda_add-hour').prev().length > 0) {
				$(this).siblings('.agenda_add-hour').prev().remove();

				if($(this).siblings('.agenda_add-hour').prevAll().length === 0) {
					$(this).remove();
				}
			}
		});
		

		$('.agenda_add-hour').on('click', function(){
			var day = $(this).attr('data-day');
			var inputToAdd = '<li class="agenda_input-list"><input class="agenda_input-hour get_agenda_input-hour" type="text" placeholder="00:00" data-day="'+day+'"><span class="alert"></span></li>';

			$(inputToAdd).insertBefore(this);
			$('.agenda_input-hour').mask('00:00');

			if($(this).prev().length <= 0) {
				$(this).siblings('.agenda_remove-hour').remove();
			} else {
				if($(this).siblings('.agenda_remove-hour').length === 0) {
					$('<li class="agenda_remove-hour text-center" data-day="'+day+'"><span class="material-icons-outlined">remove</span></li>').insertAfter(this);
				}
				
			}
		});

		$(document).on('blur', '.agenda_input-hour', function(){
			var val = $(this).val();

			var duration = '50';
			var interval = '10';
			var durInt = parseInt(duration) + parseInt(interval);

			var m = durInt % 60;
			var h = (durInt-m)/60;
			var HHMM = (h<10?"0":"") + h.toString() + ":" + (m<10?"0":"") + m.toString();

			if(validateHour(val)) {
				$(this).removeClass('error');
				$(this).siblings('.alert').hide().removeClass('error');

				if($(this).parent('.agenda_input-list').prev('.agenda_input-list').length > 0) {
					var valBefore = $(this).parent('.agenda_input-list').prev('.agenda_input-list').children('.agenda_input-hour').val();
					var thisVal = val.split(':');
					var befVal = valBefore.split(':');

					var valH = parseInt(thisVal[0]);
					var valM = parseInt(thisVal[1]);

					var bvalH = parseInt(befVal[0]);
					var bvalM = parseInt(befVal[1]);

					var finalH = valH - bvalH;
					var finalM = valM - bvalM;
					var finalHHMM = (finalH<10?"0":"") + finalH.toString() + ":" + (finalM<10?"0":"") + finalM.toString();

					if(HHMM > finalHHMM) {
						$(this).siblings('.alert').show();
					} else {
						$(this).siblings('.alert').hide();
					}
				}
			} else {
				$(this).addClass('error');
				$(this).siblings('.alert').show().addClass('error');
			}
		});


		// FIM CONFIGURAÇÃO AGENDA

		var hasErrorAtAppointmentConfiguration = function () {
			let configurationError = false;
			const duration = '50';
			const interval = '10';
			const settedInterval = parseInt(duration) + parseInt(interval);

			var convertToMinutes = function (time) {
				var arrTime = time.toString().split(':');
				var convertedHours = arrTime[0] * 60;
				var totMinutes = parseInt(convertedHours) + parseInt(arrTime[1]);
				return totMinutes;
			};

			var checkTimeDifference = function (previous, current, item) {
				var timeDifference = parseInt(current) - parseInt(previous);
				var alertBadge = item.querySelector('.alert');
				alertBadge.style.display = 'none';
				
				if (timeDifference < settedInterval) {
					alertBadge.style.display = 'inline';
					configurationError = true;
				}
			};

			var checkHoursAtTarget = function (target) {
				var target = document.querySelector(`.td_column_days[data-target="${target}"]`);
				var agendaItems = Object.values(target.querySelectorAll('.agenda_input-list')).filter(
					item => item.previousElementSibling != null
				);

				agendaItems.forEach(item => {
					var previousTime = item.previousElementSibling.querySelector('.agenda_input-hour').value;
					var currentTime = item.querySelector('.agenda_input-hour').value;
					var convertedPreviousTime = convertToMinutes(previousTime);
					var convertedCurrentTime = convertToMinutes(currentTime);

					checkTimeDifference(convertedPreviousTime, convertedCurrentTime, item);
				});
			};

			for (var i = 1; i <= 7; i++) {
				checkHoursAtTarget(i);
			}

			if (configurationError)
				snackbar.show('Verifique os horários com erros!', 'error');

			return configurationError;
		};

		$('.step_button-next').on('click', function(e){
			e.preventDefault();

			if(step === 0) {
				$('.steps-control').show();
				nextStep(step);
			} else if(step === 1) {
				var userAbout = $('#user_about').val();
				var userSpeciality = $('#specialities_select').val();

				if(userAbout != '' && userSpeciality.length > 0 && userSpeciality != undefined) {
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'settings/attendance/step1',
						data: {'description': userAbout, 'specialties[_ids]': userSpeciality}
					}).done(function( msg ) {
						if(msg === true) {
							nextStep(step);
						}
					});
				} else {
					if(userAbout === '') {
						$('#user_about').addClass('error');
					} else {
						$('#user_about').removeClass('error');
					}

					if(userSpeciality.length < 1 || userSpeciality === undefined) {
						$('#specialities_select').siblings('.select2').find('.select2-search__field').addClass('error');
					} else {
						$('#specialities_select').siblings('.select2').find('.select2-search__field').removeClass('error');
					}
				}
			} else if(step === 2) {
				$('.form_adder').each(function(key){

					$(this).find('.experience_ids').attr('name', 'academic_backgrounds['+key+'][id]');
					$(this).find('.academic_type').attr('name', 'academic_backgrounds['+key+'][type]');
					$(this).find('.user_course').attr('name', 'academic_backgrounds['+key+'][class_name]');
					$(this).find('.user_institution').attr('name', 'academic_backgrounds['+key+'][institution]');
					$(this).find('.user_academic_start').attr('name', 'academic_backgrounds['+key+'][period_start]');
					$(this).find('.user_academic_end').attr('name', 'academic_backgrounds['+key+'][period_end]');
					$(this).find('.user_academic_status').attr('name', 'academic_backgrounds['+key+'][status]');

					$(this).find('input').each(function(k, j){
						if($(this).val() === '') {
							$(this).addClass('error');
						} else {
							$(this).removeClass('error');
						}
					});
				});
				
				var form_step2 = new FormData(document.getElementById('form_step2'));
				if($('.form_adder').find('.error').length === 0) {
					
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'settings/attendance/step2',
						data: form_step2,
						processData: false,
	        			contentType: false
					}).done(function( msg ) {
						if(msg === true) {
							nextStep(step);
						}
					});
				}
			} else if(step === 3) {
				var problemVal = $('#problem_select').val();
				var approachVal = $('#approach_select').val();
				var methodVal = $('#method_select').val();

				if(problemVal.length > 0 && approachVal.length > 0) {
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'settings/attendance/step3',
						data: {
							'problems[_ids]': problemVal,
							'therapies[_ids]': approachVal,
							'characteristics[_ids]': methodVal
						}
					}).done(function( msg ) {
						if(msg === true) {
							nextStep(step);
						}
					});
				} else {
					if(problemVal.length < 1 || problemVal === undefined) {
						$('#problem_select').siblings('.select2').find('.select2-search__field').addClass('error');
					} else {
						$('#problem_select').siblings('.select2').find('.select2-search__field').removeClass('error');
					}

					if(approachVal.length < 1 || approachVal === undefined) {
						$('#approach_select').siblings('.select2').find('.select2-search__field').addClass('error');
					} else {
						$('#approach_select').siblings('.select2').find('.select2-search__field').removeClass('error');
					}
				}
				
			} else if(step === 4) {
				checkModalities();
				var attendedAges = $('#attended_ages').val();
				var attendedLanguages = $('#attended_languages').val();
				var video = 0;
				var audio = 0;

				if($('#type_of_service_video').is(':checked')) {
					video = 1;
				}

				if($('#type_of_service_audio').is(':checked')) {
					audio = 1;
				}

				if(attendedAges.length > 0 && attendedLanguages.length > 0) {
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'settings/attendance/step4',
						data: {
							'ages[_ids]': attendedAges,
							'langs[_ids]': attendedLanguages,
							'attendance_by_phone_call': audio,
							'attendance_by_video_call': video
						}
					}).done(function( msg ) {
						if(msg === true) {
							nextStep(step);
						}
					});
				} else {
					if(attendedAges.length < 1 || attendedAges === undefined) {
						$('#attended_ages').siblings('.select2').find('.select2-search__field').addClass('error');
					} else {
						$('#attended_ages').siblings('.select2').find('.select2-search__field').removeClass('error');
					}

					if(attendedLanguages.length < 1 || attendedLanguages === undefined) {
						$('#attended_languages').siblings('.select2').find('.select2-search__field').addClass('error');
					} else {
						$('#attended_languages').siblings('.select2').find('.select2-search__field').removeClass('error');
					}
				}
				
			} else if(step === 5) {
				$('.modalities-container').not('.disabled').each(function(){
					$(this).find('input').each(function(k, j){
						if($(this).val() === '') {
							$(this).addClass('error');
						} else {
							$(this).removeClass('error');
						}
					});
				});

				var form = new FormData(document.getElementById('form_service'));

				if($('.modalities-container').find('.error').length === 0) {
					$.ajax({
						method: "POST",
						url: _BASE_URL_+'settings/attendance/step5',
						data: form,
						processData: false,
	        			contentType: false
					}).done(function( msg ) {
						if(msg === true) {
							nextStep(step);
						}
					});
				}
			// } else if(step === 6) {
			// 	var session_duration = $('#session_duration').val();
			// 	var session_duration_type = $('#session_duration_type').val();
			// 	var session_interval = $('#session_interval').val();
			// 	var session_interval_type = $('#session_interval_type').val();

			// 	if(session_duration != '' && session_interval != '') {
			// 		$.ajax({
			// 			method: "POST",
			// 			url: _BASE_URL_+'settings/attendance/step6',
			// 			data: {
			// 				'session_duration': session_duration,
			// 				'session_break': session_interval
			// 			}
			// 		}).done(function( msg ) {
			// 			if(msg === true) {
			// 				nextStep(step);
			// 			}
			// 		});
			// 	} else {
			// 		if(session_duration === '') {
			// 			$('#session_duration').addClass('error');
			// 		} else {
			// 			$('#session_duration').removeClass('error');
			// 		}

			// 		if(session_interval === '') {
			// 			$('#session_interval').addClass('error');
			// 		} else {
			// 			$('#session_interval').removeClass('error');
			// 		}
			// 	}
			} else if(step === 6) {
				// var formImage = new FormData(document.getElementById('video_upload'));
				var videoUrl = $('#link_video').val();
				var isBlank = true;

				if(videoUrl != '') {
					isBlank = false;
				}

				$.ajax({
					method: "POST",
					url: _BASE_URL_+'settings/attendance/step8',
					data: {'video_name': '', 'video_url': videoUrl},
					error: function (request, status, error) {
		                $('.input_infoholder').addClass('error-message');
		            },
		            success: function(msg) {
		            	if(isBlank === false) {
			            	if($('#video_alert-checkbox').is(':checked')) {
			            		$('.video_alert-message').removeClass('error-label');
			            		nextStep(step);
			            	} else {
			            		$('.video_alert-message').addClass('error-label');
			            	}
		            	} else {
		            		nextStep(step);
		            	}
		            }
				});
				
			} else if(step === 7) {
				var hours1 = [], hours2 = [], hours3 = [], hours4 = [], hours5 = [], hours6 = [], hours7 = [];
				var formData = new FormData();
				var count = 0;

				$('.get_agenda_input-hour').each(function(k, j){
					if($(this).attr('data-day') === '0') {
						hours1.push($(this).val());
					}

					if($(this).attr('data-day') === '1') {
						hours2.push($(this).val());
					}

					if($(this).attr('data-day') === '2') {
						hours3.push($(this).val());
					}

					if($(this).attr('data-day') === '3') {
						hours4.push($(this).val());
					}

					if($(this).attr('data-day') === '4') {
						hours5.push($(this).val());
					}

					if($(this).attr('data-day') === '5') {
						hours6.push($(this).val());
					}

					if($(this).attr('data-day') === '6') {
						hours7.push($(this).val());
					}
				});

				if(hours1.length > 0) {
					$.each(hours1, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '0');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours2.length > 0) {
					$.each(hours2, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '1');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours3.length > 0) {
					$.each(hours3, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '2');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours4.length > 0) {
					$.each(hours4, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '3');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours5.length > 0) {
					$.each(hours5, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '4');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours6.length > 0) {
					$.each(hours6, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '5');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if(hours7.length > 0) {
					$.each(hours7, function(index, value){
						formData.append('schedule_settings['+count+'][day_index]', '6');
						formData.append('schedule_settings['+count+'][hour_start]', value);
						count++;
					});
				}

				if (hasErrorAtAppointmentConfiguration())
					return false;

				$.ajax({
					method: "POST",
					url: _BASE_URL_+'settings/attendance/step9',
					data: formData,
					processData: false,
        			contentType: false
				}).done(function( msg ) {
					if(msg === true) {
						nextStep(step);
					}
				});
			} else if(step === 8) {
				window.location.href = window.location.origin + window.location.pathname;
			} else  {
				nextStep(step);
			}
		});

		$('.attc_description-read-more').on('click', function(){
			$(this).siblings('.attc_description-container').toggleClass('active');
			$(this).toggleClass('active');
		});

		$('.th_tab_days').on('click', function(){
			var $this = $(this).attr('data-target');
			$('.th_tab_days.active').removeClass('active');
			$('.td_column_days.active').removeClass('active');
			
			$(this).addClass('active');
			$('.td_column_days[data-target="'+$this+'"]').addClass('active');
		});
		
		cl('[steps] initiated.');
	};

	return {
		init: init
	}
})();