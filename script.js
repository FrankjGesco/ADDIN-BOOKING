document.addEventListener('DOMContentLoaded', function () {
    console.log("Document loaded, initializing script...");

    function initializeFlatpickr() {
        try {
            flatpickr("#start-date", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                defaultDate: "today",
                minDate: "today",
            });
            console.log("Flatpickr initialized for #start-date");

            flatpickr("#start-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
            console.log("Flatpickr initialized for #start-time");

            flatpickr("#end-date", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                defaultDate: "today",
                minDate: "today",
            });
            console.log("Flatpickr initialized for #end-date");

            flatpickr("#end-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
            console.log("Flatpickr initialized for #end-time");
        } catch (error) {
            console.error("Error initializing Flatpickr:", error);
        }
    }

    function loadVehicles() {
        const sessionId = "wGpX02zwHHrMMmba4gk-PA";
        const apiUrl = "https://my.fleet.vodafoneautomotive.com/apiv1";

        $.ajax({
            url: apiUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                method: "Get",
                params: {
                    typeName: "Device",
                    credentials: {
                        database: "vf_experimentation",
                        userName: "francesco.forlasi@vodafone.com",
                        sessionId: sessionId
                    }
                },
                id: 1
            }),
            success: function (response) {
                const devices = response.result;
                const vehicleSelect = $("#vehicle-select");
                vehicleSelect.empty();
                vehicleSelect.append('<option value="" disabled selected>Select a vehicle</option>');
                devices.forEach(device => {
                    if (device.licensePlate) {
                        vehicleSelect.append(`<option value="${device.id}">${device.licensePlate}</option>`);
                    }
                });
            }
        });
    }

    function filterVehicles() {
        const searchText = $("#search-vehicle").val().toLowerCase();
        $("#vehicle-select option").each(function () {
            const licensePlate = $(this).text().toLowerCase();
            $(this).toggle(licensePlate.includes(searchText) || $(this).is(':disabled'));
        });
    }

    function bookVehicle() {
        const selectedVehicle = $("#vehicle-select").val();
        const selectedLicensePlate = $("#vehicle-select option:selected").text();
        const startDate = $("#start-date").val();
        const startTime = $("#start-time").val();
        const endDate = $("#end-date").val();
        const endTime = $("#end-time").val();

        if (!selectedVehicle) {
            alert("Please select a vehicle to book.");
            return;
        }

        if (!startDate || !startTime || !endDate || !endTime) {
            alert("Please complete all date and time fields.");
            return;
        }

        const bookingDetails = `
            <p><strong>Vehicle:</strong> ${selectedLicensePlate}</p>
            <p><strong>Start:</strong> ${startDate} at ${startTime}</p>
            <p><strong>End:</strong> ${endDate} at ${endTime}</p>
        `;
        $("#popup-result").html(bookingDetails);
        $("#popup-container").removeClass("hidden");
    }

    function closePopup() {
        $("#popup-container").addClass("hidden");
        $("#popup-result").empty();
    }

    initializeFlatpickr();
    loadVehicles();
    $("#search-vehicle").on("input", filterVehicles);
    $("#book-vehicle").on("click", bookVehicle);
    $("#close-popup").on("click", closePopup);
});
