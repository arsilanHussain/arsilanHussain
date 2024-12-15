$(document).ready(function() {

    // Aria Hidden
    document.addEventListener("DOMContentLoaded", function () {
        const modals = document.querySelectorAll('.modal');
        const body = document.body;
        modals.forEach(modal => {
            modal.addEventListener('show.bs.modal', function () {
                this.removeAttribute('aria-hidden');
                body.setAttribute('inert', '');
            });
            modal.addEventListener('hidden.bs.modal', function () {
                this.setAttribute('aria-hidden', 'true');
                body.removeAttribute('inert');
            });
        });
    });    
    // Aria Hidden
    
    // Search Functionality
    $("#searchInp").on("keyup", function() {
        const searchValue = $(this).val().toLowerCase();
        const activeTabId = $("#myTab .active").attr("id");
        let tableRows;
        if (activeTabId === "personnelBtn") tableRows = $("#personnelTableBody tr");
        else if (activeTabId === "departmentsBtn") tableRows = $("#departmentTableBody tr");
        else if (activeTabId === "locationsBtn") tableRows = $("#locationTableBody tr");
        tableRows.each(function() {
            const rowText = $(this).text().toLowerCase();
            const isVisible = rowText.indexOf(searchValue) > -1;
            $(this).toggle(isVisible);
        });
    });
    // Search Functionality

    //AJAX request
    const ajaxRequest = (url, method, data, onSuccess, onError) => {
        $.ajax({
            url: url,
            type: method || "GET",
            contentType: "application/json",
            data: JSON.stringify(data || {}),
            dataType: "json",
            success: onSuccess,
            error: onError || function(xhr) {
                console.error(`Failed to process request for ${url}. Error:`, xhr.responseText);
                alert(`Failed to process request for ${url}`);
            }
        });
    };
    //AJAX request

    // Preloader
    $(document).ready(function() {
        const preloader = document.getElementById("preloader");
        if (!preloader) {
            console.error("Preloader element not found!");
            return;
        }
        $(window).on("load", function() {
            hidePreloader(preloader);
        });
        setTimeout(() => {
            if (preloader.style.display !== "none") {
                console.warn("Forcing preloader to hide after timeout.");
                hidePreloader(preloader);
            }
        }, 10000);
    });

    function hidePreloader(preloader) {
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    };
    // Preloader

    // Populate dropdown
    const populateDropdown = (dropdown, data, selectedValue = null) => {
        dropdown.empty();
        data.forEach(item => {
            const option = new Option(item.text, item.value);
            dropdown.append(option);
        });
        if (selectedValue !== null) {
            dropdown.val(selectedValue);
        }
    };
    // Populate dropdown

    // Load Data
    const loadTableData = (url, tableBody, createRowCallback) => {
        ajaxRequest(url, "GET", null, (response) => {
            if (response.status.code === 200) {
                tableBody.empty();
                response.data.forEach(item => tableBody.append(createRowCallback(item)));
            } else {
                alert("Failed to load data.");
            }
        });
    };
    // Load Data

    // Load Dropdowns
    const loadDepartmentDropdown = (dropdown, locationID, selectedDepartmentID = null, callback = null) => {
        const url = locationID ?
            `libs/php/getDepartmentsByLocation.php?locationID=${locationID}` :
            "libs/php/getAllDepartments.php";
        ajaxRequest(url, "GET", null, (response) => {
            if (response.status.code === 200) {
                const departments = response.data.map(dept => ({
                    value: dept.id,
                    text: dept.name
                }));
                populateDropdown(dropdown, departments, selectedDepartmentID);
                if (callback) callback();
            } else {
                console.error("Failed to load departments:", response.status.description);
            }
        });
    };

    const loadFilterDepartmentDropdown = (dropdown) => {
        const url = "libs/php/getAllDepartments.php";
        ajaxRequest(url, "GET", null, (response) => {
            if (response.status.code === 200) {
                const departments = response.data.map(dept => ({
                    value: dept.departmentID,
                    text: dept.departmentName
                }));
                populateDropdown(dropdown, departments, null);
            } else {
                console.error("Failed to load departments for filter:", response.status.description);
            }
        });
    };

    const loadLocationDropdown = (dropdown, selectedLocationID = null, callback = null) => {
        ajaxRequest('libs/php/getAllLocations.php?', "GET", null, (response) => {
            if (response.status.code === 200) {
                const locations = response.data.map(loc => ({
                    value: loc.id,
                    text: loc.name
                }));
                populateDropdown(dropdown, locations, selectedLocationID);
                if (callback) callback();
            } else {
                console.error("Failed to load locations:", response.status.description);
            }
        });
    };
    $("#personnelLocationDropdown").on("change", function() {
        const selectedLocation = $(this).val();
        const departmentDropdown = $("#departmentLocationDropdown");

        if (!selectedLocation) {
            console.log("No location selected. Resetting department dropdown.");
            departmentDropdown.empty().append('<option value="">Choose location first</option>');
            return;
        }
        ajaxRequest("libs/php/getAllDepartments.php", "GET", null, (response) => {
            if (response.status.code === 200) {
                const matchingDepartments = response.data.filter(dept => dept.locationID == selectedLocation);

                departmentDropdown.empty().append('<option value="">Select Department</option>');
                populateDropdown(departmentDropdown, matchingDepartments.map(dept => ({
                    value: dept.departmentID,
                    text: dept.departmentName
                })));
            } else {
                alert("Failed to load departments.");
            }
        });
    });
    // Load Dropdowns

    // Refresh Button
    $("#refreshBtn").click(() => {
        const activeTabId = $("#myTab .active").attr("id");
        if (activeTabId === "personnelBtn") {
            loadPersonnelData();
        } else if (activeTabId === "departmentsBtn") {
            loadDepartmentData();
        } else if (activeTabId === "locationsBtn") {
            loadLocationData();
        }
    });
    // Refresh Button

    // Filter modal
    $("#filterBtn").click(() => {
        const activeTabId = $("#myTab .active").attr("id");
        $("#filterLocationDropdown, #filterDepartmentDropdown").val("");
        if (activeTabId === "locationsBtn") {
            $("#filterDepartmentDropdown").parent().hide();
            loadLocationDropdown($("#filterLocationDropdown"));
        } else {
            $("#filterDepartmentDropdown").parent().show();
            loadLocationDropdown($("#filterLocationDropdown"));
            loadFilterDepartmentDropdown($("#filterDepartmentDropdown"));
        }
        $("#filterModal").modal("show");
    });

    // Filter modal (Apply)
    $(document).on("click", "#applyFilterBtn", () => {
        const selectedDepartment = $("#filterDepartmentDropdown").val();
        const selectedLocation = $("#filterLocationDropdown").val();
        const activeTabId = $("#myTab .active").attr("id");

        if (activeTabId === "personnelBtn") {
            $("#personnelTableBody tr").each(function() {
                const deptId = $(this).data("department-id");
                const locId = $(this).data("location-id");
                const matchesDept = !selectedDepartment || String(deptId) === String(selectedDepartment);
                const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
                $(this).toggle(matchesDept && matchesLoc);
            });
        } else if (activeTabId === "departmentsBtn") {
            $("#departmentTableBody tr").each(function() {
                const deptId = $(this).data("department-id");
                const locId = $(this).data("location-id");
                const matchesDept = !selectedDepartment || String(deptId) === String(selectedDepartment);
                const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
                $(this).toggle(matchesDept && matchesLoc);
            });
        } else if (activeTabId === "locationsBtn") {
            $("#locationTableBody tr").each(function() {
                const locId = $(this).data("location-id");
                const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
                $(this).toggle(matchesLoc);
            });
        }
        $("#filterModal").modal("hide");
    });
    // Filter modal

    // Add Button
    $("#addBtn").click(() => {
        const activeTabId = $("#myTab .active").attr("id");

        if (activeTabId === "personnelBtn") {
            $("#addPersonnelForm")[0].reset();
            $("#personnelLocationDropdown, #departmentLocationDropdown").empty().append('<option value="">Choose location first</option>');
            loadLocationDropdown($("#personnelLocationDropdown"));
            $("#addPersonnelModal").modal("show");
        } else if (activeTabId === "departmentsBtn") {
            $("#addDepartmentForm")[0].reset();
            $("#departmentLocationID").empty().append('<option value="">Select</option>');
            loadLocationDropdown($("#departmentLocationID"));
            $("#addDepartmentModal").modal("show");
        } else if (activeTabId === "locationsBtn") {
            $("#addLocationForm")[0].reset();
            $("#addLocationModal").modal("show");
        }
    });
    // Add Form Submission (Personnel)
    $("#addPersonnelForm").submit(function(e) {
        e.preventDefault();
        const selectedLocation = $("#personnelLocationDropdown").val();
        const selectedDepartment = $("#departmentLocationDropdown").val();
        if (!selectedLocation || !selectedDepartment) {
            alert("Please select a valid location and department.");
            return;
        }
        const data = {
            firstName: $("#firstName").val().trim(),
            lastName: $("#lastName").val().trim(),
            email: $("#email").val().trim(),
            departmentID: parseInt(selectedDepartment, 10),
            locationID: parseInt(selectedLocation, 10)
        };
        ajaxRequest("libs/php/insertPersonnel.php", "POST", data, () => {
            loadPersonnelData();
            $("#addPersonnelModal").modal("hide");
        });
    });
    // Add Form Submission (Department)
    $("#addDepartmentForm").submit(function(e) {
        e.preventDefault();
        const data = {
            name: $("#deptName").val().trim(),
            locationID: parseInt($("#departmentLocationID").val(), 10)
        };
        ajaxRequest("libs/php/insertDepartment.php", "POST", data, () => {
            loadDepartmentData();
            $("#addDepartmentModal").modal("hide");
        });
    });
    // Add Form Submission (Location)
    $("#addLocationForm").submit(function(e) {
        e.preventDefault();
        const data = {
            name: $("#locationName").val().trim()
        };
        ajaxRequest("libs/php/insertLocation.php", "POST", data, () => {
            loadLocationData();
            $("#addLocationModal").modal("hide");
        });
    });
    // Add Button

    // Load Data To Table
    const loadPersonnelData = () => {
        loadTableData("libs/php/getAllPersonnel.php", $("#personnelTableBody"), person => `
            <tr data-department-id="${person.departmentID}" data-location-id="${person.locationID}" data-id="${person.id}">
                <td>${person.firstName || "N/A"} ${person.lastName || "N/A"}</td>
                <td>${person.email || "N/A"}</td>
                <td>${person.department || "N/A"}</td>
                <td>${person.location || "N/A"}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${person.id}" data-type="personnel">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${person.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    };

    const loadDepartmentData = () => {
        loadTableData("libs/php/getAllDepartments.php", $("#departmentTableBody"), dept => `
            <tr data-department-id="${dept.departmentID}" data-location-id="${dept.locationID}" data-id="${dept.departmentID}">
                <td>${dept.departmentName || "N/A"}</td>
                <td>${dept.locationName || "N/A"}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${dept.departmentID}" data-type="department">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${dept.departmentID}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    };

    const loadLocationData = () => {
        loadTableData("libs/php/getAllLocations.php", $("#locationTableBody"), loc => `
            <tr data-location-id="${loc.id}" data-id="${loc.id}">
                <td>${loc.name || "N/A"}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${loc.id}" data-type="location">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${loc.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    };
    // Load Data To Table

    // Edit Modal
    function populateEditModal(type, data) {
        switch (type) {
            case "personnel":
                $("#editPersonnelEmployeeID").val(data.id);
                $("#editPersonnelFirstName").val(data.firstName);
                $("#editPersonnelLastName").val(data.lastName);
                $("#editPersonnelEmailAddress").val(data.email);
                ajaxRequest(
                    `libs/php/getLocationById.php?id=${data.locationID}`,
                    "GET",
                    null,
                    (response) => {
                        if (response.status.code === 200) {
                            const location = response.data;
                            loadLocationDropdown($("#editPersonnelLocation"), location.id, () => {
                                loadDepartmentDropdown($("#editPersonnelDepartment"), location.id, null, () => {
                                    $("#editPersonnelDepartment option").each(function() {
                                        if ($(this).text() === data.departmentName) {
                                            $(this).prop("selected", true);
                                        }
                                    });
                                });
                            });
                        } else {
                            console.error("Failed to fetch location:", response.status.description);
                        }
                    },
                    (error) => {
                        console.error("Error fetching location:", error);
                    }
                );
                $("#editPersonnelLocation").off("change").on("change", function() {
                    const locationID = $(this).val();
                    loadDepartmentDropdown($("#editPersonnelDepartment"), locationID);
                });
                $("#editPersonnelModal").modal("show");
                break;
            case "department":
                $("#editDepartmentID").val(data.departmentID);
                $("#editDepartmentName").val(data.departmentName);
                ajaxRequest(
                    `libs/php/getLocationById.php?id=${data.locationID}`,
                    "GET",
                    null,
                    (response) => {
                        if (response.status.code === 200) {
                            const location = response.data;
                            loadLocationDropdown($("#editDepartmentLocation"), location.id);
                        } else {
                            console.error("Failed to fetch location for department:", response.status.description);
                        }
                    },
                    (error) => {
                        console.error("Error fetching location for department:", error);
                    }
                );
                $("#editDepartmentModal").modal("show");
                break;
            case "location":
                $("#editLocationID").val(data.id);
                $("#editLocationName").val(data.name);
                $("#editLocationModal").modal("show");
                break;
            default:
                console.error("Unknown type for editing:", type);
        }
    }

    // Edit Button (Event)
    $(document).on("click", ".edit-btn", function() {
        const id = $(this).data("id");
        const type = $(this).data("type");
        if (!id || !type) {
            console.error("Edit button clicked, but ID or type is missing:", {
                id,
                type
            });
            alert("Error: Missing ID or type for editing.");
            return;
        }
        const urlMap = {
            personnel: "libs/php/getPersonnelById.php",
            department: "libs/php/getDepartmentById.php",
            location: "libs/php/getLocationById.php",
        };
        const url = urlMap[type];
        if (!url) {
            console.error("Unknown type:", type);
            return;
        }
        $.ajax({
            url: url,
            type: "GET",
            data: {
                id: id
            },
            success: function(response) {
                if (response.status && response.status.code === 200) {
                    populateEditModal(type, response.data);
                } else {
                    console.error(`Failed to fetch ${type} details:`, response.status.description);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Error fetching ${type} data:`, xhr.responseText);
            }
        });
    });

    function handleEdit(type, formSelector) {
        const formData = Object.fromEntries(new FormData(document.querySelector(formSelector)).entries());
        formData.type = type;
        $.ajax({
            url: "libs/php/edit_handler.php",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function(response) {
                if (response.status && response.status.code === 200) {
                    $(`#editPersonnelModal, #editDepartmentModal, #editLocationModal`).modal("hide");
                    reloadData(type);
                } else {
                    console.error("Error updating data:", response.status.description);
                }
            },
            error: function(xhr) {
                console.error("AJAX Error:", xhr.responseText);
            }
        });
    }
    $("#editPersonnelForm").submit(function(e) {
        e.preventDefault();
        handleEdit("personnel", "#editPersonnelForm");
    });
    $("#editDepartmentForm").submit(function(e) {
        e.preventDefault();
        handleEdit("department", "#editDepartmentForm");
    });
    $("#editLocationForm").submit(function(e) {
        e.preventDefault();
        handleEdit("location", "#editLocationForm");
    });
    // Edit Modal


    // Reload data
    function reloadData(type) {
        const reloadMap = {
            personnel: loadPersonnelData,
            department: loadDepartmentData,
            location: loadLocationData,
        };
        const reloadFunction = reloadMap[type];
        if (reloadFunction) {
            reloadFunction();
        } else {
            console.error("Unknown type for reload:", type);
        }
    }
    // Reload data

    // Delete Button
    $(document).on("click", ".delete-btn", function() {
        const id = $(this).data("id");
        const name = $(this).data("name");
        const activeTab = $(".tab-pane.show.active").attr("id");
        let modalId, deleteBtnId, apiUrl, reloadFunction;
        switch (activeTab) {
            case "personnel-tab-pane":
                modalId = "#deletePersonnelModal";
                deleteBtnId = "#deletePersonnelBtn";
                apiUrl = "libs/php/delete_personnel.php";
                reloadFunction = loadPersonnelData;
                $("#deletePersonnelID").val(id);
                $("#employeeName").text(name);
                break;
            case "departments-tab-pane":
                modalId = "#deleteDepartmentModal";
                deleteBtnId = "#deleteDepartmentBtn";
                apiUrl = "libs/php/delete_department.php";
                reloadFunction = loadDepartmentData;
                $("#deleteDepartmentID").val(id);
                $("#departmentName").text(name);
                break;
            case "locations-tab-pane":
                modalId = "#deleteLocationModal";
                deleteBtnId = "#deleteLocationBtn";
                apiUrl = "libs/php/delete_location.php";
                reloadFunction = loadLocationData;
                $("#deleteLocationID").val(id);
                $("#locationName").text(name);
                break;
            default:
                console.error("Unknown active tab:", activeTab);
                return;
        }

        $(modalId).modal("show");
        $(modalId).find(deleteBtnId).off("click").on("click", function() {
            if (!id) {
                alert("No ID provided for deletion.");
                return;
            }
            fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status.code === 200) {
                        $(modalId).modal("hide");
                        reloadFunction();
                    } else {
                        alert(`Error deleting record: ${data.status.description}`);
                    }
                })
                .catch((error) => {
                    console.error("Error during delete request:", error);
                    alert("An error occurred while processing the deletion.");
                });
        });
    });
    // Delete Button

    //Load Data
    loadPersonnelData();
    loadDepartmentData();
    loadLocationData();
    //Load Data

});