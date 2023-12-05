// Selecting DOM elements
const tableRows = document.querySelector('.trows'); // Table rows container
const searchInputFilter = document.querySelector('.search-icon'); // Search input field

// Variables for managing data and pagination
let initialData; // Holds initial data fetched from API
let selectedRowIds = []; // Array to store IDs of selected rows
let ind = 0; // Index for pagination
const rowsPerPage = 10; // Number of rows per page

// Fetch initial data for the table from the API
getAdminRowsData('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');

// Function to fetch data from the API and initialize the table
async function getAdminRowsData(apiUrl) {
  try {
    const res = await fetch(apiUrl);
    if (res.status !== 200) {
      alert('API response Failed');
      return;
    }
    initialData = await res.json();

    // Update the table with the initial data and set up pagination
    updateTable(initialData.filter((data, index) => {
      if (index < rowsPerPage) {
        return data;
      }
    }));
    updatePaginationContainer(initialData);
  } catch {
    console.log('API response Failed');
  }
}

// Update the table with the provided user data
function updateTable(userData) {
  // Clear the existing table rows
  tableRows.innerHTML = '';
  // Generate HTML for each row and append to the table
  userData.forEach(element => {
    tableRows.innerHTML += `
      <tr>
        <!-- Checkbox for row selection -->
        <td><input type='checkbox' id='${element.id}' onchange="updateHeaderCheckBox()"></td>
        <!-- Display user information -->
        <td>${element.name}</td>
        <td>${element.email}</td>
        <td>${element.role}</td>
        <!-- Buttons for editing and deleting rows -->
        <td>
          <button class="edit" onclick="editRow(this, '${element.id}')">
            <i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i>
          </button>
          <button class="delete" onclick="deleteSelectedRows('${element.id}')">
            <i class="fa-solid fa-trash" style="color: #FF7F7F;"></i>
          </button>
        </td>
      </tr>`;
  });
  updateHeaderCheckBox(); // Update the header checkbox status
}

// Function to update the header checkbox based on row selection
function updateHeaderCheckBox() {
  // Get all checked rows and total rows
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
  const allRows = document.querySelectorAll('.trows input[type="checkbox"]');
  const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');

  masterCheckbox.checked = false;

  // Update the header checkbox status based on the number of selected rows
  if (checkedRows.length === allRows.length && allRows.length !== 0) {
    masterCheckbox.checked = true;
  }

  // Update the count of selected items and their highlighting
  document.querySelector('.selected-result').innerHTML = `${checkedRows.length} item(s) selected from ${initialData.length} item(s)`;

  //changed color of selected rows and undo of unselected rows
  allRows.forEach((row) => {
    row.parentElement.parentElement.style.backgroundColor = '#fff';
  })
  checkedRows.forEach((row) => {
    row.parentElement.parentElement.style.backgroundColor = '#dadada';
  })

}


// Function to select all rows at once
function selectAllRows() {
  // Select or deselect all rows based on the header checkbox state
  const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]');
  checkedRows.forEach(function (checkbox) {
    checkbox.checked = masterCheckbox.checked;
  })

  // Update the count of selected items and their highlighting
  document.querySelector('.selected-result').innerHTML = `${masterCheckbox.checked ? checkedRows.length : 0} item(s) selected from ${initialData.length} item(s)`;
  checkedRows.forEach((row) => {
    row.parentElement.parentElement.style.backgroundColor = masterCheckbox.checked ? '#dadada' : '#fff';
  })
}

// Function to delete all selected rows
function deleteAllRows() {
  // Get all checked rows and delete them
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');

  checkedRows.forEach(function (checkbox) {
    deleteSelectedRows(checkbox.id);
  });

  // Update the table and pagination after deletion
  if (searchInputFilter.value === '') {
    updateTable(initialData.filter((data, index) => {
      if (index >= ind && index < rowsPerPage + ind) {
        return data;
      }
    }));
    updatePaginationContainer(initialData);
  }
  else {
    const text = searchInputFilter.value.toLowerCase();
    let filterUserData = initialData.filter((itm) => {

      if (JSON.stringify(itm.name).toLowerCase().includes(text) | JSON.stringify(itm.email).toLowerCase().includes(text) | JSON.stringify(itm.role).toLowerCase().includes(text) | JSON.stringify(itm.id).toLowerCase().includes(text)) {
        return itm;
      }

    });


    updateTable(filterUserData.filter((data, index) => {
      if (ind <= index && index < rowsPerPage + ind) {
        return data;
      }
    }));
    updatePaginationContainer(filterUserData);
  }


}

