if (!console) console = { log: function() {} };
var debug = true;

if (window.location.hostname != "localhost") {
  debug = false;
}

var cl = function cl(msg) {
  if (debug) {
    console.log(msg);
  }
};

if (!debug) {
  console = { log: function() {} };
}

var app = (function($) {

  var init = function init($) {
    cl('Application initializing...');
    var errors = 0;
    // var scroll = new SmoothScroll('a[href*="#"]');

    setTimeout(function() {
      $(window).scroll();
    }, 100);

    $('.form-control, .form-select').on('blur', function(){
      if($(this).val().length > 0){
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });

    $('.component').each(function() {
      var componentName = $(this).attr('cp-name');
      var check = typeof window[componentName];
      if (check != "undefined" && window[componentName].init) {
        window[componentName].init();
      } else {
        if (typeof componentName != "undefined") {
          cl('+++[ERROR]+++ Unable to load component [' + componentName + '], function was not found or missing init().');
        } else {
          cl('+++[ERROR]+++ Component missing "cp-name" parameter.');
          console.log($(this));
        }
        errors++;
      }
    });   

    if (errors > 0) {
      cl('Application was initiaded but ' + errors + ' component(s) did not load.');
    } else {
      cl('All application components initiated.');
    }
    
    $(".loader").addClass('loaded');
  };

  //write new functions here

  return {
    init: init
  }
})();

jQuery(document).ready(function($) {
  app.init($);
});
var boxAgenda = (function(){
    var loaded = false;

    var init = function init(){
        cl('[boxAgenda] initializing...');
        snackbar.init();

        if($('#profile-page').length > 0) {
            
            var profileID = $('.agenda_box').attr('data-profile-id');
            var currentDate = new Date();

            function pad(n){
                return n<10 ? '0'+n : n
            }

            function getPreviousMonday() {
                var date = new Date();
                var day = date.getDay();
                var prevMonday = new Date();
                if(date.getDay() == 0){
                    prevMonday.setDate(date.getDate() - 7);
                }
                else{
                    prevMonday.setDate(date.getDate() - (day-1));
                }

                var mondayUnformatted = new Date(prevMonday);
                var mondayFormat = mondayUnformatted.getFullYear()+'-'+pad(mondayUnformatted.getMonth() + 1)+'-'+pad(mondayUnformatted.getDate());

                return mondayFormat;
            }

            function getNextMonday(date) {
                var day = date.getDay();
                var prevMonday = new Date();

                date.setDate(date.getDate() + (7-date.getDay())%7+1);

                var mondayUnformatted = new Date(date);
                var mondayFormat = mondayUnformatted.getFullYear()+'-'+pad(mondayUnformatted.getMonth() + 1)+'-'+pad(mondayUnformatted.getDate());

                currentDate = mondayUnformatted;
                
                return mondayFormat;
            }


            $.getJSON(_BASE_URL_+'users/get_schedule?profile_id='+profileID+'&initial_date='+getNextMonday(currentDate)+'', function(response){
                var htmlBase = '<div class="step-agenda" data-month="'+response.month+'" data-year="'+response.year+'">'+
                                '<div class="table_header">'+
                                    '<div class="row">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="table_agenda-days">'+
                                    '<div class="row align-items-start">'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

                $('.agenda_slider').append(htmlBase);

                $.each(response.abbrv, function(index, value){
                    var dayDate = new Date(response.days[index].replace(/-/g, '\/'));

                    $('.agenda_slider .step-agenda').last().children('.table_header').children('.row').append('<div class="col">'+
                                                                                                                        '<p class="agenda_header-title">'+value+'</p>'+
                                                                                                                        '<p class="body1 text-center bold">'+dayDate.getDate()+'</p>'+
                                                                                                                    '</div>');

                    $('.agenda_slider .step-agenda').last().children('.table_agenda-days').children('.row').append('<div class="col" data-day="'+dayDate.getDate()+'">'+
                                                                                                                            '<ul></ul>'+
                                                                                                                        '</div>');
                });


                $.each(response.schedule, function(index, value){
                    var dayDate = new Date(response.days[index].replace(/-/g, '\/'));
                    $.each(value, function(i, v){
                        const agendaContent = getAgendaListContent(v, dayDate);

                        $('.agenda_slider .step-agenda')
                            .last()
                            .children('.table_agenda-days')
                            .children('.row')
                            .children('.col[data-day="'+dayDate.getDate()+'"]')
                            .children('ul').append(agendaContent);
                    });
                });

                $('.agenda_slider').slick({
                    dots: false,
                    infinite: false,
                    prevArrow: $('.previous_arrow'),
                    nextArrow: $('.next_arrow')
                });
            });

            

            $('.next_arrow').on('click', function(){
                var slideIndex = $('.agenda_slider .slick-active').attr('data-slick-index');
                $('.agenda_loader').addClass('loading');
                $('.agenda_slider').css('visibility', 'hidden').slick('unslick');

                $.getJSON(_BASE_URL_+'users/get_schedule?profile_id='+profileID+'&initial_date='+getNextMonday(currentDate)+'', function(response){
                    var htmlBase = '<div class="step-agenda" data-month="'+response.month+'" data-year="'+response.year+'">'+
                                '<div class="table_header">'+
                                    '<div class="row">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="table_agenda-days">'+
                                    '<div class="row align-items-start">'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

                    $('.agenda_slider').append(htmlBase);

                    $.each(response.abbrv, function(index, value){
                        var dayDate = new Date(response.days[index].replace(/-/g, '\/'));

                        $('.agenda_slider .step-agenda').last().children('.table_header').children('.row').append('<div class="col">'+
                                                                                                                            '<p class="agenda_header-title">'+value+'</p>'+
                                                                                                                            '<p class="body1 text-center bold">'+dayDate.getDate()+'</p>'+
                                                                                                                        '</div>');

                        $('.agenda_slider .step-agenda').last().children('.table_agenda-days').children('.row').append('<div class="col" data-day="'+dayDate.getDate()+'">'+
                                                                                                                                '<ul></ul>'+
                                                                                                                            '</div>');
                    });


                    $.each(response.schedule, function(index, value){
                        var dayDate = new Date(response.days[index].replace(/-/g, '\/'));
                        $.each(value, function(i, v){
                            const agendaContent = getAgendaListContent(v, dayDate);

                            $('.agenda_slider .step-agenda').last().children('.table_agenda-days').children('.row').children('.col[data-day="'+dayDate.getDate()+'"]').children('ul').append(agendaContent);
                        });
                    });

                    $('.agenda_slider').slick({
                        dots: false,
                        infinite: false,
                        prevArrow: $('.previous_arrow'),
                        nextArrow: $('.next_arrow'),
                        initialSlide: parseInt(slideIndex),
                    });

                    $('.agenda_slider').css('visibility', 'visible');
                    $('.agenda_loader').removeClass('loading');

                    $('.agenda_slider').slick('slickGoTo', parseInt(slideIndex) + 1);
                });
            });

            // MODAL PARA AGENDAR CONSULTA

            $(document).on('click', '.available-date', function(event){
                const dateHour = $(this).children('.agenda_input-hour').attr('data-hour');
                const arrDateHour = dateHour.split(':');
                const lastDateHour = `${arrDateHour[0]}:50`;

                $('.modal_agenda-date-hour').html(dateHour);
                $('.modal_agenda-last-date-hour').html(lastDateHour);
                $('.modal-agenda_month').html($('.step-agenda.slick-active').attr('data-month'));
                $('.modal-agenda_day').html($(this).children('.agenda_input-hour').attr('data-day'));
                $('.modal-agenda_year').html($('.step-agenda.slick-active').attr('data-year'));
                $('.modal-hidden_fullDate').val($(this).attr('info-date'));
                $('#appointmentModal').modal('show');
            });

            $('.agenda_slider').on('afterChange', function(slick, currentSlide){
                $('.agenda_month').html($('.step-agenda.slick-active').attr('data-month'));
                $('.agenda_year').html($('.step-agenda.slick-active').attr('data-year'));
            });

            $('.terapiaRadio').on('change', function(){
                if($(this).is(':checked')) {
                    $('.agenda_price').html($(this).attr('data-price'));
                }
            });


            $('#solicitar_agendamento').on('click', function(){
                var therapistId = $('.therapist_id').val();
                var modalityId = $('.terapiaRadio:checked').val();
                var mode = $('.therapy_mode:checked').val();
                var day = $('.modal-hidden_fullDate').val();
                var hour = $('.modal_agenda-date-hour').html();


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
                            // $('#agendar_consulta-sucesso').modal('show');
                            window.location.href = window.location.origin + '/appointments/payment/' + msg.appoitment_id;
                        }
                    });
                }
                
            });
        }

        cl('[boxAgenda] initiated.');
    };

    var getAgendaListContent = function(schedule, dayDate) {
        const scheduleItemClass = schedule.selected ? '' : 'available-date';
        const wrapperClass = schedule.selected ? 'selected' : 'none';
        const formattedDate = `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`;

        return `
            <li class="agenda_input-list ${scheduleItemClass}" info-date="${formattedDate}">
                <div class="agenda_input-hour agenda_input-${wrapperClass}" 
                    type="text" 
                    data-hour="${schedule.hour}" 
                    placeholder="00:00" 
                    data-day="${dayDate.getDate()}">
                        <p class="caption">${schedule.hour}</p>
                </div>
            </li>
        `;
    }

    return {
        init: init
    }
})();
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

