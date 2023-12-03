//Table
const tableheading = document.querySelector('.theading');
const tablerows = document.querySelector('.trows');
const itemFilter = document.getElementById('filter');
const openModal = document.getElementById('open');
const closeModal = document.getElementById('close');
const modal = document.getElementById('modal');
const modalForm = document.getElementById('form');
const userIDParagraph = document.getElementById('userID');


let allData;
let selectedCheckboxesIds =[];


//render the table for first time
render('./pending.json');

//render Table 
async function render(jsonString){
  const res = await fetch(jsonString);
  allData = await res.json();

  // console.log(userData);
  fillUserData(allData);
  // pagination(allData);
}

function fillUserData(userData){
  tablerows.innerHTML ='';
  userData.forEach(element => {
    tablerows.innerHTML +=
    `<tr>
      <td><input type='checkbox' id = '${element.id}'></td>
      <td>${element.name}</td>
      <td>${element.email}</td>
      <td>${element.role}</td>
      <td><button onclick="editRow(this,'${element.id}')">+</button><button onclick="del('${element.id}')">X</button></td>
    </tr>`
  });
}

function selectedAll(){
  const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]');
  checkedRows.forEach(function(checkbox){
    checkbox.checked = masterCheckbox.checked;
  })        

}


function delAll(){
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');        
  checkedRows.forEach(function(checkbox) {
    console.log(typeof checkbox.id);
    del(checkbox.id);
  });
}

function del(id){ 
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
  selectedCheckboxesIds =[];  
  checkedRows.forEach((checkbox)=>{
    if(checkbox.id!==id)
      selectedCheckboxesIds.push(checkbox.id);
  })
  allData = allData.filter((data)=>{
    return data.id!==id;
  })
  fillUserData(allData);
  selectRemaining();
}

function selectRemaining(){
  selectedCheckboxesIds.forEach((id)=>{
    const checkbox = document.querySelector(`.trows input[type="checkbox"][id='${id}']`);
    checkbox.checked = true;
    console.log(checkbox);
  })
  const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
  const allRows = document.querySelectorAll('.trows input[type="checkbox"]');
  const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');

  masterCheckbox.checked = false;

  if(checkedRows.length === allRows.length && allRows.length!==0){
    masterCheckbox.checked = true;
  }
}

itemFilter.addEventListener('input', filterItems);
function filterItems(e){
  const text = e.target.value.toLowerCase();
  filterUserData = allData.filter((itm)=>{

    if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
      return itm;
    }

  });
  selectedCheckboxesIds = [];
  fillUserData(filterUserData);
}


function editRow(selectElement, id){
  const row = selectElement.parentElement.parentElement;
  const element = row.children;

  
 

    const updatedValues = {
      isChecked : row.children[0].children[0].checked,
      userName : row.children[1].innerText,
      email : row.children[2].innerText,
      role : row.children[3].innerText,
    };

  row.innerHTML = 
    `<td><input type='checkbox' id = '${id}' checked=${element[0].children[0].checked}></td>
    <td><input type="text" id="userName" placeholder="Enter Name" class="form-input" value='${element[1].innerText}'/>
    </td>
    <td><input type="email" id="email" placeholder="Enter Email" class="form-input" value='${element[2].innerText}'/>
    </td>
    <td><input type="text" id="role" placeholder="Enter Role" class="form-input" value='${element[3].innerText}'/>
    </td>
    <td><button onclick="updateRow(this, '${id}', '${updatedValues.isChecked}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> ? </button> <button onclick="del('${id}')">X</button></td>`;

  row.addEventListener('input', (e)=>{
    if(e.target.id === 'userName'){
      updatedValues.userName = e.target.value;
    }
    else if(e.target.id === 'email'){
      updatedValues.email = e.target.value;
    }
    else if(e.target.id === 'role'){
      updatedValues.role = e.target.value;
    }
    row.children[4].innerHTML = `<td><button onclick="updateRow(this, '${id}', '${updatedValues.isChecked}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> ? </button> <button onclick="del('${id}')">X</button></td>`;
  });
  

}


function updateRow(selectElement, id, isChecked,userName, email, role){
  const row = selectElement.parentElement.parentElement;
  
  allData.forEach((user)=>{
    if(user.id===id){
      user.name = userName;
      user.email = email;
      user.role = role;
    }
  });

  row.innerHTML=`
      <td><input type='checkbox' id = '${id}' checked=${isChecked}></td>
      <td>${userName}</td>
      <td>${email}</td>
      <td>${role}</td>
      <td><button onclick="editRow(this,'${id}')">+</button><button onclick="del('${id}')">X</button></td>
    `

}



// function pagination(userData, ind){
//   const div = document.createElement('div');
//   div.classList.add('pagination');
//   div.innerHTML = `
//     <h3>${Math.floor(ind/10.0)} Page of ${Math.ceil(userData.length/10.0)} Pages</h3>
//     <button class="btn btn-primary" id="first">First</button>
//     <button class="btn btn-primary" id="prev">Prev</button>

