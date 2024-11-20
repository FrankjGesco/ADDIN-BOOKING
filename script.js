document.addEventListener('DOMContentLoaded', function () {
    console.log("Initializing SSO login...");

    function initializeSSO() {
        geotab.addin.sso = function (api, state, addInDone) {
            geotab.login({
                database: state.database,
                userName: state.userName,
                sessionId: state.sessionId
            }, function (success) {
                if (success) {
                    console.log("Login successful!");
                    document.getElementById("login-container").classList.add("hidden");
                    document.getElementById("main-content").classList.remove("hidden");
                    loadVehicles(api); // Carica i veicoli dopo il login
                    addInDone();
                } else {
                    console.error("Login failed. Please try again.");
                    document.getElementById("login-container").innerHTML = `
                        <h1>Login Failed</h1>
                        <p>Please refresh the page and try again.</p>
                    `;
                }
            });
        };
    }

    function initializeFlatpickr() {
        try {
            flatpickr("#start-date", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                defaultDate: "today",
                minDate: "today",
            });
            flatpickr("#start-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
            flatpickr("#end-date", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                defaultDate: "today",
                minDate: "today",
            });
            flatpickr("#end-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
        } catch (error) {
            console.error("Error initializing Flatpickr:", error);
        }
    }

    function loadVehicles(api) {
        api.call("Get", {
            typeName: "Device"
        }, function (devices) {
            const vehicleSelect = $("#vehicle-select");
            vehicleSelect.empty();
            vehicleSelect.append('<option value="" disabled selected>Select a vehicle</option>');
            devices.forEach(device => {
                if (device.licensePlate) {
                    vehicleSelect.append(`<option value="${device.id}">${device.licensePlate}</option>`);
                }
            });
        }, function (error) {
            console.error("Error fetching vehicles:", error);
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

    initializeSSO();
    initializeFlatpickr();

    $("#search-vehicle").on("input", filterVehicles);
    $("#book-vehicle").on("click", bookVehicle);
    $("#close-popup").on("click", closePopup);
});