// Function to delete a specific row by ID
function deleteSelectedRows(id) {
  // Delete the row with the given ID from the data
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
  selectedRowIds = [];
  checkedRows.forEach((checkbox) => {
    if (checkbox.id !== id)
      selectedRowIds.push(checkbox.id);
  });

  initialData = initialData.filter((data) => {
    if (data.id !== id) {
      return true;
    }
  });

  // Update the table and pagination after deletion
  if (searchInputFilter.value === '') {

    updateTable(initialData.filter((data, index) => {
      if (index >= ind && index < rowsPerPage + ind) {
        return data;
      }
    }));

    retainSelectedRows();
    updatePaginationContainer(initialData);
  }
  else {
    const text = searchInputFilter.value.toLowerCase();
    let filterUserData = initialData.filter((itm) => {

      if (JSON.stringify(itm.name).toLowerCase().includes(text) | JSON.stringify(itm.email).toLowerCase().includes(text) | JSON.stringify(itm.role).toLowerCase().includes(text) | JSON.stringify(itm.id).toLowerCase().includes(text)) {
        return itm;
      }

    });

    updateTable(filterUserData.filter((data, index) => {
      if (ind <= index && index < rowsPerPage + ind) {
        return data;
      }
    }));

    retainSelectedRows();
    updatePaginationContainer(filterUserData);

  }

}


// Function to retain selected rows after an action (like deletion or pagination change)
function retainSelectedRows() {
  // Retain the selection status of rows based on selectedRowIds array
  selectedRowIds.forEach((id) => {
    const checkbox = document.querySelector(`.trows input[type="checkbox"][id='${id}']`);
    checkbox.checked = true;
  })

  // Update the checkboxes and their selection status
  updateHeaderCheckBox();
}

// Event listener for search input to filter items
searchInputFilter.addEventListener('input', filterItems);

// Function to filter items based on search input
function filterItems(e) {
  // Filter items based on the input value in the search box
  const text = e.target.value.toLowerCase();
  let filterUserData = initialData.filter((itm) => {

    if (JSON.stringify(itm.name).toLowerCase().includes(text) | JSON.stringify(itm.email).toLowerCase().includes(text) | JSON.stringify(itm.role).toLowerCase().includes(text) | JSON.stringify(itm.id).toLowerCase().includes(text)) {
      return itm;
    }

  });
  // Update the table with filtered data and pagination
  selectedRowIds = [];
  updateTable(filterUserData.filter((data, index) => {
    if (index < rowsPerPage) {
      return data;
    }
  }));
  ind = 0;
  updatePaginationContainer(filterUserData);
}


// Function to edit a specific row
function editRow(selectElement, id) {
  // Selecting row and its children elements
  const row = selectElement.parentElement.parentElement;
  const element = row.children;

  // Storing initial values of the row fields
  const updatedValues = {
    userName: row.children[1].innerText,
    email: row.children[2].innerText,
    role: row.children[3].innerText,
  };

  // Change color of the selected row
  row.style.backgroundColor = '#dadada';

  // Replace row HTML with input fields for editing
  row.innerHTML = `
    <td><input type='checkbox' id='${id}' checked=${element[0].children[0].checked}></td>
    <td><input type="text" id="userName" placeholder="Enter Name" class="form-input" value='${element[1].innerText}'/></td>
    <td><input type="email" id="email" placeholder="Enter Email" class="form-input" value='${element[2].innerText}'/></td>
    <td><input type="text" id="role" placeholder="Enter Role" class="form-input" value='${element[3].innerText}'/></td>
    <td><button class="save" onclick="updateRow(this, '${id}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}')"><i class="fa-solid fa-check" style="color: #232325;"></i></button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>`;

  // Event listener for input changes to update edited values dynamically
  row.addEventListener('input', (e) => {
    if (e.target.id === 'userName') {
      updatedValues.userName = e.target.value;
    } else if (e.target.id === 'email') {
      updatedValues.email = e.target.value;
    } else if (e.target.id === 'role') {
      updatedValues.role = e.target.value;
    }
    // Update the button in the row to save changes
    row.children[4].innerHTML = `<td><button class="save" onclick="updateRow(this, '${id}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}')"><i class="fa-solid fa-check" style="color: #232325;"></i></button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>`;
  });
}

// Function to update a specific row with edited values
function updateRow(selectElement, id, userName, email, role) {
  // Selecting the row
  const row = selectElement.parentElement.parentElement;
  // Restore row background color
  row.style.backgroundColor = '#fff';

  // Update corresponding data in initialData array
  initialData.forEach((user) => {
    if (user.id === id) {
      user.name = userName;
      user.email = email;
      user.role = role;
    }
  });

  // Update the row with new values
  row.innerHTML = `
    <td><input type='checkbox' id='${id}' onchange="updateHeaderCheckBox()"></td>
    <td>${userName}</td>
    <td>${email}</td>
    <td>${role}</td>
    <td><button class="edit" onclick="editRow(this,'${id}')"><i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i></button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>`;
}




