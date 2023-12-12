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