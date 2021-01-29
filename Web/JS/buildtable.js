window.onload = order_list;
function order_list(){
    eel.list_items()(function(ret){
        var listObj2 = JSON.parse(ret);
        //var listObj = JSON.parse(ret[1]);
        //var dealData = []
        var productData = []
        /*for(i=0;i<listObj.length;i++){
            var listObj_temp = JSON.parse(listObj[i]);
            dealData.push(listObj_temp)
        }*/
        for(i=0;i<listObj2.length;i++){
            var listObj_temp = JSON.parse(listObj2[i]);
            productData.push(listObj_temp)
        }
        console.log(productData)
        print_list(productData)
    })   
}

function print_list(productData){
    const modelbody_product = document.getElementById('tbody-product')
    const modelbody_deal = document.getElementById('tbody-deal')
    let innerhtml_product = '';
    let innerhtml_deals = '';
    var i = 0
    for(alpha in productData){
        i++;
        innerhtml_product += `
        <tr>
            <th scope="row">${i}</th>
            <td>${productData[alpha].item_id}</td>
            <td>${productData[alpha].item_name}</td>
            <td><button type="button" class="btn btn-success" onclick="verify_edit('${productData[alpha].item_id}',${true}  )";>Edit Product</button></td>
            
          </tr>`
    }
    /*var i = 0
    for(alpha in dealData){
        i++;
        innerhtml_deals += `
        <tr>
        <td><button type="button" class="btn btn-success" onclick="verify_edit(${productData[alpha].item_id})>Edit Product</button></td>
            <th scope="row">${i}</th>
            <td>${dealData[alpha].orderid}</td>
            <td>${dealData[alpha].itemname}</td>
            <td>@${dealData[alpha].itemordered}</td>
          </tr>`
    }*/
    modelbody_product.innerHTML = innerhtml_product;
    //modelbody_deal.innerHTML = innerhtml_deals;
}

function edit_item(callx,callx_bool){
    console.log("callling")
    window.location.href="build.html?datax="+callx+"&bool="+callx_bool;
}



function verify_edit(callx,callx_bool){

    const modelbody2 = document.getElementById('staticBackdrop')
    let dataHtml =`
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-body">
            <p>Edit Order????<br><b>Note: Make Sure you have all info!!</b></p> 
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-success" data-dismiss="modal" onclick="edit_item('${callx}',${callx_bool})";>Yes</button>
        </div>
        </div>
    </div>
    </div>;`
    modelbody2.innerHTML = dataHtml;
    $('#staticBackdrop').modal('show');

}   

function createnew(){
    eel.uuid_creator()(function(ret){
        edit_item(ret,false)
    })
}
/*
function verify_makeorder2(){
    const modelbody2 = document.getElementById('staticBackdrop')
    let dataHtml =`
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-body">
            <p><b>ARE YOU SURE ???</b></p> 
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-success" data-dismiss="modal" onclick="load_data_call()";>Yes</button>
        </div>
        </div>
    </div>
    </div>;`
    modelbody2.innerHTML = dataHtml;
    $('#staticBackdrop').modal('show');
}
function print_list_after_load(){
    const modelbody_product = document.getElementById('tbody-product')
    const modelbody_deal = document.getElementById('tbody-deal')
    let innerhtml_product = '';
    let innerhtml_deals = '';
    innerhtml_product += `
        <tr>
            <th scope="row">-</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr> `;
    innerhtml_deals += `
          <tr>
              <th scope="row">-</th>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr> `;

    modelbody_product.innerHTML = innerhtml_product
    modelbody_deal.innerHTML = innerhtml_deals        
}
*/