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
