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