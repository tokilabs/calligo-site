var appointments = (function() {
    var appointmentsData = [];
    var blockedSchedules = [];
    var appointmentModalContainer = document.querySelector('#appointmentsModal');
    const userRole = $('#shcedulesPage').attr('data-role');
    const appointmentUser = (userRole == 1) ? 'therapist' : 'patient';

    var populateAppointments = function(month, year, type) {
        const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

        $.ajax({
            url: `${_BASE_URL_}api/get_blocked_schedules`,
            type: 'GET',
            data: {
                date_begin: `${year}-${month}-01 12:00`,
                date_end: `${year}-${month}-${daysInMonth} 14:00`
            }
        }).done(function(blockedData) {
            blockedSchedules = [...blockedSchedules, ...blockedData];

            $.getJSON(`/dashboard/schedules/getCalendar/${year}-${month}`, function(data) {
                appointmentsData = [...appointmentsData, ...data];
    
                appointmentsData = appointmentsData.filter(function(item, pos) {
                    return appointmentsData.indexOf(item) == pos;
                });
    
                appointmentsForCalendarType(type, data, blockedData);
            });
        });

    };

    var appointmentsForCalendarType = function(type, appointments, blockedData) {
        switch(type) {
            case("month"):
                buildMontlyAppointments(appointments, blockedData);
                break;
            case("week"):
                buildWeeklyAppointments(appointments, blockedData);
                break;
            case("day"):
                buildDailyAppointments(appointments, blockedData);
                break;
        }

        appointmentsHandleEvents();
    };

    var buildMontlyAppointments = function(appointments, blockedData) {
        var checkEventsByDate = function(date) {
            return $('.day-item__events[data-date="' + date + '"]').find('.day-item__events-item:visible').length;
        }

        blockedData.forEach(function(block) {
            const formattedDate = dayjs(block.begin).format('YYYY-MM-DD');
            let blockContent = '';
            let blockClass = 'appointment--visible';

            if (checkEventsByDate(formattedDate) >= 3) {
                blockClass = 'appointment--hidden';
                appointmentSeeMore(formattedDate);
            }

            blockContent = `
                <div title="Horário bloqueado" 
                    data-blocked="${block.id}"
                    class="day-item__events-item day-item__events-item__blocked ${blockClass}">
                        Horário bloqueado
                </div>
            `;

            $('.day-item__events[data-date="' + formattedDate + '"]').append(blockContent);
        });

        appointments.forEach(function(appointment) {
            let appointmentPrefix = getAppointmentPrefix(appointment);
            let appointmentContent = '';
            let appointmentClass = 'appointment--visible';

            if (checkEventsByDate(appointment.day) >= 3) {
                appointmentClass = 'appointment--hidden';
                appointmentSeeMore(appointment.day);
            }

            appointmentContent = `<div title="Consulta ${appointment.status_name}"  
                                        data-appointment="${appointment.id}" 
                                        class="day-item__events-item ${appointmentClass}" 
                                        data-status="${appointmentPrefix}">
                                            ${appointment[appointmentUser].name}
            </div>`;


            $('.day-item__events[data-date="' + appointment.day + '"]').append(appointmentContent);
        });

        seeMoreEvents();
    };

    var appointmentSeeMore = function(date) {
        var totalHiddenAppointments = $('.day-item__events[data-date="' + date + '"]').find('.appointment--hidden').length;
        totalHiddenAppointments = parseInt(totalHiddenAppointments) + 1;

        if ($('.day-item__events[data-date="' + date + '"]').find('.appointment__see-more').length == 0)
            $('.day-item__events[data-date="' + date + '"]').append(
                `<a href="#" class="appointment__see-more">Ver mais <span class="total-hidden"></span></a>`
            );

        $('.day-item__events[data-date="' + date + '"]').find('.total-hidden').html(totalHiddenAppointments);
    };

    var seeMoreEvents = function() {
        $('#appointmentsModal').on('shown.bs.modal', function() {
            appointmentsModalDayEvents();
        });

        $('.appointment__see-more').off().on({
            'click' : function(ev) {
                var itemEventContainer = $(this).closest('.day-item__events');
                var items = itemEventContainer.find('.day-item__events-item').clone();
                var itemDate = itemEventContainer[0].dataset.date;
                var formattedDate = dayjs(itemDate);
                var weekDays = dayjs.weekdays();
                var weekDay = weekDays[formattedDate.$W];

                $(appointmentModalContainer).find('.appointment-modal__week').html(weekDay);
                $(appointmentModalContainer).find('.appointment-modal__day').html(formattedDate.$D)
                $(appointmentModalContainer).modal('show');
                $(appointmentModalContainer).find('.appointments__see-more__content').html(items);
                $(appointmentModalContainer).find('.appointment--hidden').removeClass('appointment--hidden');
                ev.preventDefault();
            }
        })
    };

    var appointmentsModalDayEvents = function() {
        $('.appointments__see-more__content .day-item__events-item').off().on({
            'click' : function() {
                if ($(this).hasClass('day-item__events-item__blocked'))
                    showBlockedModal($(this));
                else
                    showAppointmentModal($(this));
            }
        });
    };

    var showBlockedModal = function(target) {
        console.log(target);
    };

    var showAppointmentModal = function(target) {
        const { appointment } = target.data();
        const appointmentItem = appointmentsData.filter(item => item.id === appointment)[0];
        const patientModalContainer = document.querySelector('#patientModal');

        $(patientModalContainer).off().on('show.bs.modal', function() {
           patientModal.populateModal(appointmentItem); 
        });

        $(appointmentModalContainer).modal('hide');
        $(patientModalContainer).modal('show');

    };

    var buildWeeklyAppointments = function(appointments, blockedData) {
        var checkNumberPrefix = function(number) {
            return (number > 9) ? number : ('0' + number);
        }

        appointments.forEach(function(appointment) {

            const appointmentPrefix = getAppointmentPrefix(appointment);
            const hours = new Date(appointment.hour).getHours();
            const day = appointment.day;
            const timeRange = `${checkNumberPrefix(hours)}:00 às ${checkNumberPrefix(parseInt(hours) + 1)}:00`;

            $(`.day-item__events[data-date="${day}"][data-hour="${hours}"]`).append(
                `<div title="Consulta ${appointment.status_name}"  data-appointment="${appointment.id}" class="day-item__events-item day-item__events-item" data-status="${appointmentPrefix}">
                    <span class="day-item__events-item__patient">${appointment[appointmentUser].name}</span>
                    <span class="day-item__events-item__time">${timeRange}</span>
                </div>`
            );
        });
    };

    var buildDailyAppointments = function(appointments, blockedData) {
        var checkNumberPrefix = function(number) {
            return (number > 9) ? number : ('0' + number);
        }

        appointments.forEach(function(appointment) {
            const appointmentPrefix = getAppointmentPrefix(appointment);
            const hours = new Date(appointment.hour).getHours();
            const day = appointment.day;
            const timeRange = `${checkNumberPrefix(hours)}:00 às ${checkNumberPrefix(parseInt(hours) + 1)}:00`;

            $(`.day-item__events[data-date="${day}"][data-hour="${hours}"]`).append(
                `<div title="Consulta ${appointment.status_name}" data-appointment="${appointment.id}" class="day-item__events-item" data-status="${appointmentPrefix}">
                    <span class="day-item__events-item__patient">${appointment[appointmentUser].name}</span>
                    <span class="day-item__events-item__time">${timeRange}</span>
                </div>`
            );
        });
    };

    var getAppointmentPrefix = function(appointment) {
        let appointmentPrefix;

        switch(appointment.status_name) {
            case('Feriados'):
                appointmentPrefix = 'holiday';
                break;
            case('Agendada'):
                appointmentPrefix = 'scheduled';
                break;
            case('Em andamento'):
                appointmentPrefix = 'in-progress';
                break;
            case("Finalizada"):
                appointmentPrefix = 'done';
                break;
            case('Aguardando Psicólogo'):
                appointmentPrefix = 'in-progress';
                break;
            case('Não compareceu'):
                appointmentPrefix = 'absent';
                break;
            default:
                appointmentPrefix = 'canceled';
                break;
        }

        return appointmentPrefix;
    };

    var appointmentsHandleEvents = function() {
        var patientModalContainer = document.querySelector('#patientModal');

        $('.day-item__events-item').off().on({
            'click' : function() {
                if ($(this).hasClass('day-item__events-item__blocked'))
                    showMonthlyBlockModal($(this));
                else
                    showMonthlyAppointmentModal($(this));
            }
        });
    };

    var showMonthlyBlockModal = function(target) {
        const { blocked } = target.data();
        const blockedItem = blockedSchedules.filter(item => item.id === blocked)[0];
        const unblockModalContainer = document.querySelector('#unBlockModal');

        $(unblockModalContainer).off().on('shown.bs.modal', function() {
            blockModal.populateUnblockModal(blockedItem);
        });

        $(unblockModalContainer).modal('show');
    };

    var showMonthlyAppointmentModal = function(target) {
        const { appointment } = target.data();
        const appointmentItem = appointmentsData.filter(item => item.id === appointment)[0];
        const patientModalContainer = document.querySelector('#patientModal');

        $(patientModalContainer).off().on('show.bs.modal', function() {
           patientModal.populateModal(appointmentItem); 
        });

        $(patientModalContainer).modal('show');
    };

    var cancelAppointment = function(appointmentId) {
        $(`.day-item__events-item[data-appointment="${appointmentId}"]`).attr('data-status', 'canceled');
        $(`.day-item__events-item[data-appointment="${appointmentId}"]`).attr('title', 'Consulta cancelada');

        appointmentsData = appointmentsData.map(
            appointment => {
                if (appointment.id == appointmentId) {
                    appointment.status_name = "Cancelada";
                    appointment.status = 6;
                }

                return appointment;
            }

        );
    };

    var updateAppointment = function(appointment) {
        var prefix = getAppointmentPrefix(appointment);

        $(`.day-item__events-item[data-appointment="${appointment.id}"]`).attr('data-status', `${prefix}`);
        $(`.day-item__events-item[data-appointment="${appointment.id}"]`).attr('title', `${appointment.status_name}`);

        appointmentsData = appointmentsData.map(
            item => {
                if (item.id == appointment.id) {
                    item.status_name = appointment.status_name;
                    item.status = appointment.status;
                }

                return item;
            }
        );
    };

    var resetData = function() {
        blockedSchedules = [];
        appointmentsData = [];
    };


    var appointmentModalEvents = function() {
		$('#solicitar_agendamento').off().on('click', function(){
			var therapistId = $('.therapist_id').val();
			var modalityId = $('.terapiaRadio:checked').val();
			var mode = $('.therapy_mode:checked').val();
			var day = $('.modal-hidden_fullDate').val();
			var hour = $('.modal_agenda-date-hour').html();
			var day = $('#period-date').attr('data-date');
			var hour = $('#period-time').val();


			if(modalityId != '' || mode != '') {
				$.ajax({
					method: "POST",
					url: _BASE_URL_+'users/schedule_appointment',
					data: {"therapist_id": therapistId, "modality_id": modalityId, "mode": mode, "day": day, "hour": hour},
					error: function(response) {
						snackbar.show(response.responseJSON.error, 'error');
					}
				}).done(function( msg ) {
					if(msg.next === 'waiting_therapist' || msg.next === 'payment') {
						$('#appointmentModal').modal('hide');
						$('#agendar_consulta-sucesso').modal('show');
					}
				});
			}
			
		});
	};

    return {
        populateAppointments: function(month, year, type) {
            return populateAppointments(month, year, type)
        },
        appointmentsForCalendarType: function(type) {
            return appointmentsForCalendarType(type);
        },
        getAppointmentPrefix: function(appointment) {
            return getAppointmentPrefix(appointment);
        },
        resetData: resetData,
        cancelAppointment: function(appointmentId) {
            return cancelAppointment(appointmentId);
        },
        updateAppointment: function(appointment) {
            return updateAppointment(appointment);
        },
        appointmentModalEvents: appointmentModalEvents
    }
}());