var blockModal = (function () {
    var blockModalEl = document.getElementById('blockModal');
    var unblockModalEl = document.getElementById('unBlockModal');

    var init = function () {
        console.log('[block-modal] initializing');
        snackbar.init();

        blockModalEl.addEventListener('show.bs.modal', function () {
            $('input').val('');
        });

        $('#lock-time-form').off().on({
            'submit': function (ev) {
                const startDate = $('#start-date').attr('data-date');
                const endDate = $('#end-date').attr('data-date');
                const startTime = $('#start-time').val();
                const endTime = $('#end-time').val();

                $.ajax({
                    method: "POST",
					url: _BASE_URL_+'dashboard/schedules/block_schedule',
                    data: {
                        'begin': `${startDate} ${startTime}`,
                        'end': `${endDate} ${endTime}`
                    },
                    error: function(data, status, jqXHR) {
                        var error = data.responseJSON.end.end;
                        snackbar.show(error, 'error');
                    }
                }).done(function(data, textStatus, jqXHR) {

                    if (jqXHR.status === 204) {
                        $(blockModalEl).modal('hide');
                        snackbar.show('Horário bloqueado com successo!', 'success');
                        window.location.reload();
                    }
                });

                ev.preventDefault();
            }
        });

        console.log('[block-modal] initilialized');
    };

    var populateUnblockModal = function (data) {
        const formattedBegin =  dayjs(data.begin).format('MMMM D, YYYY - HH:mm');
        const formattedEnd = dayjs(data.end).format('MMMM D, YYYY - HH:mm');
        $('#unblock-begin').html(formattedBegin);
        $('#unblock-end').html(formattedEnd);

        $('.cancel-block__button').off().on({
            'click' : function() {
                $.ajax({
                    type: 'POST',
                    url: `${_BASE_URL_}api/delete_blocked_schedules`,
                    data: {
                        id: data.id
                    },
                    error: function(data, status, jqXHR) {
                        var error = data.responseJSON.message;
                        snackbar.show(error, 'error');
                    }
                }).done(function(result, textStatus, jqXHR) {
                    if (jqXHR.status === 204) {
                        $(unblockModalEl).modal('hide');
                        snackbar.show('Bloqueio removido com sucesso!', 'success');
                        $(`.day-item__events-item__blocked[data-blocked="${data.id}"]`).remove();
                    }
                });
            }
        })
    };

    return {
        init: init,
        populateUnblockModal: data => populateUnblockModal(data)
    }
})();
var calendar = (function () {
    const TODAY = dayjs().format("YYYY-MM-DD");
    const INITIAL_YEAR = dayjs().format("YYYY");
    const INITIAL_MONTH = dayjs().format("MM");

    let selectedMonth,
        currentWeek,
        oldCurrentDay,
        currentDay;

    var weekDays = [];

    var init = function init() {
        cl("[calendar] initializing...");

        dayjs.locale('pt-br');
        dayjs.extend(dayjs_plugin_localeData);
        dayjs.extend(dayjs_plugin_updateLocale);
        dayjs.extend(dayjs_plugin_weekday);
        dayjs.extend(dayjs_plugin_weekOfYear);

        dayjs.updateLocale('pt-br', {
            weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"]
        });

        selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
        currentWeek = dayjs().week();
        currentDay = dayjs();
        oldCurrentDay = currentDay;

        weekDays = dayjs.weekdays();

        startSelectedCalendarFormat();
        activeCalendarEvents();
    };

    var activeCalendarEvents = function () {
        $('.calendar__header-button').off().on('click', function () {
            $('.calendar-content').html('');
            $('.calendar__header-button.active').removeClass('active');
            $(this).addClass("active");
            startSelectedCalendarFormat();
        });
    }

    var startSelectedCalendarFormat = function () {
        var activeFormat = getActiveCalendarFormat();

        if (activeFormat == "month") {
            selectedMonth = dayjs(new Date(currentDay.format("YYYY"), currentDay.format("MM") - 1, 1));
            buildMonthlyCalendar(currentDay.format("YYYY"), currentDay.format("MM"));
        }

        if (activeFormat == "week") {
            currentWeek = currentDay.week();
            buildWeeklyCalendar();
        }

        if (activeFormat == "day") 
            buildDailyCalendar();

        calendarEvents();
    };

    var buildMonthlyCalendar = function buildMonthlyCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
        var monthlyCalendarHeader = '';
        var weekdayContainer = document.querySelector('.calendar__weekdays--monthly');
        var monthlyDays = document.querySelector('.calendar__monthly-days');

        document.getElementById("selected-month").innerText = dayjs(
            new Date(year, month - 1)
        ).format("MMMM");

        document.getElementById("selected-year").innerText = dayjs(
            new Date(year, month - 1)
        ).format("YYYY");

        weekDays.forEach((weekDay) => {
            monthlyCalendarHeader += `<div class="calendar__weekdays-item">${weekDay}</div>`;
        });

        weekdayContainer.innerHTML = monthlyCalendarHeader;

        currentMonthDays = createDaysForCurrentMonth(
            year,
            month,
            dayjs(`${year}-${month}-01`).daysInMonth()
        );

        previousMonthDays = createDaysForPreviousMonth(year, month);
        nextMonthDays = createDaysForNextMonth(year, month);

        const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
        const daysContent = getDaysContent(days);

        monthlyDays.innerHTML = daysContent.join('');

        appointments.populateAppointments(month, year, "month");

        if (previousMonthDays.length > 0) {
            const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
            appointments.populateAppointments(previousMonth.format("MM"), previousMonth.format("YYYY"), "month");
        }

        if (nextMonthDays.length > 0) {
            const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
            appointments.populateAppointments(nextMonth.format("MM"), nextMonth.format("YYYY"), "month");
        }
    };

    var getDaysContent = function getDaysContent(days) {
        let daysContent = [];

        daysContent.push(`<div class="calendar__row">`);

        days.forEach((day, dayIndex) => {
            const dayContainerClass =
                (day.date === TODAY) ? 'is-current-day' : day.isCurrentMonth
                    ? 'current-month' : 'previous-month';

            daysContent.push(`
              <div class="calendar__monthly-item calendar__row-item ${dayContainerClass}">
                  <div class="day-item__title"><span>${day.dayOfMonth}</span></div>
                  <div data-date="${day.date}" class="calendar__monthly-item__events day-item__events"></div>
              </div>
          `);

            if ((parseInt(dayIndex) + 1) % 7 == 0 && days[parseInt(dayIndex) + 1])
                daysContent.push(`</div><div class="calendar__row">`);
        });

        daysContent.push('</div>');

        return daysContent;
    };

    var buildWeeklyCalendar = function buildWeeklyCalendar() {
        var weeklyCalendarHeader = '<div class="calendar__weekdays-item"></div>';
        var weekdayContainer = document.querySelector('.calendar__weekdays--weekly');
        var weeklyDays = document.querySelector('.calendar__weekly-days');
        var daysContent = ['<div class="calendar__row calendar__row--header">','<div class="calendar__row-item calendar__row-item--weekly"><span class="utc-time">GMT-03</span></div>'];
        var formatedDates= [];

        document.getElementById("selected-month").innerText = currentDay.format("MMMM");
        document.getElementById("selected-year").innerText = currentDay.format("YYYY");

        weekDays.forEach((weekDay, index) => {
            const formattedWeekDay = currentDay.weekday(index);
            formatedDates.push(formattedWeekDay.format("YYYY-MM-DD"));

            const dayClass = formattedWeekDay.$M != currentDay.$M ? 'another-month' : '';
            const isCurrent = formattedWeekDay.format("YYYY-MM-DD") == TODAY ? 'is-current' : '';

            weeklyCalendarHeader += `<div class="calendar__weekdays-item">
                <div class="calendar__weekly-month">${weekDay}</div>
                <div class="calendar__weekly-day ${dayClass} ${isCurrent}">${formattedWeekDay.$D}</div>
            </div>`;

            daysContent.push(
                `<div class="calendar__row-item calendar__row-item--weekly"></div>`
            );
        });

        daysContent.push('</div>');

        var getContentForDates = function(hour) {
            const content = [];

            formatedDates.forEach(item => {
                content.push(`<div class="calendar__row-item calendar__row-item--weekly">
                    <div class="day-item__events" data-date="${item}" data-hour="${hour}"></div>
                </div>`);
            });

            return content.join('');
        }

        for (let i = 0; i < 10; i ++) {
            let sum = parseInt(9) + i;
            sum = (sum < 10) ? ('0' + sum) : sum;

            const daytime = sum + ':00';
            const daytimeLine = (i < 9) ? `<span class="calendar__row--time">${daytime}</span>` : '';

            daysContent.push(`<div class="calendar__row">
                    <div class="calendar__row-item calendar__row-item--weekly">${daytimeLine}</div>`);

            
            daysContent.push(getContentForDates((sum - 1)));
            daysContent.push('</div>')
        }

        weekdayContainer.innerHTML = weeklyCalendarHeader;
        weeklyDays.innerHTML = daysContent.join('');

        appointments.populateAppointments(oldCurrentDay.format("MM"), oldCurrentDay.format("YYYY"), "week");
    };

    var buildDailyCalendar = function buildDailyCalendar() {
        var dailyCalendarHeader = '<div class="calendar__weekdays-item"></div>';
        var weekdayContainer = document.querySelector('.calendar__weekdays');
        var dailyDays = document.querySelector('.calendar__daily-days');
        var dailyDaysContent = [];

        document.getElementById("selected-month").innerText = `${currentDay.format("D")} de  ${currentDay.format("MMMM")}`;
        document.getElementById("selected-year").innerText = currentDay.$y;

        dailyDaysContent.push(
            `<div class="calendar__daily-header">
                <span class="calendar__daily-header-day">${currentDay.format("D")}</span>
                <span class="calendar__daily-header-week">${dayjs.weekdays()[currentDay.weekday()]}</span>
            </div>`
        );

        dailyDaysContent.push(
            `<div class="calendar__daily-row">
                <div class="calendar__daily-row-item calendar__daily-hour"><span class="utc-time">GMT-03</span></div>
                <div class="calendar__daily-row-item calendar__daily-events"></div>
            </div>`
        );

        for (let i = 0; i < 10; i ++) {
            let sum = parseInt(8) + i;
            sum = (sum < 10) ? ('0' + sum) : sum;

            const daytime = sum + ':00';
            const daytimeLine = (i < 9) ? `<span class="calendar__row--time">${daytime}</span>` : '';
            const hour = sum - 1;
            const currentDate = currentDay.format("YYYY-MM-DD");

            dailyDaysContent.push(`
                <div class="calendar__daily-row">
                    <div class="calendar__daily-row-item calendar__daily-hour">${daytimeLine}</div>
                    <div class="calendar__daily-row-item calendar__daily-events day-item__events" data-date="${currentDate}" data-hour="${hour}"></div>
                </div>
            `);

        }

        dailyDays.innerHTML = dailyDaysContent.join('');
        weekdayContainer.innerHTML = dailyCalendarHeader;
        appointments.populateAppointments(oldCurrentDay.format("MM"), oldCurrentDay.format("YYYY"), "day");
    };

    var getActiveCalendarFormat = function () {
        return "month";

        var calendarButtons = [...document.querySelectorAll('.calendar__header-button')];
        var activeFormat = calendarButtons.filter(button => button.classList.contains('active'));
        return activeFormat[0].dataset.calendarFormat;
    };

    var getNumberOfDaysInMonth = function getNumberOfDaysInMonth(year, month) {
        return dayjs(`${year}-${month}-01`).daysInMonth();
    }

    var createDaysForCurrentMonth = function createDaysForCurrentMonth(year, month) {
        return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
            return {
                date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
                dayOfMonth: index + 1,
                isCurrentMonth: true
            };
        });
    }

    var createDaysForPreviousMonth = function createDaysForPreviousMonth(year, month) {
        const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

        const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

        const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
            ? firstDayOfTheMonthWeekday
            : 0;

        const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
            .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
            .date();

        return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
            return {
                date: dayjs(
                    `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index
                    }`
                ).format("YYYY-MM-DD"),
                dayOfMonth: previousMonthLastMondayDayOfMonth + index,
                isCurrentMonth: false
            };
        });
    }

    var createDaysForNextMonth = function createDaysForNextMonth(year, month) {
        const lastDayOfTheMonthWeekday = getWeekday(
            `${year}-${month}-${currentMonthDays.length}`
        );

        const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

        const visibleNumberOfDaysFromNextMonth = (lastDayOfTheMonthWeekday < 7)
            ? 6 - lastDayOfTheMonthWeekday
            : 0;

        return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
            return {
                date: dayjs(
                    `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
                ).format("YYYY-MM-DD"),
                dayOfMonth: index + 1,
                isCurrentMonth: false
            };
        });
    }

    var getWeekday = function getWeekday(date) {
        return dayjs(date).weekday();
    }

    var calendarEvents = function () {
        $('.link__previous-month').off().on({
            'click': function () {
                appointments.resetData();
                previousEventToCalendarType();
            }
        });

        $('.link__next-month').off().on({
            'click': function () {
                appointments.resetData();
                nextEventToCalendarType();
            }
        });
    }

    var previousEventToCalendarType = function () {
        var activeFormat = getActiveCalendarFormat();

        if (activeFormat == "month") {
            selectedMonth = dayjs(selectedMonth).subtract(1, "month");
            setCurrentDayOfMonth();
            buildMonthlyCalendar(selectedMonth.format("YYYY"), selectedMonth.format("MM"));
        }

        if (activeFormat == "week") {
            currentWeek = parseInt(currentWeek) - 1;
            setCurrentDayOfWeek(currentWeek);
            buildWeeklyCalendar();
        }

        if (activeFormat == "day") {
            currentDay = currentDay.subtract(1, "day");
            buildDailyCalendar();
        }
    }

    var nextEventToCalendarType = function () {
        var activeFormat = getActiveCalendarFormat();

        if (activeFormat == "month") {
            selectedMonth = dayjs(selectedMonth).add(1, "month");
            setCurrentDayOfMonth();
            buildMonthlyCalendar(selectedMonth.format("YYYY"), selectedMonth.format("MM"));
        }

        if (activeFormat == "week") {
            currentWeek = parseInt(currentWeek) + 1;
            setCurrentDayOfWeek(currentWeek);
            buildWeeklyCalendar();
        }

        if (activeFormat == "day") {
            currentDay = currentDay.add(1, "day");
            buildDailyCalendar();
        }
    }

    var setCurrentDayOfMonth = function() {
        currentDay = selectedMonth;
    }

    var setCurrentDayOfWeek = function(week) {
        currentDay = dayjs().week(week).weekday(0);
    }

    return {
        init: init
    }
})();
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
var comments = (function(){
	var loaded = false;

	var init = function init(){
		cl('[comments] initializing...');

		$('.comments-slider').slick({
			infinite: false,
			slidesToShow: 3,
			arrows: false,
			dots: true
		});
		
		cl('[comments] initiated.');
	};

	return {
		init: init
	}
})();
/**
 *             
 * <button type="button" 
		rel="popover" title=[title]" 
		data-text-align="left"
		data-callback-function="openModal"
		data-anchor-close="true"
		data-target="popover-select">
		[text button]
	</button>

	@param #rel
	With popover value to specify that it is a element with popover actions attached 
	@param #data-text-align
	To define the text position
	@param #data-callback-function
	To define a callback triggered by elements with `popover__anchor` class
	@param #data-anchor-close
	To define if when clicked in a achor trigger a method to close the popover
	@param #data-target
	The id of element that contains the content that will be attached at popover body

	The element that contain the `popover__anchor` actions need to have a class named `content-[attribute from target] to allow attached the events at correct `popover__anchor` elements.
 */


var customPopover = (function(){
	var init = function init(){
		cl('[customPopover] initializing...');

		$('[rel="popover"]').each(function() {
			var { target, textAlign, anchorClose, callbackFunction, position } = $(this).data();
			var callbackAction = eval(callbackFunction);
			var popoverBodyText = textAlign ? 'popover-body--' + textAlign : '';
			var placementPosition = position ? position : 'bottom-end';
			var popoverTemplate = '' + 
				'<div rel="sample" class="custom-popover popover" role="tooltip">' + 
					'<div class="popover-body ' + popoverBodyText + '"></div>' + 
				'</div>';

			var targetHTML = $('#' + target).html();
			var popoverAnchors = document.getElementById(target).querySelectorAll('.popover__anchor');
			var htmlContent = '<div class="popover__wrapper" rel="' + target + '">' + targetHTML + '</div>';

			$(this).popover({
				html: true,
				offset: [0,0],
				template: popoverTemplate,
				content: function(){
					return htmlContent
				},
				popperConfig: {
					placement: placementPosition
				}
			});
	
			if (anchorClose) {
				var self = $(this);
				$(this).on('shown.bs.popover', function() {
					var anchors = $('.popover__wrapper .content-' + target + ' .popover__anchor');
					anchors.each(function(index, item) {
						var popoverAnchor = popoverAnchors[index];

						$(item).on('click', function() {
							var data = popoverAnchor.dataset;
							callbackAction.apply(this, [data]);
							// self.popover('hide');
						});
					});
					$('body').on('click',function(){
						self.popover('hide');
						$('body').off('click');
					});
				});
			}
		});

		cl('[customPopover] initialized...');
	};

	return {
		init: init
	}
})();

var openModal = function(arguments) {
	var { id } = arguments;
};
var docs = (function () {
    var loaded = false;

    var init = function init() {
        cl('[docs] initializing...');

        $('#client-docs-search,#client-notes-search').on('keyup', function () {
            let search = this.value;
            if (search.length > 1) {
                docsTable.search(this.value).draw();
            } else {
                docsTable.search("").draw();
            }
        });

        $('.filter-table button').on('click', function () {
            $('.filter-table button.active').removeClass('active');
            $(this).addClass('active');
            if($('.filter-table button').length>1){
                let column = $(this).data('column');
                docsTable.column(column).search($(this).data('filter')).draw();
            }
        });
        // docsTable.column(3).visible(false);

        $('.table-records tbody tr').on('click', function () {
            $('.table-records tbody tr').removeClass('active');
            $(this).addClass('active');

            let tableActive = $('.table-records tbody tr.active');
            $('#actions-table').removeClass('d-none');
            $('#actions-table a.link').attr('href', tableActive.data('fileView'));
            $('#actions-table a.download').attr('href', tableActive.data('fileDownload'));
            $('#actions-table a.delete').data('delete_id', tableActive.data('id'));
            $('#actions-table a.modal-start').data('title', tableActive.data('title')).data('body', tableActive.data('body'));
        });

        $('#actions-table a.delete').on('click', function (e) {
            e.preventDefault();

            var action = $('#actions-table').data('action');
            cl(action);

            $('#confirmationModal').modal('show');
			$('#confirmationModal').data('confirmation',action);
			$('#confirmationModal [class^="confirm_"]').removeClass('d-inline');
			$('#confirmationModal .confirm_'+action).addClass('d-inline');
			$('#confirmationModal .confirm_name_'+action).text($('#'+action+'ModalName').text());
			$('#confirm_cancel,#confirm_delete').removeAttr('disabled');

            $('#confirm_cancel:not(:disabled)').on('click', function(e){
                e.preventDefault();
                $('#confirmationModal').modal('hide');
            });

            $('#confirm_delete:not(:disabled)').on('click', function(e){
                e.preventDefault();
                $('#confirm_delete').attr('disabled','');
                $('#confirm_cancel').attr('disabled','');

                let note_delete = $('#actions-table a.delete').data('delete_id');
                let url;

                switch (action) {
                    case 'newNote':
                        url = _BASE_URL_+'dashboard/notes/delete/'+note_delete;
                    break;
                    case 'docs':
                        url = _BASE_URL_+'dashboard/docs/delete/'+note_delete;
                    break;
                }
                
                cl('form iniciado');
                $.getJSON(url, function(msg){
                    if(msg === true) {
                        $('#confirmationModal').modal('hide');
                        docsTable.row('.active').remove().draw();
                        $('#actions-table').addClass('d-none');
                    }
                    cl(msg)
                });
            });
            
        });

        $('#actions-table a.modal-start').on('click', function (e) {
            e.preventDefault();
            let id = $(this).attr('href');
            let title = $(this).data('title');
            let body = $(this).data('body');
            $(id).find('.modal-title').text(title);
            $(id).find('.modal-body').html(body);

            $(id).modal('show');
        });

        cl('[docs] initiated.');
    };

    let docsTable = $('.table-records').DataTable({
        "paging": false,
        // "order": [[3, 'asc']],
        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ],
        "language": {"decimal":"","emptyTable":"","info":"","infoEmpty":"","infoFiltered":"","infoPostFix":"","thousands":"","lengthMenu":"","loadingRecords":"","processing":"","search":"","zeroRecords":"","paginate":{"first":"","last":"","next":"","previous":""},"aria":{"sortAscending":"","sortDescending":""}},
        // "search": {
        //     "search": "erry"
        // },
        // "searching": false
    });
    $('#docs_filter,#notes_filter').addClass('d-none');

    return {
        init: init,
        // docsTable: docsTable
    }
})();
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
var formMasks = (function () {
  var loaded = false;

  var init = function init () {
    cl('[formMasks] initializing...');

    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
      },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };

    $('.mask_phone').mask(SPMaskBehavior, spOptions);
    $('.mask_cnpj').mask('00.000.000/0000-00', {reverse: true});
    $('.mask_cep').mask('00000-000');
    $(".mask_cpf").mask('000.000.000-00');
    $(".mask_date").mask('00/00/0000');
    $('.mask_epsi').mask('00/000.000');
    $('.mask_cpf_cnpj').mask(
      (val) => {
        return val.replace(/\D/g, '').length === 11 ? '000.000.000.00' : '00.000.000/0000-00';
      },
      {
        onKeyPress: function (cpfcnpj, e, field, options) {
          var masks = ['000.000.000-000', '00.000.000/0000-00'];
          var mask = (cpfcnpj.length > 14) ? masks[1] : masks[0];
          $('.mask_cpf_cnpj').mask(mask, options);
        },
      });
    // $(".mask_date input").datepicker({language: 'pt-BR'});

    cl('[formMasks] initiated.');
  };

  return {
    init: init
  }
})();

