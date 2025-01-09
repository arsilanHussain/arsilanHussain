$(document).ready(function()
{
   // Aria Hidden
   document.addEventListener("DOMContentLoaded", function()
   {
      const modals = document.querySelectorAll('.modal');
      const body = document.body;
      modals.forEach(modal =>
      {
         modal.addEventListener('show.bs.modal', function()
         {
            this.removeAttribute('aria-hidden');
            body.setAttribute('inert', '');
         });
         modal.addEventListener('hidden.bs.modal', function()
         {
            this.setAttribute('aria-hidden', 'true');
            body.removeAttribute('inert');
         });
      });
   });
   // Aria Hidden

   // Search Functionality
   $("#searchInp").on("keyup", function()
   {
      const searchValue = $(this).val().toLowerCase();
      const activeTabId = $("#myTab .active").attr("id");
      let tableRows;
      if (activeTabId === "personnelBtn")
      {
         tableRows = $("#personnelTableBody tr");
      }
      else if (activeTabId === "departmentsBtn")
      {
         tableRows = $("#departmentTableBody tr");
      }
      else if (activeTabId === "locationsBtn")
      {
         tableRows = $("#locationTableBody tr");
      }
      tableRows.each(function()
      {
         const rowText = $(this).text().toLowerCase();
         const isVisible = rowText.indexOf(searchValue) > -1;
         $(this).toggle(isVisible);
      });
   });
   $("#searchInp").on("blur", function()
   {
      $(this).val("");
   });
   // Search Functionality

   //AJAX request
   const ajaxRequest = (url, method, data, onSuccess, onError) =>
   {
      $.ajax(
      {
         url: url,
         type: method || "GET",
         contentType: "application/json",
         data: JSON.stringify(data ||
         {}),
         dataType: "json",
         success: onSuccess,
         error: onError || function(xhr)
         {
            console.error(`Failed to process request for ${url}. Error:`, xhr.responseText);
            alert(`Failed to process request for ${url}`);
         }
      });
   };
   //AJAX request

   // Preloader
   $(document).ready(function()
   {
      const preloader = document.getElementById("preloader");
      if (!preloader)
      {
         console.error("Preloader element not found!");
         return;
      }
      $(window).on("load", function()
      {
         hidePreloader(preloader);
      });
      setTimeout(() =>
      {
         if (preloader.style.display !== "none")
         {
            console.warn("Forcing preloader to hide after timeout.");
            hidePreloader(preloader);
         }
      }, 10000);
   });

   function hidePreloader(preloader)
   {
      setTimeout(() =>
      {
         preloader.style.display = "none";
      }, 500);
   };
   // Preloader

   // Populate dropdown
   const populateDropdown = (dropdown, data, selectedValue = null) =>
   {
      dropdown.empty();
      data.forEach(item =>
      {
         const option = new Option(item.text, item.value);
         dropdown.append(option);
      });
      if (selectedValue !== null)
      {
         dropdown.val(selectedValue);
      }
   };
   // Populate dropdown

   // Load Data
   const loadTableData = (url, tableBody, createRowCallback) =>
   {
      ajaxRequest(url, "GET", null, (response) =>
      {
         if (response.status.code === 200)
         {
            const fragment = document.createDocumentFragment();
            response.data.forEach(item =>
            {
               const row = createRowCallback(item);
               fragment.appendChild($(row)[0]);
            });
            tableBody.empty().append(fragment);
         }
         else
         {
            alert("Failed to load data.");
         }
      });
   };
   // Load Data

   // Load Dropdown's
   // Load Location Dropdown
   function loadLocationDropdown(dropdown, selectedLocationID = null, callback = null)
   {
      ajaxRequest("libs/php/getAllLocations.php", "GET", null, (response) =>
      {
         const locations = response.data.map(location => (
         {
            value: location.id,
            text: location.name
         }));
         populateDropdown(dropdown, locations, selectedLocationID);
         if (callback) callback();
      });
   }
   // Load Department Dropdown
   function loadDepartmentDropdown(dropdownElement, selectedID = null, callback = null)
   {
      $.ajax(
      {
         url: "libs/php/getAllDepartments.php",
         type: "GET",
         success: function(response)
         {
            if (response.status.code === 200)
            {
               const departments = response.data;
               dropdownElement.empty().append('<option value="">Choose department</option>');
               departments.forEach(department =>
               {
                  dropdownElement.append(`<option value="${department.departmentID}" ${
                            department.departmentID == selectedID ? "selected" : ""
                        }>${department.departmentName}</option>`);
               });
               if (callback) callback();
            }
            else
            {
               console.error("Failed to load departments:", response.status.description);
            }
         },
         error: function()
         {
            console.error("Error fetching departments.");
         }
      });
   }
   // Load Filter Department Dropdown
   function loadFilterDepartmentDropdown(dropdown, addAllOption = false)
   {
      ajaxRequest("libs/php/getAllDepartments.php", "GET", null, (response) =>
      {
         const departments = response.data.map(department => (
         {
            value: department.departmentID,
            text: department.departmentName
         }));
         populateDropdown(dropdown, departments, null);
         if (addAllOption)
         {
            dropdown.prepend('<option value="">All</option>').val("");
         }
      });
   }
   // Load Dropdown's

   // Refresh modal
   $("#refreshBtn").click(() =>
   {
      refreshActiveTab();
   });
   $("#myTab .nav-link").on("shown.bs.tab", function()
   {
      refreshActiveTab();
   });

   function refreshActiveTab()
   {
      $("#searchInp").val("");
      const activeTabId = $("#myTab .active").attr("id");
      if (activeTabId === "personnelBtn")
      {
         loadPersonnelData();
      }
      else if (activeTabId === "departmentsBtn")
      {
         loadDepartmentData();
      }
      else if (activeTabId === "locationsBtn")
      {
         loadLocationData();
      }
   }
   // Refresh modal

   // Filter modal
   $("#filterModal").on("show.bs.modal", () =>
   {
      const activeTabId = $("#myTab .active").attr("id");
      const locationDropdown = $("#filterLocationDropdown");
      const departmentDropdown = $("#filterDepartmentDropdown");
      locationDropdown.val("");
      departmentDropdown.val("");
      if (activeTabId === "locationsBtn")
      {
         departmentDropdown.parent().hide();
         locationDropdown.parent().show();
         loadLocationDropdown(locationDropdown, null, () =>
         {
            locationDropdown.prepend('<option value="">All</option>').val("");
         });
      }
      else if (activeTabId === "personnelBtn")
      {
         departmentDropdown.parent().show();
         locationDropdown.parent().show();
         loadLocationDropdown(locationDropdown, null, () =>
         {
            locationDropdown.prepend('<option value="">All</option>').val("");
         });
         loadFilterDepartmentDropdown(departmentDropdown, true);
      }
      else if (activeTabId === "departmentsBtn")
      {
         departmentDropdown.parent().hide();
         locationDropdown.parent().show();
         loadLocationDropdown(locationDropdown, null, () =>
         {
            locationDropdown.prepend('<option value="">All</option>').val("");
         });
      }
   });
   $("#filterDepartmentDropdown").on("change", function()
   {
      const selectedDepartment = $(this).val();
      $("#filterLocationDropdown").val("");
      if ($("#myTab .active").attr("id") === "personnelBtn")
      {
         $("#personnelTableBody tr").each(function()
         {
            const deptId = $(this).data("department-id");
            const matchesDept = !selectedDepartment || String(deptId) === String(selectedDepartment);
            $(this).toggle(matchesDept);
         });
      }
   });
   $("#filterLocationDropdown").on("change", function()
   {
      const selectedLocation = $(this).val();
      $("#filterDepartmentDropdown").val("");
      const activeTabId = $("#myTab .active").attr("id");
      if (activeTabId === "personnelBtn")
      {
         $("#personnelTableBody tr").each(function()
         {
            const locId = $(this).data("location-id");
            const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
            $(this).toggle(matchesLoc);
         });
      }
      else if (activeTabId === "departmentsBtn")
      {
         $("#departmentTableBody tr").each(function()
         {
            const locId = $(this).data("location-id");
            const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
            $(this).toggle(matchesLoc);
         });
      }
      else if (activeTabId === "locationsBtn")
      {
         $("#locationTableBody tr").each(function()
         {
            const locId = $(this).data("location-id");
            const matchesLoc = !selectedLocation || String(locId) === String(selectedLocation);
            $(this).toggle(matchesLoc);
         });
      }
   });
   $("#filterModal").on("hidden.bs.modal", () =>
   {
      $("#filterLocationDropdown, #filterDepartmentDropdown").val("");
   });
   // Filter modal

   // Add modal
   $("#addPersonnelModal").on("show.bs.modal", () =>
   {
      loadDepartmentDropdown($("#departmentLocationDropdown"));
   });
   $("#addDepartmentModal").on("show.bs.modal", () =>
   {
      loadLocationDropdown($("#departmentLocationID"));
   });
   $("#addPersonnelModal, #addDepartmentModal, #addLocationModal").on("hidden.bs.modal", function()
   {
      const form = $(this).find("form")[0];
      if (form) form.reset();
   });
   $("#addBtn").click(() =>
   {
      const activeTabId = $("#myTab .active").attr("id");
      if (activeTabId === "personnelBtn")
      {
         $("#addPersonnelModal").modal(
         {
            backdrop: false,
            keyboard: true
         }).modal("show");
      }
      else if (activeTabId === "departmentsBtn")
      {
         $("#addDepartmentModal").modal(
         {
            backdrop: false,
            keyboard: true
         }).modal("show");
      }
      else if (activeTabId === "locationsBtn")
      {
         $("#addLocationModal").modal(
         {
            backdrop: false,
            keyboard: true
         }).modal("show");
      }
   });
   $("#addPersonnelForm").submit(function(e)
   {
      e.preventDefault();
      const selectedDepartment = $("#departmentLocationDropdown").val();
      if (!selectedDepartment)
      {
         alert("Please select a valid department.");
         return;
      }
      const data = {
         firstName: $("#firstName").val().trim(),
         lastName: $("#lastName").val().trim(),
         email: $("#email").val().trim(),
         jobTitle: $("#jobTitle").val().trim(),
         departmentID: parseInt(selectedDepartment, 10),
      };
      ajaxRequest("libs/php/insertPersonnel.php", "POST", data, () =>
      {
         loadPersonnelData();
         $("#addPersonnelModal").modal("hide");
      });
   });
   $("#addDepartmentForm").submit(function(e)
   {
      e.preventDefault();
      const data = {
         name: $("#deptName").val().trim(),
         locationID: parseInt($("#departmentLocationID").val(), 10)
      };
      ajaxRequest("libs/php/insertDepartment.php", "POST", data, () =>
      {
         loadDepartmentData();
         $("#addDepartmentModal").modal("hide");
      });
   });
   $("#addLocationForm").submit(function(e)
   {
      e.preventDefault();
      const data = {
         name: $("#locationName").val().trim()
      };
      ajaxRequest("libs/php/insertLocation.php", "POST", data, () =>
      {
         loadLocationData();
         $("#addLocationModal").modal("hide");
      });
   });
   // Add modal

   // Load Table Date
   // Load Personnel Data
      const loadPersonnelData = () => {
      loadTableData("libs/php/getAllPersonnel.php", $("#personnelTableBody"), (person) => {
       const row = document.createElement("tr");
       row.setAttribute("data-department-id", person.departmentID);
       row.setAttribute("data-location-id", person.locationID);
       row.setAttribute("data-id", person.id);
       const nameCell = document.createElement("td");
       nameCell.textContent = `${person.firstName || "N/A"} ${person.lastName || "N/A"}`;
       row.appendChild(nameCell);
       const emailCell = document.createElement("td");
       emailCell.textContent = person.email || "N/A";
       emailCell.classList.add("d-none", "d-md-table-cell"); 
       row.appendChild(emailCell);
       const departmentCell = document.createElement("td");
       departmentCell.textContent = person.department || "N/A";
       departmentCell.classList.add("d-none", "d-md-table-cell");
       row.appendChild(departmentCell);
       const locationCell = document.createElement("td");
       locationCell.textContent = person.location || "N/A";
       locationCell.classList.add("d-none", "d-md-table-cell"); 
       row.appendChild(locationCell);
       const actionsCell = document.createElement("td");
       actionsCell.classList.add("text-end");
       const editButton = document.createElement("button");
       editButton.classList.add("btn", "btn-primary", "btn-sm", "edit-btn", "me-2");
       editButton.setAttribute("data-bs-toggle", "modal");
       editButton.setAttribute("data-bs-target", "#editPersonnelModal");
       editButton.setAttribute("data-id", person.id);
       editButton.setAttribute("data-type", "personnel");
       editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
       actionsCell.appendChild(editButton);
       const deleteButton = document.createElement("button");
       deleteButton.classList.add("btn", "btn-primary", "btn-sm", "delete-btn");
       deleteButton.setAttribute("data-id", person.id); 
       deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
       actionsCell.appendChild(deleteButton);
       row.appendChild(actionsCell);
       return row;
      });
       };

      // Load Department Data
      const loadDepartmentData = () => {
      loadTableData("libs/php/getAllDepartments.php", $("#departmentTableBody"), (dept) => {
       const row = document.createElement("tr");
       row.setAttribute("data-department-id", dept.departmentID);
       row.setAttribute("data-location-id", dept.locationID);
       row.setAttribute("data-id", dept.departmentID);
       const nameCell = document.createElement("td");
       nameCell.textContent = dept.departmentName || "N/A";
       row.appendChild(nameCell);
       const locationCell = document.createElement("td");
       locationCell.textContent = dept.locationName || "N/A";
       locationCell.classList.add("d-none", "d-md-table-cell"); 
       row.appendChild(locationCell);
       const actionsCell = document.createElement("td");
       actionsCell.classList.add("text-end");
       const editButton = document.createElement("button");
       editButton.classList.add("btn", "btn-primary", "btn-sm", "edit-btn", "me-2");
       editButton.setAttribute("data-bs-toggle", "modal");
       editButton.setAttribute("data-bs-target", "#editDepartmentModal");
       editButton.setAttribute("data-id", dept.departmentID);
       editButton.setAttribute("data-type", "department");
       editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
       actionsCell.appendChild(editButton);
       const deleteButton = document.createElement("button");
       deleteButton.classList.add("btn", "btn-primary", "btn-sm", "delete-btn");
       deleteButton.setAttribute("data-id", dept.departmentID); 
       deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
       actionsCell.appendChild(deleteButton);
       row.appendChild(actionsCell);
       return row;
         });
         };

      // Load Location Data
      const loadLocationData = () => {
      loadTableData("libs/php/getAllLocations.php", $("#locationTableBody"), (loc) => {
       const row = document.createElement("tr");
       row.setAttribute("data-location-id", loc.id);
       row.setAttribute("data-id", loc.id);
       const nameCell = document.createElement("td");
       nameCell.textContent = loc.name || "N/A";
       row.appendChild(nameCell);
       const actionsCell = document.createElement("td");
       actionsCell.classList.add("text-end");
       const editButton = document.createElement("button");
       editButton.classList.add("btn", "btn-primary", "btn-sm", "edit-btn", "me-2");
       editButton.setAttribute("data-bs-toggle", "modal");
       editButton.setAttribute("data-bs-target", "#editLocationModal");
       editButton.setAttribute("data-id", loc.id);
       editButton.setAttribute("data-type", "location");
       editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
       actionsCell.appendChild(editButton);
       const deleteButton = document.createElement("button");
       deleteButton.classList.add("btn", "btn-primary", "btn-sm", "delete-btn");
       deleteButton.setAttribute("data-id", loc.id); 
       deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
       actionsCell.appendChild(deleteButton);
       row.appendChild(actionsCell);
       return row;
         });
   };
   // Load Table Date

   // Edit Modal
   function populateEditModal(type, data)
   {
      switch (type)
      {
         case "personnel":
            $("#editPersonnelEmployeeID").val(data.id);
            $("#editPersonnelFirstName").val(data.firstName);
            $("#editPersonnelLastName").val(data.lastName);
            $("#editPersonnelEmailAddress").val(data.email);
            $("#editPersonnelJobTitle").val(data.jobTitle || "");
            loadDepartmentDropdown($("#editPersonnelDepartment"), data.departmentID);
            break;
         case "department":
            $("#editDepartmentID").val(data.departmentID);
            $("#editDepartmentName").val(data.departmentName);
            loadLocationDropdown($("#editDepartmentLocation"), data.locationID);
            break;
         case "location":
            $("#editLocationID").val(data.id);
            $("#editLocationName").val(data.name);
            break;
         default:
            console.error("Unknown type for editing:", type);
      }
   }

   function handleEdit(type, formSelector)
   {
      const formData = Object.fromEntries(new FormData(document.querySelector(formSelector)).entries());
      formData.type = type;
      $.ajax(
      {
         url: "libs/php/edit_handler.php",
         type: "POST",
         data: JSON.stringify(formData),
         contentType: "application/json",
         success: function(response)
         {
            if (response.status.code === 200)
            {
               $(`#edit${capitalize(type)}Modal`).modal("hide");
               reloadData(type);
            }
            else
            {
               alert(`Error updating ${type}: ${response.status.description}`);
            }
         },
      });
   }

   function capitalize(str)
   {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }
   $(document).on("click", ".edit-btn", function()
   {
      const id = $(this).data("id");
      const type = $(this).data("type");
      const urlMap = {
         personnel: "libs/php/getPersonnelById.php",
         department: "libs/php/getDepartmentById.php",
         location: "libs/php/getLocationById.php",
      };
      $.ajax(
      {
         url: urlMap[type],
         type: "GET",
         data:
         {
            id
         },
         success: function(response)
         {
            if (response.status.code === 200)
            {
               populateEditModal(type, response.data);
               $(`#edit${capitalize(type)}Modal`).modal("show");
            }
            else
            {
               alert(`Failed to fetch ${type} details: ${response.status.description}`);
            }
         },
      });
   });
   $("#editPersonnelModal").on("show.bs.modal", function()
   {
      const personnelID = $("#editPersonnelEmployeeID").val();
      if (personnelID)
      {
         loadDepartmentDropdown($("#editPersonnelDepartment"));
      }
   });
   $("#editDepartmentModal").on("show.bs.modal", function()
   {
      const departmentID = $("#editDepartmentID").val();
      if (departmentID)
      {
         loadLocationDropdown($("#editDepartmentLocation"));
      }
   });
   $("#editLocationModal").on("show.bs.modal", function() {});
   $(".modal").on("hidden.bs.modal", function()
   {
      const form = $(this).find("form")[0];
      if (form) form.reset();
      $(this).find("select").empty().append('<option value="">Choose an option</option>');
   });
   $("#editPersonnelForm").submit(function(e)
   {
      e.preventDefault();
      handleEdit("personnel", "#editPersonnelForm");
   });
   $("#editDepartmentForm").submit(function(e)
   {
      e.preventDefault();
      handleEdit("department", "#editDepartmentForm");
   });
   $("#editLocationForm").submit(function(e)
   {
      e.preventDefault();
      handleEdit("location", "#editLocationForm");
   });
   // Edit Modal

   // Reload data
   function reloadData(type)
   {
      const reloadMap = {
         personnel: loadPersonnelData,
         department: loadDepartmentData,
         location: loadLocationData,
      };
      const reloadFunction = reloadMap[type];
      if (reloadFunction)
      {
         reloadFunction();
      }
      else
      {
         console.error("Unknown type for reload:", type);
      }
   }
   // Reload data

   // Delete modal
   $(document).ready(function () {
      $(document).on("click", ".delete-btn", function () {
          const id = $(this).data("id");
          const activeTab = $(".tab-pane.show.active").attr("id");
  
          const settings = getDeleteSettings(activeTab);
  
          if (!settings) {
              console.error(`Unsupported tab for delete operation. Active Tab: ${activeTab}`);
              return;
          }
  
          const { checkDependenciesUrl, fetchDetailsUrl, deleteModal, cantDeleteModal, nameField, countField, reloadType } = settings;
  
          if (checkDependenciesUrl) {
              checkDependencies(
                  checkDependenciesUrl,
                  id,
                  cantDeleteModal,
                  nameField,
                  countField,
                  () => fetchDetails(fetchDetailsUrl, id, deleteModal, reloadType)
              );
          } else {
              fetchDetails(fetchDetailsUrl, id, deleteModal, reloadType);
          }
      });
  
      $(document).on("submit", ".delete-form", function (e) {
          e.preventDefault();
  
          const form = $(this);
          const apiUrl = form.data("api-url");
          const id = form.find("input[type=hidden]").val();
          const reloadFunctionName = form.data("reload-function");
  
          const reloadMap = {
              loadPersonnelData: "personnel",
              loadDepartmentData: "department",
              loadLocationData: "location",
          };
  
          const reloadType = reloadMap[reloadFunctionName];
  
          if (!reloadType) {
              console.error(`Unknown reload function: ${reloadFunctionName}`);
              return;
          }
  
          $.ajax({
              url: apiUrl,
              type: "POST",
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({ id }),
              success: function (response) {
                  if (response.status.code === 200) {
                      $(".modal").modal("hide");
                      reloadData(reloadType);
                  } else {
                      alert(`Error deleting entry: ${response.status.description}`);
                  }
              },
              error: function () {
                  alert("Error occurred while deleting. Please try again.");
              },
          });
      });
  
      $("#deletePersonnelModal").on("show.bs.modal", function () {
          const id = $(this).find("input[type=hidden]").val();
          if (!id) console.error("Missing Personnel ID during deletion.");
      });
  
      $("#deleteDepartmentModal").on("show.bs.modal", function () {
          const id = $(this).find("input[type=hidden]").val();
          if (!id) console.error("Missing Department ID during deletion.");
      });
  
      $("#deleteLocationModal").on("show.bs.modal", function () {
          const id = $(this).find("input[type=hidden]").val();
          if (!id) console.error("Missing Location ID during deletion.");
      });
  
      $("#cantDeleteDepartmentModal").on("show.bs.modal", function () {
          const deptName = $("#cantDeleteDeptName").text();
          const personnelCount = $("#personnelCount").text();
          if (!deptName || !personnelCount) {
              console.error("Missing dependency details for Cannot Delete Department modal.");
          }
      });
  
      $("#cantDeleteLocationModal").on("show.bs.modal", function () {
          const locName = $("#cantDeleteLocationName").text();
          const departmentCount = $("#departmentCount").text();
          if (!locName || !departmentCount) {
              console.error("Missing dependency details for Cannot Delete Location modal.");
          }
      });
  
      $("#areYouSureDeleteDepartmentModal").on("show.bs.modal", function () {
          const deptName = $("#areYouSureDeptName").text();
          if (!deptName) console.error("Missing Department Name in Are You Sure modal.");
      });
  
      $("#areYouSurePersonnelModal").on("show.bs.modal", function () {
          const personnelName = $("#areYouSurePersonnelName").text();
          if (!personnelName) console.error("Missing Personnel Name in Are You Sure modal.");
      });
  
      $(".modal").on("hidden.bs.modal", function () {
          $(this).find("input[type=hidden]").val("");
          $(this).find("span").html("");
      });
  
      function getDeleteSettings(activeTab) {
          switch (activeTab) {
              case "departments-tab-pane":
                  return {
                      checkDependenciesUrl: "libs/php/checkDepartmentUse.php",
                      fetchDetailsUrl: "libs/php/getDepartmentById.php",
                      deleteModal: "#deleteDepartmentModal",
                      cantDeleteModal: "#cantDeleteDepartmentModal",
                      nameField: "#cantDeleteDeptName",
                      countField: "#personnelCount",
                      reloadType: "department",
                  };
              case "locations-tab-pane":
                  return {
                      checkDependenciesUrl: "libs/php/checkLocationUse.php",
                      fetchDetailsUrl: "libs/php/getLocationById.php",
                      deleteModal: "#deleteLocationModal",
                      cantDeleteModal: "#cantDeleteLocationModal",
                      nameField: "#cantDeleteLocationName",
                      countField: "#departmentCount",
                      reloadType: "location",
                  };
              case "personnel-tab-pane":
                  return {
                      fetchDetailsUrl: "libs/php/getPersonnelById.php",
                      deleteModal: "#deletePersonnelModal",
                      reloadType: "personnel",
                  };
              default:
                  return null;
          }
      }
  
      function checkDependencies(url, id, cantDeleteModal, nameField, countField, onNoDependencies) {
          $.ajax({
              url: url,
              type: "GET",
              data: { id },
              success: function (response) {
                  if (response.status.code === 200) {
                      const data = response.data;
                      const hasDependencies = data.personnelCount > 0 || data.departmentCount > 0;
  
                      if (hasDependencies) {
                          $(nameField).text(data.departmentName || data.locationName);
                          $(countField).text(data.personnelCount || data.departmentCount);
                          $(cantDeleteModal).modal("show");
                          return;
                      }
                  }
                  onNoDependencies();
              },
              error: function () {
                  alert("Error checking dependencies. Please try again.");
              },
          });
      }
  
      function fetchDetails(url, id, deleteModal, reloadType) {
          $.ajax({
              url: url,
              type: "GET",
              data: { id },
              success: function (response) {
                  if (response.status.code === 200) {
                      const data = response.data;
                      const name = data.firstName
                          ? `${data.firstName} ${data.lastName}`
                          : data.departmentName || data.name || "Unknown Name";
  
                      $(deleteModal).find(".modal-body span").html(`<b>${name}</b>`);
                      $(deleteModal).find("input[type=hidden]").val(id);
                      $(deleteModal).modal("show");
                  }
              },
              error: function () {
                  alert("Error fetching details. Please try again.");
              },
          });
      }
  });
     // Delete modal
   loadPersonnelData();
   loadDepartmentData();
   loadLocationData();
});
