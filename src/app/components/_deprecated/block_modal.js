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