//     <button class="btn btn-primary" id="next">Next</button>
//     <button class="btn btn-primary" id="last">Last</button>
//   `;
//   document.querySelector('#pagination').innerHTML='';
//   document.querySelector('#pagination').appendChild(div);

//   //Display Prev Button if on first page
//   if(global.search.page === 1){
//     document.querySelector('#prev').disabled = true;
//   }

//   //Display Next Page if on last page
//   if(global.search.page === global.search.totalPages){
//     document.querySelector('#next').disabled = true;
//   }

//   //Next Page
//   document.querySelector('#next').addEventListener('click', async()=>{
//     global.search.page++;
//     const {results, totalPages} = await searchAPIData();
//     displaySearchResults(results);
//   });

//   //Prev Page
//   document.querySelector('#prev').addEventListener('click', async()=>{
//     global.search.page--;
//     const {results, totalPages} = await searchAPIData();
//     displaySearchResults(results);
//   });
  
// }

// function showModal(id){
//   modal.classList.add('show-modal');
//   allData.forEach((user)=>{
//     if(user.id===id){
//       console.log(modalForm);
//       userIDParagraph.textContent = user.id;
//       modalForm.userName.value = user.name;
//       modalForm.email.value = user.email;
//       modalForm.role.value = user.role;
//     }
//   })
// }

// modalForm.addEventListener('submit',function(e){
//   e.preventDefault();
//   const id = userIDParagraph.textContent;

//   const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
//   selectedCheckboxesIds =[];  
//   checkedRows.forEach((checkbox)=>{
//     selectedCheckboxesIds.push(checkbox.id);
//   });
//   allData.forEach((user)=>{
//     if(user.id===id){
//       user.name = modalForm.userName.value;
//       user.email = modalForm.email.value;
//       user.role = modalForm.role.value;
//     }
//   })
//   fillUserData(allData);
//   selectRemaining();
// });

// window.addEventListener('click',(e)=>{
//   if(e.target===modal){
//     modal.classList.remove('show-modal');
//   }
// })


// function numberedButton(ind , total){
//   if(ind-20>=0&&ind+20<total){
//     console.log('ok');
//     return `<button class="btn btn-primary" id=${ind-20} >${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     <button class="btn btn-primary" id=${ind+20}>${ind+20}</button>
//     `;
//   }
//   else if(ind-30>=0&&ind+10<total&&ind+20>=total){
//     return `<button class="btn btn-primary" id=${ind-30} >${ind-30}</button>
//     <button class="btn btn-primary" id=${ind-20}>${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else if(ind-20>=0&&ind+10<total&&ind+20>=total){
//     return `<button class="btn btn-primary" id=${ind-20}>${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else if(ind-20<0&&ind-10>=0&&ind+10<total&&ind+20>=total){
//     return `
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else if(ind-20<0&&ind-10>=0&&ind+20<total){
//     return `
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     <button class="btn btn-primary" id=${ind+20}>${ind+20}</button>
//     `;
//   }
//   else if(ind-20<0&&ind-10>=0&&ind+10<total){
//     return `
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else if(ind-20<10&&ind-10>=0&&ind<=total){
//     return `
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
//   else if(ind-10<0&&ind+10<=total){
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else if(ind-40>=0&&ind+10>total){
//     return `<button class="btn btn-primary" id=${ind-40}>${ind-40}</button>
//     <button class="btn btn-primary" id=${ind-30} >${ind-30}</button>
//     <button class="btn btn-primary" id=${ind-20}>${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
//   else if(ind-30>=0&&ind+10>total){
//     return `
//     <button class="btn btn-primary" id=${ind-30} >${ind-30}</button>
//     <button class="btn btn-primary" id=${ind-20}>${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
//   else if(ind-20>=0&&ind+10>total){
//     return `
//     <button class="btn btn-primary" id=${ind-20}>${ind-20}</button>
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
//   else if(ind-10>=0&&ind+10>total){
//     return `
//     <button class="btn btn-primary" id=${ind-10}>${ind-10}</button>
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
//   else if(ind-10<0&&ind+40<total){
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     <button class="btn btn-primary" id=${ind+20}>${ind+20}</button>
//     <button class="btn btn-primary" id=${ind+30} >${ind+30}</button>
//     <button class="btn btn-primary" id=${ind+40} >${ind+40}</button>
//     `;
//   }
//   else if(ind-10<0&&ind+30<total){
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     <button class="btn btn-primary" id=${ind+20}>${ind+20}</button>
//     <button class="btn btn-primary" id=${ind+30} >${ind+30}</button>
//     `;
//   }
//   else if(ind-10<0&&ind+20<total){
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     <button class="btn btn-primary" id=${ind+20}>${ind+20}</button>
//     `;
//   }
//   else if(ind-10<0&&ind+10<total){
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     <button class="btn btn-primary" id=${ind+10}>${ind+10}</button>
//     `;
//   }
//   else{
//     return `
//     <button class="btn btn-primary" id=${ind}>${ind}</button>
//     `;
//   }
// }