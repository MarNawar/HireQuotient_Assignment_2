//Table
  const tableRows = document.querySelector('.trows');
//Search Filter
  const searchInputFilter = document.querySelector('.search-icon');


  let initialData;
  let selectedRowIds =[];
  let ind = 0;
  const rowsPerPage = 10;


  //getAdminRowsData the table for first time
  getAdminRowsData('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');

  //getAdminRowsData Table 
  async function getAdminRowsData(apiUrl){
    try{
      const res = await fetch(apiUrl);
      if(res.status !== 200){
        alert('API response Failed');
        return;
      }
      initialData = await res.json();

      updateTable(initialData.filter((data,index)=>{
        if(index<rowsPerPage){
          return data;
        }
      }));
      updatePaginationContainer(initialData);
    }
    catch{
      console.log('API response Failed');
    }
    
  }

  function updateTable(userData){
    tableRows.innerHTML ='';
    userData.forEach(element => {
      tableRows.innerHTML +=
      `<tr>
        <td><input type='checkbox' id = '${element.id}' onchange="updateHeaderCheckBox()"></td>
        <td>${element.name}</td>
        <td>${element.email}</td>
        <td>${element.role}</td>
        <td><button class="edit" onclick="editRow(this,'${element.id}')"><i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i></button><button class="delete" onclick="deleteSelectedRows('${element.id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>
      </tr>`
    });
    updateHeaderCheckBox();
  }

  function updateHeaderCheckBox(){
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
    const allRows = document.querySelectorAll('.trows input[type="checkbox"]');
    const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');

    masterCheckbox.checked = false;

    if(checkedRows.length === allRows.length && allRows.length!==0){
      masterCheckbox.checked = true;
    }
    document.querySelector('.selected-result').innerHTML = `${checkedRows.length} item(s) selected from ${initialData.length} item(s)`;
    
    //changed color of selected rows and undo of unselected rows
    allRows.forEach((row)=>{
      row.parentElement.parentElement.style.backgroundColor = '#fff';
    })
    checkedRows.forEach((row)=>{
      row.parentElement.parentElement.style.backgroundColor = '#dadada';
    })
    
  }

  function selectAllRows(){
    const masterCheckbox = document.querySelector('.theading input[type="checkbox"]');
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]');
    checkedRows.forEach(function(checkbox){
      checkbox.checked = masterCheckbox.checked;
    })     
    document.querySelector('.selected-result').innerHTML = `${masterCheckbox.checked?checkedRows.length:0} item(s) selected from ${initialData.length} item(s)`;
    checkedRows.forEach((row)=>{
      row.parentElement.parentElement.style.backgroundColor = masterCheckbox.checked?'#dadada':'#fff';
    })
  }


  function deleteAllRows(){
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked'); 

    checkedRows.forEach(function(checkbox) {
      deleteSelectedRows(checkbox.id);
    });
    
    if(searchInputFilter.value===''){
      updateTable(initialData.filter((data,index)=>{
        if(index>=ind&&index<rowsPerPage+ind){
          return data;
        }
      }));
      updatePaginationContainer(initialData);
    }
    else{
      const text = searchInputFilter.value.toLowerCase();
      let filterUserData = initialData.filter((itm)=>{

        if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
          return itm;
        }

      });


      updateTable(filterUserData.filter((data,index)=>{
        if(ind<=index&&index<rowsPerPage+ind){
          return data;
        }
      }));
      updatePaginationContainer(filterUserData);
    }
    
    
  }

  function deleteSelectedRows(id){ 
    const checkedRows = document.querySelectorAll('.trows input[type="checkbox"]:checked');
    selectedRowIds =[];  
    checkedRows.forEach((checkbox)=>{
      if(checkbox.id!==id)
        selectedRowIds.push(checkbox.id);
    });

    initialData = initialData.filter((data)=>{
      if(data.id!==id){
        return true;
      }
    });

    if(searchInputFilter.value===''){

      updateTable(initialData.filter((data,index)=>{
        if(index>=ind&&index<rowsPerPage+ind){
          return data;
        }
      }));

      retainSelectedRows();
      updatePaginationContainer(initialData);
    }
    else{
      const text = searchInputFilter.value.toLowerCase();
      let filterUserData = initialData.filter((itm)=>{

        if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
          return itm;
        }

      });

      updateTable(filterUserData.filter((data,index)=>{
        if(ind<=index&&index<rowsPerPage+ind){
          return data;
        }
      }));

      retainSelectedRows();
      updatePaginationContainer(filterUserData);

    }

  }

  function retainSelectedRows(){
    selectedRowIds.forEach((id)=>{
      const checkbox = document.querySelector(`.trows input[type="checkbox"][id='${id}']`);
      checkbox.checked = true;
    })
    
    updateHeaderCheckBox();
  }

  searchInputFilter.addEventListener('input', filterItems);
  function filterItems(e){
    const text = e.target.value.toLowerCase();
    let filterUserData = initialData.filter((itm)=>{

      if(JSON.stringify(itm.name).toLowerCase().includes(text)|JSON.stringify(itm.email).toLowerCase().includes(text)|JSON.stringify(itm.role).toLowerCase().includes(text)|JSON.stringify(itm.id).toLowerCase().includes(text)){
        return itm;
      }

    });
    selectedRowIds = [];
    updateTable(filterUserData.filter((data,index)=>{
      if(index<rowsPerPage){
        return data;
      }
    }));
    ind = 0;
    updatePaginationContainer(filterUserData);
  }


  function editRow(selectElement, id){
    const row = selectElement.parentElement.parentElement;
    const element = row.children;
  
    
  
      const updatedValues = {
        userName : row.children[1].innerText,
        email : row.children[2].innerText,
        role : row.children[3].innerText,
      };
      //change color of selected rows
      row.style.backgroundColor = '#dadada';
  
    row.innerHTML = 
      `<td><input type='checkbox' id = '${id}' checked=${element[0].children[0].checked} ></td>
      <td><input type="text" id="userName" placeholder="Enter Name" class="form-input" value='${element[1].innerText}'/>
      </td>
      <td><input type="email" id="email" placeholder="Enter Email" class="form-input" value='${element[2].innerText}'/>
      </td>
      <td><input type="text" id="role" placeholder="Enter Role" class="form-input" value='${element[3].innerText}'/>
      </td>
      <td><button class="save" onclick="updateRow(this, '${id}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> <i class="fa-solid fa-check" style="color: #232325;"></i> </button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>`;
  
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
      row.children[4].innerHTML = `<td><button class="save" onclick="updateRow(this, '${id}', '${updatedValues.userName}', '${updatedValues.email}', '${updatedValues.role}' ) "> <i class="fa-solid fa-check" style="color: #232325;"></i> </button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>`;
    });
    
  
  }
  
  
  function updateRow(selectElement, id, userName, email, role){
    const row = selectElement.parentElement.parentElement;
    row.style.backgroundColor = '#fff';

    
    initialData.forEach((user)=>{
      if(user.id===id){
        user.name = userName;
        user.email = email;
        user.role = role;
      }
    });
  
    row.innerHTML=`
        <td><input type='checkbox' id = '${id}' onchange="updateHeaderCheckBox()"></td>
        <td>${userName}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td><button class="edit" onclick="editRow(this,'${id}')"><i class="fa-regular fa-pen-to-square" style="color: #36383a;"></i></button><button class="delete" onclick="deleteSelectedRows('${id}')"><i class="fa-solid fa-trash" style="color: #FF7F7F;"></i></button></td>
      `
  
  }


  function updatePaginationContainer(userData){
    if(ind>=userData.length&&ind-rowsPerPage>=0){
      ind= ind-rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(ind<=index&&ind+rowsPerPage>index){
          return data;
        }
      });
      updateTable(newUserData);
    }
    
    const div = document.createElement('div');
    div.classList.add('updatePaginationContainer');
    div.innerHTML = `
      <span style="font-size:14px; margin:0 20px">${userData.length?Math.ceil((ind+1)/rowsPerPage):0} Page of ${Math.ceil(userData.length/rowsPerPage)}</span>
      <button class="btn-pagination" id="first"><i class="fa-solid fa-angles-left"></i></button>
      <button class="btn-pagination" id="prev"><i class="fa-solid fa-angle-left"></i></button>
      <span class="numberButton">${updatePaginationButtons(Math.ceil((ind+1)/rowsPerPage), Math.ceil(userData.length/rowsPerPage))}</span>
      <button class="btn-pagination" id="next"><i class="fa-solid fa-angle-right"></i></button>
      <button class="btn-pagination" id="last"><i class="fa-solid fa-angles-right"></i></button>
    `;
    document.querySelector('#updatePaginationContainer').innerHTML='';
    document.querySelector('#updatePaginationContainer').appendChild(div);

  
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
      updateTable(newUserData);
      updatePaginationContainer(userData);
    });

    //Last
    document.querySelector('#last').addEventListener('click', async()=>{
      ind = (userData.length%rowsPerPage==0)?userData.length-rowsPerPage:Math.floor(userData.length/rowsPerPage)*rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind){
          return data;
        }
      });
      updateTable(newUserData);
      updatePaginationContainer(userData);
    });
  
    //Prev Page
    document.querySelector('#prev').addEventListener('click', async()=>{
      ind-=rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(ind<=index&&ind+rowsPerPage>index){
          return data;
        }
      });
      updateTable(newUserData);
      updatePaginationContainer(userData);

    });

    //First
    document.querySelector('#first').addEventListener('click', async()=>{
      ind = 0;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind&&index<ind+rowsPerPage){
          return data;
        }
      });
      updateTable(newUserData);
      updatePaginationContainer(userData);
    });

    // Numbered buttons
    document.querySelector('.numberButton').addEventListener('click',function(e){
      ind = (Number(e.target.id)-1)*rowsPerPage;
      const newUserData = userData.filter((data,index)=>{
        if(index>=ind&&index<ind+rowsPerPage){
          return data;
        }
      });
      updateTable(newUserData);
      updatePaginationContainer(userData);

    })
    
  }

  function updatePaginationButtons(ind,total){

    const fBtn = Math.floor(ind/(rowsPerPage+1))*(rowsPerPage)+1;
    const lBtn = Math.min(Math.floor(ind/(rowsPerPage+1))*(rowsPerPage)+(rowsPerPage),total);
    let str = '';
    for(let i=fBtn;i<=lBtn;i++){
      str+= `<button id ='${i}' class="btn-pagination">${i}</button>`
    }
    return str;
  }