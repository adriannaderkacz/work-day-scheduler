$(document).ready(function () {

    // Displays the current day and time at the top of the scheduler.
    function displayTime() {
        $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY'));
        $('#currentTime').text(dayjs().format('HH:mm:ss'));
    }

    // Refreshes the display of the current time every second.
    setInterval(displayTime, 1000);

    // Updates the background color of time blocks to indicate whether the time is in the past, present, or future.
    function updateHour() {
        let currentHour = dayjs().hour();
        let timeBlocks = $('.time-block');

        timeBlocks.each(function() {
            let blockHour = parseInt($(this).attr('id'));
            if (currentHour > blockHour) {
                $(this).addClass('past');
            } else if(currentHour === blockHour) {
                $(this).removeClass('past').addClass('present');
            } else {
                $(this).removeClass('past present').addClass('future');
            }
        });
    }

    // Checks the time block status every 15 seconds to update its class based on the current time.
    updateHour();
    setInterval(updateHour, 15000);

    // Toggles the icon state between saved (fa-duotone) and unsaved (fa-light), and updates localStorage accordingly.
    function updateAndSaveIconState(button, hour) {
        var icon = button.find('i');
        var isDuotone = icon.hasClass('fa-duotone');

        if (isDuotone) {
            icon.removeClass('fa-duotone').addClass('fa-light');
            // Marks the hour as unsaved in localStorage and removes any saved text for this hour.
            localStorage.setItem('iconState' + hour, 'false');
            localStorage.removeItem(hour);
        } else {
            icon.removeClass('fa-light').addClass('fa-duotone');
            // Marks the hour as saved in localStorage and saves the text.
            localStorage.setItem('iconState' + hour, 'true');
            let text = button.siblings('.description').val();
            localStorage.setItem(hour, text);
        }
    }

    // Populates textareas with saved data and updates icon states based on saved preferences when the page loads.
    function populateTextAreasAndIcons() {
        for (let i = 9; i <= 18; i++) {
            let value = localStorage.getItem(i);
            let iconState = localStorage.getItem('iconState' + i) === 'true';
            let hourBlock = $('#' + i);
            let button = hourBlock.find('.saveBtn');

            // Applies saved icon states and text, clearing textareas where the save state is not true.
            if (iconState) {
                button.find('i').removeClass('fa-light').addClass('fa-duotone');
                hourBlock.children('.description').val(value);
            } else {
                button.find('i').addClass('fa-light').removeClass('fa-duotone');
                hourBlock.children('.description').val('');
            }
        }
    }
    
    // Attaches click event listeners to save buttons to toggle save state and save/delete text.
    $('.saveBtn').click(function () {
        let hour = $(this).parent().attr('id');
        updateAndSaveIconState($(this), hour);
    });

    // Initializes the scheduler with saved data and correct icon states.
    populateTextAreasAndIcons();
});