formMasks.init();

var form_files = (function(){
	var loaded = false;

	var init = function init(){
		cl('[form_files] initializing...');

        function addfile(name,size) {
            return '<span class="file">'+name+' <b>('+size+'kb)</b> <button type="button" class="material-icons text__gray70 btn-delete-file">close</button></span>'
        }

        $("input.files_in_textarea").on('change',function() {
            var files = [];
            for (var i = 0; i < $(this)[0].files.length; ++i) {
                files.push({
                    'name':$(this)[0].files[i].name,
                    'size':Math.ceil($(this)[0].files[i].size/1024)
                });
            }
            //para somente 1 arquivo (NÃO funciona para MULTIFILE)
            $(this).parent().find('.files').html('').append(addfile(files[0].name,files[0].size));
        });

        // $("button.btn-delete-file").on('click',function() {
        $(document).on('click','button.btn-delete-file',function() {
            //para somente 1 arquivo (NÃO funciona para MULTIFILE)
            let form = $(this).closest('form');
            form.find('.files').html('');
            form.find('input.files_in_textarea').val('');
            cl('ae');
        });
		
		cl('[form_files] initiated.');
	};

	return {
		init: init
	}
})();
var form_summernote = (function(){
	var loaded = false;

	var init = function init(){
		cl('[form_summernote] initializing...');
        
        $('[data-summernote]').each(function(){
            var buttons_summer = $(this);
            var id_summer = '#'+buttons_summer.data('summernote');
            $(id_summer).summernote({
                height: 200,
                toolbar: false,
                placeholder: $(id_summer).attr('placeholder'),
            });
            var lengSelect = 1;
            buttons_summer.find('span[data-button-summernote]').each(function(){
                var button_summer = $(this);
                button_summer.on('click',function(e) {
                    e.preventDefault();
                    var button = $(this).data('buttonSummernote');
                    setTimeout(function() {
                        $(id_summer).summernote('restoreRange');
                        cl('restoreRange');
                        setTimeout(function() {
                            cl(button);
                            if (lengSelect==0 && button=='removeFormat') {
                                var text = '<p>'+$(id_summer + ' + .note-editor').find('.note-editable').text()+'</p>';
                                $(id_summer + ' + .note-editor').find('.note-editable').html(text);
                                $(id_summer).val(text);
                            }
                            $(id_summer).summernote(button);
                        },100);
                    },100);
                });
            });
            buttons_summer.on('mouseenter',function(){
                $(id_summer).summernote('saveRange');
                lengSelect = Math.abs($(id_summer).summernote('createRange').eo-$(id_summer).summernote('createRange').so);
            })
        });
		
		cl('[form_summernote] initiated.');
	};

	return {
		init: init
	}
})();
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
var helpSearch = (function(){
	var loaded = false;

	var init = function init(){
		cl('[helpSearch] initializing...');

		if($('.desktop').css('display') === 'none') {
			var count = $('.accordion_categories').length;
			var size = count * 200;
			var sizeVW = size * 100 / 320;

			$('.row_mobile-width').css('width', ''+sizeVW+'vw')
		}

		$('.accordion_categories').on('click', function(){
			var thisCategory = $(this).attr('data-category');
			$('.accordion_categories.active').removeClass('active');
			$('.accordion_list').show();
			$(this).addClass('active');

			$('.help_accordion_category.active').removeClass('active');
			$('.help_accordion_category[data-category="'+thisCategory+'"]').addClass('active');
		});

		$('#help_search-input').keypress(function(event){
			if(event.keyCode == 13){
				$('#help_search-trggr').click();
			}
		});

		$('#help_search-trggr').on('click', function(){
			var searched = $('#help_search-input').val();
			$('.help_accordion_category').removeClass('active');
			$('.accordion_list').each(function(ind, val){
				var buttonText = $(this).find('.accordion-button').text();
				var contentText = $(this).find('.accordion-body').text();

				if(buttonText.toLowerCase().search(searched.toLowerCase()) != -1) {
					$(this).show();
					$(this).parent('.help_accordion_category').addClass('active');
				} else if(contentText.toLowerCase().search(searched.toLowerCase()) != -1) {
					$(this).show();
					$(this).parent('.help_accordion_category').addClass('active');
				} else {
					$(this).hide();
				}
			})
		});
		
		cl('[helpSearch] initiated.');
	};

	return {
		init: init
	}
})();
var inputDate = (function() {
    var init = function init() {
		cl('[inputDate] initializing...');

        dayjs.locale('pt-br');
        dayjs.extend(dayjs_plugin_localeData);
        dayjs.extend(dayjs_plugin_updateLocale);
        dayjs.extend(dayjs_plugin_weekday);
        dayjs.extend(dayjs_plugin_weekOfYear);

        dayjs.updateLocale('pt-br', {
            weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"]
        });

        var datepickerFields = document.querySelectorAll('.custom-datepicker');

        datepickerFields.forEach(field => {
            datepicker(field, {
                customDays: dayjs.weekdaysMin(),
                customMonths: dayjs.months(),
                formatter: (input, date, instance) => {
                    const formattedDate = dayjs(date);
                    const value = `${dayjs.months()[formattedDate.$M]} ${formattedDate.$D}, ${formattedDate.$y}`;
                    input.dataset.date = formattedDate.format("YYYY-MM-DD");
                    input.value = value
                }
            });
        });


        $('.timepicker').timepicker({
            timeFormat: 'HH:mm',
            interval: 60,
            minTime: '08',
            maxTime: '17:00',
            defaultTime: '08',
            startTime: '08:00',
            dynamic: false,
            dropdown: true,
            zindex: 1100,
            scrollbar: true
        });

        cl('[inputDate] initialized...');
    };

    return {
        init: init
    }
})();
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
var patientModal = (function() {
    var selectedAppointmentId;
    var selectedAppointment;
    var patientModalContainer = document.querySelector('#patientModal');
    var confirmModalContainer = document.querySelector('#confirmationModal');
    const userRole = $('#shcedulesPage').attr('data-role');
    const appointmentUser = (userRole == 1) ? 'therapist' : 'patient';

    var init = function() {
        cl('[patient-modal] initializing');
        cl('[patient-modal] initialed');
        snackbar.init();
    };

    var populateModal = function(appointment) {
        var appointmentPrefix = appointments.getAppointmentPrefix(appointment);
        selectedAppointmentId = appointment.id;
        selectedAppointment = appointment;

        $('#patient-image').attr({
            'src' : appointment[appointmentUser].profile.photo,
            'alt' : appointment[appointmentUser].name
        });
        $('#patient-name').html(appointment[appointmentUser].name);
        $('#patient-status').attr('data-status', appointmentPrefix);
        $('#patient-therapy').html(appointment.modality.name);

        configureAppointmentDate(appointment);
        checkPatientStatus(appointment.status_name, appointmentPrefix)
        buildFooterToStatus(appointment.status_name, userRole);
    };

    var configureAppointmentDate = function(appointment) {
        var configuredTime = dayjs(appointment.day);
        var weekday = dayjs.weekdays()[configuredTime.$W];
        var day = configuredTime.date();
        var month = dayjs.months()[configuredTime.$M];
        var startTime = appointment.hour_complet;
        var endTime = appointment.hour_end;

        $('#appointment__weekday').html(weekday);
        $('#appointment__day').html(day);
        $('#appointment__month').html(month);
        $('#appointment__start-time').html(startTime);
        $('#appointment__end-time').html(endTime);
    };

    var checkPatientStatus = function(status, prefix) {
        if ((status == "Finalizada" || status == "Não compareceu") && userRole == 2) {
            $('.patient-modal__container-status').html(`
                <div class="component" cp-name="customPopover">
                <div class="custom-popover__content" id="popover-patient">
                    <ul class="list--clean-style content-popover-patient">
                        <li><a data-id="5" class="popover__anchor" href="#">Finalizada</a></li>
                        <li><a data-id="7" class="popover__anchor" href="#">Cliente não compareceu</a></li>
                    </ul>
                </div>

                <span class="patient-modal__status anchor-popover"
                        rel="popover"
                        data-text-align="left"
                        data-status="${prefix}"
                        data-callback-function="changeStatusPatient"
                        data-position="bottom-start"
                        data-anchor-close="true"
                        data-target="popover-patient">
                    <span>${status}</span>
                    <span class="material-icons text__gray70">expand_more</span>
                </button>

            </div>

            `);

            customPopover.init();
        }
        else
        $('.patient-modal__container-status').html(
            `<span class="patient-modal__status" data-status="${prefix}" id="patient-status">${status}</span>`
        )
    };

    var buildFooterToStatus = function(status, userRole) {
        if (userRole == 2)
            buildFooterToStatusAtTherapist(status);
        else
            buildFooterToStatusAtPatient(status);
    };

    var buildFooterToStatusAtTherapist = function(status) {
        let content;

        switch(status) {
            case('Agendada'):
                content = `
                    <button class="btn btn-primary" disabled>
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                    <button class="btn btn-outline-primary">REAGENDAR</button>
                    <button class="btn btn-light-primary cancel-button">CANCELAR</button>
                `;
                break;
            case('Em andamento'):
                content = `
                    <button class="btn btn-primary video-button">
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                `;
                break;
            default:
                content = `
                    <button class="btn btn-primary" disabled>
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                    <button class="btn btn-outline-primary" disabled>REAGENDAR</button>
                    <button class="btn btn-light-primary" disabled>CANCELAR</button>
                `;
                break;
        }

        $('.patient-modal__footer').html(content);
        attachEventsToModal(status);
    };

    var buildFooterToStatusAtPatient = function(status) {
        let content;

        switch(status) {
            case('Agendada'):
                content = `
                    <button class="btn btn-primary" disabled>
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                    <button class="btn btn-outline-primary">REAGENDAR</button>
                    <button class="btn btn-light-primary cancel-button">CANCELAR</button>
                `;
                break;
            case('Finalizada'):
                content = `
                        <button class="btn btn-primary appointment-cancel-button">
                        <span>PSICÓLOGO NÃO COMPARECEU</span>
                    </button>
                `;
                break;
            case('Em andamento'):
                content = `
                    <button class="btn btn-primary video-button">
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                `;
                break;
            // case('Aguardando Psicólogo'):
            //     content = `
            //         <button class="btn btn-primary" disabled>
            //             <span class="material-icons-outlined">videocam</span>
            //             <span>INICIAR TERAPIA</span>
            //         </button>
            //         <button class="btn btn-outline-primary">REAGENDAR</button>
            //         <button class="btn btn-light-primary cancel-button">CANCELAR</button>
            //     `;
            //     break;
            default:
                content = `
                    <button class="btn btn-primary" disabled>
                        <span class="material-icons-outlined">videocam</span>
                        <span>INICIAR TERAPIA</span>
                    </button>
                    <button class="btn btn-outline-primary" disabled>REAGENDAR</button>
                    <button class="btn btn-light-primary" disabled>CANCELAR</button>
                `;
                break;
        }

        $('.patient-modal__footer').html(content);
        attachEventsToModal(status);        
    };

    var attachEventsToModal = function(status) {
        if (status == "Agendada" || (status == "Aguardando Psicólogo" && userRole == 1))
            cancelEvents();

        if (status == "Em andamento")
            videoEvents();

        if (status == "Finalizada" && userRole == 1)
            updateStatusEvents();
    };

    var cancelEvents = function() {
        $('.cancel-button').off().on({
            'click' : function() {
                modalConfirmation('cancelAppointment', function() {
                    removeAppointment();
                });
            }
        });
    };

    var videoEvents = function() {
        $('.video-button').off().on({
            'click' : function() {
                $(patientModalContainer).modal('hide');
                window.open('/videocall','Video Call', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width='+ window.screen.width +',height='+ window.screen.height +',left=0,top=0');
            }
        });
    };

    var updateStatusEvents = function() {
        var appointmentCallback = function () {
            $.ajax({
                method: "POST",
                url: _BASE_URL_+'api/change_appointment_status_to_therapist',
                data: {
                    'appointment_id': selectedAppointmentId,
                    'therapist_id': selectedAppointment.therapist_id,
                    'status': 7
                },
                error: function(data, status, jqXHR) {
                    var message = data['responseJSON']['appointment_id'];
                    snackbar.show(message, 'error');
                }
            }).done(function(data, textStatus, jqXHR) {
                if (jqXHR.status === 200) {
                    $(patientModalContainer).modal('hide');
                    snackbar.show('Agendamento modificado com sucesso!', 'success');
                    appointments.updateAppointment(data);
                }
            });
        };

        $('.appointment-cancel-button').off().on({
            'click' : function() {
                modalConfirmation('changeAppointment', function () {
                    appointmentCallback();
                });
            }
        });
    };

    var modalConfirmation = function(modalName, callback) {
        $(patientModalContainer).modal('hide');
        $(confirmModalContainer).modal('show');

        switch(modalName) {
            case ('cancelAppointment') :
                $('.confirm_title').html('Consulta Agendada');
                $('.confirm_text').html('Deseja realmente cancelar esse agendamento?');
                break;
            case ('changeAppointment') :
                $('.confirm_title').html('Consulta Finalizada');
                $('.confirm_text').html('O psicólogo realmente não compareceu?');
                break;
        }

        $('#confirm_cancel').off().on({
            'click' : function () {
                $(confirmModalContainer).modal('hide');
                $(patientModalContainer).modal('show');
            }
        });

        $('#confirm_ok').off().on({
            'click' : function () {
                $(confirmModalContainer).modal('hide');
                callback.call();
            }
        })
    };

    var removeAppointment = function() {
        $.ajax({
            method: "POST",
            url: _BASE_URL_+'api/cancel_appointment',
            data: {
                'appointment_id': selectedAppointmentId,
                'user_role': userRole
            },
            error: function(data, status, jqXHR) {
                const message = data.responseJSON.appointment_id;
                snackbar.show(message, 'error');
            }
        }).done(function(data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                $(patientModalContainer).modal('hide');
                snackbar.show('Agendamento cancelado com sucesso!', 'success');
                appointments.updateAppointment(data);
            }
        });
    };

    var changeStatus = function(config) {
        var { id } = config;

        $.ajax({
            method: "POST",
            url: _BASE_URL_+'api/change_appointment_status',
            data: {
                'appointment_id': selectedAppointmentId,
                'status': id
            },
            error: function(data, status, jqXHR) {
                var message = data['responseJSON']['appointment_id'];
                snackbar.show(message, 'error');
            }
        }).done(function(data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                $(patientModalContainer).modal('hide');
                snackbar.show('Agendamento modificado com sucesso!', 'success');
                appointments.updateAppointment(data);
            }
        });
    };

    return {
        init: init,
        populateModal: (appointment) => populateModal(appointment),
        changeStatus: function(config) {
            changeStatus(config);
        }
    }
})();

