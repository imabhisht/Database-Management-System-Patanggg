function start_me(status_query){
    console.log("Fetching data for ",status_query);
    eel.list_order('waiting')(function(ret){
        var listObj = JSON.parse(ret);
        console.log(listObj)
        var personData = []
        for(i=0;i<listObj.length;i++){
            var userObj = JSON.parse(listObj[i]);
            personData.push(userObj)
        }
        console.log(personData)
        loadtableData(personData);
    })   
}
 
function sstart_me(){
    var personData = [];
    personData = [ {userid:"34243234",name:"abhisht",status:"Approved"},
    {userid:"34243234",name:"abhisht",status:"Approved"},
    {userid:"34243234",name:"abhisht",status:"Approved"},
    {userid:"34243234",name:"abhisht",status:"Approved"},
    {userid:"34243234",name:"abhisht",status:"Approved"},];
    console.log("at read_Database");
   loadtableData(personData)                
}

/*window.onload = () => {
    sstart_me()
    };*/
        
function loadtableData(personData){
    const tablebody = document.getElementById('tableData')
    let dataHtml = '';
    for(let person of personData){
        console.log(person.user_id);
        dataHtml += `<tr><td>${person.orderid}</td><td></td><td class="status-table"></td>
        <td class="editstatuscolumn ">
            <div class="dropdown editdropdown">
                <button class="btn btn-primary dropdown-toggle customedit-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Change Status
                <span class="caret"></span></button>
                <ul class="dropdown-menu">
                <li><a onclick="status_change('${person.id}','WaitingForApproval')">WaitingForApproval</a></li>
                <li><a onclick="status_change('${person.id}','Approved')">Approved</a></li>
                <li><a onclick="status_change('${person.id}','Shipping')">Shipping</a></li>
                <li><a onclick="status_change('${person.id}','Shipped')">Shipped</a></li>
                <li><a onclick="status_change('${person.id}','OutForDelivery')">OutForDelivery</a></li>
                <li><a onclick="status_change('${person.id}','Delivered')">Delivered</a></li>
                <li class="divider"></li>
                <li><a onclick="status_change('${person.id}','Cancelled')">Cancelled</a></li>
                <li><a onclick="status_change('${person.id}','Undelivered')">Undelivered</a></li>
                <li><a>Exit</a></li>
                </ul>
            </div>
        </td><td class="editstatuscolumn "><button type="button" class="btn btn-primary more-info-button" onclick="print_info('${person.user_id}','${person.id}')";>More Info</button></td></tr>`;
        
        }

    tablebody.innerHTML = dataHtml;
}

function status_change(product_id,change_query){
    console.log("Request Change in Status: ", change_query , " of ", product_id)
    eel.Change_Status(product_id,change_query)(function(ret){
        if(ret == 'Fail'){
            console.warn("Status Change is Fail. Check FireStore Database to Verify.");
        }else{
            start_me(ret)
        }
    })
}

function print_info(data,data2){
    console.log( data," request info of product id ", data2)
    eel.info_user_details(data,data2)(function(ret){
        var listObj = JSON.parse(ret[0]);
        var listObj2 = JSON.parse(ret[1]);
        var listObj3 = JSON.parse(ret[2]);
        var userData = []
        var dealData = []
        var productData = []
        for(i=0;i<listObj.length;i++){
            var userObj = JSON.parse(listObj[i]);
            userData.push(userObj)
        }
        for(i=0;i<listObj2.length;i++){
            var listObj_temp = JSON.parse(listObj2[i]);
            dealData.push(listObj_temp)
        }
        for(i=0;i<listObj3.length;i++){
            var listObj_temp = JSON.parse(listObj3[i]);
            productData.push(listObj_temp)
        }
        user_info_in_model(userData,dealData,productData)
    })   
}


function user_info_in_model(userData,dealData,productData){
    const modelbody = document.getElementById('myModal')
    let dataHtml = '';
    for(let alpha of userData){
    dataHtml = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><b>User Information: </b><br><br>
                <p><b>Name:</b> ${alpha.first_name} ${alpha.last_name} </p>
                <p><b>Email:</b> ${alpha.user_email} </p>
                <p><b>Phone:</b> ${alpha.user_phone} </p>
                <p><b>Address:</b> ${alpha.user_address} </p>
            </div>
            <div class="modal-body"><b>Products: </b><br><br>`
    for(let s of productData){
        dataHtml += `<p><b>Name of Product:</b> ${s.product_name} , <b>Quantity buy:</b> ${s.product_quantity} , <b>Per Unit Price:</b> ${s.product_origi} </p>`
    }
    dataHtml += `</div><div class="modal-body"><b>Deals: </b><br><br>`
    for(let s of dealData){
        dataHtml += `<p><b>Name of Deal:</b> ${s.deal_name} , <b>Quantity buy:</b> ${s.deal_quantity} , <b>Per Unit Price:</b> ${s.deal_origi} </p>`
    }
    dataHtml += `</div></div></div>`;}
    modelbody.innerHTML = dataHtml;
    $('#myModal').modal('show');

}