//Table
const tableheading = document.querySelector('.theading');
const tablerows = document.querySelector('.trows');
const itemFilter = document.getElementById('filter');


let allData;
let selectedCheckboxesIds =[];


//render the table for first time
render('./pending.json');

//render Table 
async function render(jsonString){
  const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  allData = await res.json();

  console.log(allData);
  fillUserData(allData.filter((data,index)=>{
    if(index<10){
      return data;
    }
  }));
  pagination(allData,0);
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
    <td><button onclick="updateRow(this, '${id}', ${{...updatedValues}} ) "> ? </button> <button onclick="del('${id}')">X</button></td>`;

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

    row.children[4].innerHTML = `<td><button onclick="updateRow(this, '${id}', ${{...updatedValues}} ) "> ? </button> <button onclick="del('${id}')">X</button></td>`;
  });
  

}


function updateRow(selectElement, id, obj){
  const row = selectElement.parentElement.parentElement;
  const {isChecked,userName, email, role} = obj;
  
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


function pagination(userData, ind){
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <span>${Math.ceil((ind+1)/10.0)} Page of ${Math.ceil(userData.length/10.0)} Pages</span>
    <button class="btn btn-primary" id="first">First</button>
    <button class="btn btn-primary" id="prev">Prev</button>
    <span class="numberButton">${numberedButton(Math.ceil((ind+1)/10.0), Math.ceil(userData.length/10.0))}</span>
    <button class="btn btn-primary" id="next">Next</button>
    <button class="btn btn-primary" id="last">Last</button>
  `;
  document.querySelector('#pagination').innerHTML='';
  document.querySelector('#pagination').appendChild(div);


  //Display Prev Button if on first page
  if(Math.ceil((ind+1)/10.0) === Number(1)){
    document.querySelector('#prev').disabled = true;
  }

  //Display Next Page if on last page
  if(Math.ceil((ind+1)/10.0) === Math.ceil(userData.length/10.0)){
    document.querySelector('#next').disabled = true;
  }

  //Next Page
  document.querySelector('#next').addEventListener('click', async()=>{
    ind+=10;
    const newUserData = userData.filter((data,index)=>{
      if(ind<=index&&ind+10>index){
        return data;
      }
    });
    fillUserData(newUserData);
    // console.log(userData,newUserData,ind);
    pagination(userData,ind);
  });

  //Last
  document.querySelector('#last').addEventListener('click', async()=>{
    ind = (userData.length%10==0)?userData.length-10:Math.floor(userData.length/10)*10;
    const newUserData = userData.filter((data,index)=>{
      if(index>=ind){
        return data;
      }
    });
    fillUserData(newUserData);
    pagination(userData,ind);
  });

  //Prev Page
  document.querySelector('#prev').addEventListener('click', async()=>{
    ind-=10;
    const newUserData = userData.filter((data,index)=>{
      if(ind<=index&&ind+10>index){
        return data;
      }
    });
    fillUserData(newUserData);
    pagination(userData,ind);

  });

  //First
  document.querySelector('#first').addEventListener('click', async()=>{
    ind = 0;
    const newUserData = userData.filter((data,index)=>{
      if(index>=ind&&index<ind+10){
        return data;
      }
    });
    fillUserData(newUserData);
    pagination(userData,ind);
  });

  // numbered buttons
  document.querySelector('.numberButton').addEventListener('click',function(e){
    ind = (Number(e.target.id)-1)*10;
    const newUserData = userData.filter((data,index)=>{
      if(index>=ind&&index<ind+10){
        return data;
      }
    });
    fillUserData(newUserData);
    pagination(userData,ind);

  })
  
}

function numberedButton(ind,total){
  const fBtn = (Math.floor(ind/50)*5)+1;
  const lBtn = Math.min((Math.floor(ind/50)*5+1+4),total);
  let str = '';
  for(let i=fBtn;i<=lBtn;i++){
    str+= `<button id ='${i}' class="btn btn-primary">${i}</button>`
  }
  return str;
}