// Function to update the pagination container based on the userData
function updatePaginationContainer(userData) {
  // Check if the current index (ind) exceeds the length of userData and adjust it
  if (ind >= userData.length && ind - rowsPerPage >= 0) {
    ind = ind - rowsPerPage;
    const newUserData = userData.filter((data, index) => {
      if (ind <= index && ind + rowsPerPage > index) {
        return data;
      }
    });
    // Update the table with new user data
    updateTable(newUserData);
  }

  // Create a new div element for the pagination container
  const div = document.createElement('div');
  div.classList.add('updatePaginationContainer');
  // Set HTML content for pagination
  div.innerHTML = `
    <span style="font-size:14px; margin:0 20px">${userData.length ? Math.ceil((ind + 1) / rowsPerPage) : 0} Page of ${Math.ceil(userData.length / rowsPerPage)}</span>
    <button class="btn-pagination" id="first"><i class="fa-solid fa-angles-left"></i></button>
    <button class="btn-pagination" id="prev"><i class="fa-solid fa-angle-left"></i></button>
    <span class="numberButton">${updatePaginationButtons(Math.ceil((ind + 1) / rowsPerPage), Math.ceil(userData.length / rowsPerPage))}</span>
    <button class="btn-pagination" id="next"><i class="fa-solid fa-angle-right"></i></button>
    <button class="btn-pagination" id="last"><i class="fa-solid fa-angles-right"></i></button>
  `;
  // Clear and append the new pagination container to the specified element
  document.querySelector('#updatePaginationContainer').innerHTML = '';
  document.querySelector('#updatePaginationContainer').appendChild(div);

  // Disable Prev and First buttons if on the first page or no pages available
  if (userData.length === 0 || Math.ceil((ind + 1) / rowsPerPage) === Number(1)) {
    document.querySelector('#prev').disabled = true;
    document.querySelector('#first').disabled = true;
  }

  // Disable Next and Last buttons if on the last page or no pages available
  if (userData.length === 0 || Math.ceil((ind + 1) / rowsPerPage) === Math.ceil(userData.length / rowsPerPage)) {
    document.querySelector('#next').disabled = true;
    document.querySelector('#last').disabled = true;
  }

  // Event listeners for pagination buttons to update displayed data
  // Next Page
  document.querySelector('#next').addEventListener('click', async () => {
    ind += rowsPerPage;
    const newUserData = userData.filter((data, index) => {
      if (ind <= index && ind + rowsPerPage > index) {
        return data;
      }
    });
    updateTable(newUserData);
    updatePaginationContainer(userData);
  });

  // Last Page
  document.querySelector('#last').addEventListener('click', async () => {
    ind = (userData.length % rowsPerPage == 0) ? userData.length - rowsPerPage : Math.floor(userData.length / rowsPerPage) * rowsPerPage;
    const newUserData = userData.filter((data, index) => {
      if (index >= ind) {
        return data;
      }
    });
    updateTable(newUserData);
    updatePaginationContainer(userData);
  });

  // Prev Page
  document.querySelector('#prev').addEventListener('click', async () => {
    ind -= rowsPerPage;
    const newUserData = userData.filter((data, index) => {
      if (ind <= index && ind + rowsPerPage > index) {
        return data;
      }
    });
    updateTable(newUserData);
    updatePaginationContainer(userData);
  });

  // First Page
  document.querySelector('#first').addEventListener('click', async () => {
    ind = 0;
    const newUserData = userData.filter((data, index) => {
      if (index >= ind && index < ind + rowsPerPage) {
        return data;
      }
    });
    updateTable(newUserData);
    updatePaginationContainer(userData);
  });

  // Numbered buttons
  document.querySelector('.numberButton').addEventListener('click', function (e) {
    ind = (Number(e.target.id) - 1) * rowsPerPage;
    const newUserData = userData.filter((data, index) => {
      if (index >= ind && index < ind + rowsPerPage) {
        return data;
      }
    });
    updateTable(newUserData);
    updatePaginationContainer(userData);
  })
}

// Function to generate HTML buttons for pagination based on current page and total pages
function updatePaginationButtons(ind, total) {
  const fBtn = Math.floor(ind / (rowsPerPage + 1)) * (rowsPerPage) + 1;
  const lBtn = Math.min(Math.floor(ind / (rowsPerPage + 1)) * (rowsPerPage) + (rowsPerPage), total);
  let str = '';
  for (let i = fBtn; i <= lBtn; i++) {
    str += `<button id ='${i}' class="btn-pagination">${i}</button>`
  }
  return str;
}
