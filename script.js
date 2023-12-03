//Table
  const tableheading = document.querySelector('.theading');
  const tablerows = document.querySelector('.trows');
  const itemFilter = document.getElementById('filter');


  let allData;
  let selectedCheckboxesIds =[];
  let ind = 0;
  const rowsPerPage = 10;


  //render the table for first time
  render('./pending.json');

  //render Table 
  async function render(jsonString){
    const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    allData = await res.json();

    // console.log(allData);
    fillUserData(allData.filter((data,index)=>{
      if(index<rowsPerPage){
        return data;
      }
    }));
    pagination(allData);
  }

  function fillUserData(userData){
    tablerows.innerHTML ='';
    userData.forEach(element => {
      tablerows.innerHTML +=
      `<tr>
        <td><input type='checkbox' id = '${element.id}' onchange="chechForMasterSelector()"></td>
        <td>${element.name}</td>
        <td>${element.email}</td>
        <td>${element.role}</td>
        <td><button onclick="editRow(this,'${element.id}')"><i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i></button><button onclick="del('${element.id}')"><i class="fa-solid fa-trash" style="color: #FF0000;"></i></button></td>
      </tr>`
    });
    chechForMasterSelector();
  }

  function chechForMasterSelector(){
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
    const allRows = document.querySelectorAll('.trows input[type="checkbox"]');
    const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');

    masterCheckbox.checked = false;

    if(checkedRows.length === allRows.length && allRows.length!==0){
      masterCheckbox.checked = true;
    }
    document.querySelector('.selected-result').innerHTML = `${checkedRows.length} item(s) selected from ${allData.length} item(s)`;
  }

  function selectedAll(){
    const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]');
    checkedRows.forEach(function(checkbox){
      checkbox.checked = masterCheckbox.checked;
    })     
    document.querySelector('.selected-result').innerHTML = `${masterCheckbox.checked?checkedRows.length:0} item(s) selected from ${allData.length} item(s)`;
    
  }


  function delAll(){
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked'); 

    checkedRows.forEach(function(checkbox) {
      del(checkbox.id);
    });
    
    if(itemFilter.value===''){
      fillUserData(allData.filter((data,index)=>{
        if(index>=ind&&index<rowsPerPage+ind){
          return data;
        }
      }));
      pagination(allData);
    }
    else{
      const text = itemFilter.value.toLowerCase();
      let filterUserData = allData.filter((itm)=>{

        if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
          return itm;
        }

      });


      fillUserData(filterUserData.filter((data,index)=>{
        if(ind<=index&&index<rowsPerPage+ind){
          return data;
        }
      }));
      pagination(filterUserData);
      // console.log(text);
    }
    
    
  }

  function del(id){ 
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
    selectedCheckboxesIds =[];  
    checkedRows.forEach((checkbox)=>{
      if(checkbox.id!==id)
        selectedCheckboxesIds.push(checkbox.id);
    });

    allData = allData.filter((data)=>{
      if(data.id!==id){
        return true;
      }
    });

    if(itemFilter.value===''){

      fillUserData(allData.filter((data,index)=>{
        if(index>=ind&&index<rowsPerPage+ind){
          return data;
        }
      }));

      selectRemaining();
      pagination(allData);
    }
    else{
      const text = itemFilter.value.toLowerCase();
      let filterUserData = allData.filter((itm)=>{

        if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
          return itm;
        }

      });

      fillUserData(filterUserData.filter((data,index)=>{
        if(ind<=index&&index<rowsPerPage+ind){
          return data;
        }
      }));

      selectRemaining();
      pagination(filterUserData);

    }

  }

  function selectRemaining(){
    selectedCheckboxesIds.forEach((id)=>{
      const checkbox = document.querySelector(`.trows input[type="checkbox"][id='${id}']`);
      checkbox.checked = true;
      // console.log(checkbox);
    })
    
    chechForMasterSelector();
  }

  itemFilter.addEventListener('input', filterItems);
  function filterItems(e){
    const text = e.target.value.toLowerCase();
    let filterUserData = allData.filter((itm)=>{

      if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
        return itm;
      }

    });
    selectedCheckboxesIds = [];
    fillUserData(filterUserData.filter((data,index)=>{
      if(index<rowsPerPage){
        return data;
      }
    }));
    ind = 0;
    pagination(filterUserData);
  }


  function editRow(selectElement, id){
    const row = selectElement.parentElement.parentElement;
    const element = row.children;
  
    
   
  
      const updatedValues = {
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
      <td><button onclick="updateRow(this, '${id}', '${updatedValues.isChecked}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> <i class="fa-solid fa-check" style="color: #232325;"></i> </button> <button onclick="del('${id}')"><i class="fa-solid fa-trash" style="color: #FF0000;"></i></button></td>`;
  
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
      row.children[4].innerHTML = `<td><button onclick="updateRow(this, '${id}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> <i class="fa-solid fa-check" style="color: #232325;"></i> </button> <button onclick="del('${id}')"><i class="fa-solid fa-trash" style="color: #FF0000;"></i></button></td>`;
    });
    
  
  }
  
  
  function updateRow(selectElement, id, userName, email, role){
    const row = selectElement.parentElement.parentElement;
    
    allData.forEach((user)=>{
      if(user.id===id){
        user.name = userName;
        user.email = email;
        user.role = role;
      }
    });
  
    row.innerHTML=`
        <td><input type='checkbox' id = '${id}'></td>
        <td>${userName}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td><button onclick="editRow(this,'${id}')"><i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i></button><button onclick="del('${id}')"><i class="fa-solid fa-trash" style="color: #FF0000;"></i></button></td>
      `
  
  }


  function pagination(userData){
    // console.log(ind, userData);
    if(ind>=userData.length&&ind-rowsPerPage>=0){
      ind= ind-rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(ind<=index&&ind+rowsPerPage>index){
          return data;
        }
      });
      fillUserData(newUserData);
    }
    
    // console.log(ind, userData.length, userData);
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
      <span style="font-size:14px; margin:0 20px">${userData.length?Math.ceil((ind+1)/rowsPerPage):0} Page of ${Math.ceil(userData.length/rowsPerPage)} Pages</span>
      <button class="btn btn-primary" id="first"><i class="fa-solid fa-angles-left"></i></button>
      <button class="btn btn-primary" id="prev"><i class="fa-solid fa-angle-left"></i></button>
      <span class="numberButton">${numberedButton(Math.ceil((ind+1)/rowsPerPage), Math.ceil(userData.length/rowsPerPage))}</span>
      <button class="btn btn-primary" id="next"><i class="fa-solid fa-angle-right"></i></button>
      <button class="btn btn-primary" id="last"><i class="fa-solid fa-angles-right"></i></button>
    `;
    document.querySelector('#pagination').innerHTML='';
    document.querySelector('#pagination').appendChild(div);

  
    //Disabled Prev and First Button if on first page or 0 pages
    if(userData.length===0||Math.ceil((ind+1)/rowsPerPage) === Number(1)){
      document.querySelector('#prev').disabled = true;
      document.querySelector('#first').disabled = true;
    }
    
  
    //Disabled Next and Last Button if on last page or 0 pages
    if(userData.length===0||Math.ceil((ind+1)/rowsPerPage) === Math.ceil(userData.length/rowsPerPage)){
      document.querySelector('#next').disabled = true;
      document.querySelector('#last').disabled = true;
    }
  
    //Next Page
    document.querySelector('#next').addEventListener('click', async()=>{
      ind+=rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(ind<=index&&ind+rowsPerPage>index){
          return data;
        }
      });
      fillUserData(newUserData);
      // console.log(userData,newUserData,ind);
      pagination(userData);
    });

    //Last
    document.querySelector('#last').addEventListener('click', async()=>{
      ind = (userData.length%rowsPerPage==0)?userData.length-rowsPerPage:Math.floor(userData.length/rowsPerPage)*rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind){
          return data;
        }
      });
      fillUserData(newUserData);
      pagination(userData);
    });
  
    //Prev Page
    document.querySelector('#prev').addEventListener('click', async()=>{
      ind-=rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(ind<=index&&ind+rowsPerPage>index){
          return data;
        }
      });
      fillUserData(newUserData);
      pagination(userData);

    });

    //First
    document.querySelector('#first').addEventListener('click', async()=>{
      ind = 0;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind&&index<ind+rowsPerPage){
          return data;
        }
      });
      fillUserData(newUserData);
      pagination(userData);
    });

    // numbered buttons
    document.querySelector('.numberButton').addEventListener('click',function(e){
      ind = (Number(e.target.id)-1)*rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind&&index<ind+rowsPerPage){
          return data;
        }
      });
      fillUserData(newUserData);
      pagination(userData);

    })
    
  }

  function numberedButton(ind,total){

    const fBtn = Math.floor(ind/(rowsPerPage+1))*(rowsPerPage)+1;
    const lBtn = Math.min(Math.floor(ind/(rowsPerPage+1))*(rowsPerPage)+(rowsPerPage),total);
    // console.log(fBtn , lBtn , ind , total);
    let str = '';
    for(let i=fBtn;i<=lBtn;i++){
      str+= `<button id ='${i}' class="btn bt n-primary">${i}</button>`
    }
    return str;
  }