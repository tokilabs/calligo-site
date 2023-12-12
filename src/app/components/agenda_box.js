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