function changeStatusPatient(config) {
    patientModal.changeStatus(config);
}

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

var play_video_modal = (function(){
	var loaded = false;

	var init = function init(){
		cl('[play_video_modal] initializing...');
		
		$('.play_video').on('click',function() {
			var id_modal = $(this).data().bsTarget;
			$(id_modal + ' video')[0].play();
		});

		$('video').closest('.modal').on('hidden.bs.modal', function () {
			$(this).find('video')[0].pause();
		});

		cl('[play_video_modal] initiated.');
	};

	return {
		init: init
	}
})();
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
var searchPage = (function(){
	var loaded = false;

	var init = function init(){
		cl('[searchPage] initializing...');

		$('.btn_filter').on('click', function(e){
			e.preventDefault();
			$('.filter_container').slideToggle();
			$('#homeSearch').toggleClass('filter_active');
		});

		$('.form-select').select2({
			'language': {
		       	'noResults': function(){
		           return "Nenhum resultado encontrado.";
		       	}
		   	},
		});

		
		cl('[searchPage] initiated.');
	};

	return {
		init: init
	}
})();
var select_share = (function(){
	var loaded = false;

	var init = function init(){
		cl('[select_share] initializing...');

        function change_icon() {
            var icon = $('.icon_select select option:selected').data().icon;
            $('.icon_select .icon').html(icon);
        }

        change_icon();

        $(document).on('change','.icon_select select',function(){
            change_icon();
        });
		
		cl('[select_share] initiated.');
	};

	return {
		init: init
	}
})();
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
var sliders = (function(){
	var loaded = false;

	var init = function init(){
		cl('[sliders] initializing...');
		
		$('.intro-slider').slick({
			dots: true,
			arrows: false,
			infinite: true,
			fade: true,
			cssEase: 'linear',
			autoplay: true,
			autoplaySpeed: 4000,
			pauseOnHover: false,
			adaptiveHeight: true
		});

		cl('[sliders] initiated.');
	};

	return {
		init: init
	}
})();
var snackbar = (function(){
    var toastInstance;

    var init = function() {
        var toastElement = document.querySelector('.toast-element');

        if (!toastElement)
            initComponent();
    };

    var initComponent = function() {
        var content = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast align-items-center" id="toast-element" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <span class="material-icons-outlined toast-icon"></span>
                        <strong class="me-auto toast-title"></strong>
                        <button type="button" class="material-icons toast-close" data-bs-dismiss="toast" aria-label="Close">close</button>
                    </div>
                    <div class="toast-body"></div>
                </div>
            </div>
      `;

      $('body').append(content);

      var toastEl = document.getElementById('toast-element');
      new bootstrap.Toast(toastEl, {autohide: true});
      toastInstance = bootstrap.Toast.getInstance(toastEl);
    };

    var show = function(message, type) {
        var toastContainer = document.getElementsByClassName('toast-container');
        var toastEl = document.getElementById('toast-element');
        $(toastContainer).show();
        $(toastEl).removeClass('bg-success bg-danger text-white');
        $(toastEl).find('.toast-header').removeClass('text-danger text-success');

        if (type == 'error') {
            $(toastEl).find('.toast-title').html('Erro!');
            $(toastEl).find('.toast-icon').html('error_outline');
            $(toastEl).find('.toast-header').addClass('text-danger');
            $(toastEl).addClass('bg-danger text-white');
        }

        if (type == 'success') {
            $(toastEl).find('.toast-title').html('Successo!');
            $(toastEl).find('.toast-icon').html('check_circle');
            $(toastEl).find('.toast-header').addClass('text-success');
            $(toastEl).addClass('bg-success text-white');
        }

        $(toastEl).find('.toast-body').html(message);

        toastInstance.show();
    }

    return {
        init: function() {
            return init();
        },
        show: function(message, type) {
            return show(message, type);
        }
    }
})();
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
var tables = (function(){
	var loaded = false;

	var init = function init(){
		cl('[tables] initializing...');


		$('.customDataTable').each(function(){
			$(this).DataTable( {
		        scrollX:        true,
		        scrollCollapse: false,
		        paging:         true,
		        order: [[ 0, "desc" ]]
	    	} );
		});

		
		cl('[tables] initiated.');
	};

	return {
		init: init
	}
})();
var toast = (function(){
    var init = function() {
        $('.toast').toast('show');
    };

    return {
        init: init
    }
})();