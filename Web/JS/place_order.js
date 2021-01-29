window.onload = order_list;
function order_list(){
    eel.list_temporders()(function(ret){
        var listObj2 = JSON.parse(ret[0]);
        var listObj = JSON.parse(ret[1]);
        var dealData = []
        var productData = []
        for(i=0;i<listObj.length;i++){
            var listObj_temp = JSON.parse(listObj[i]);
            dealData.push(listObj_temp)
        }
        for(i=0;i<listObj2.length;i++){
            var listObj_temp = JSON.parse(listObj2[i]);
            productData.push(listObj_temp)
        }
        print_list(dealData,productData)
    })   
}

function print_list(dealData,productData){
    const modelbody_product = document.getElementById('tbody-product')
    const modelbody_deal = document.getElementById('tbody-deal')
    let innerhtml_product = '';
    let innerhtml_deals = '';
    console.log(dealData,productData)
    var i = 0
    for(alpha in productData){
        i++;
        innerhtml_product += `
        <tr>
            <th scope="row">${i}</th>
            <td>${productData[alpha].orderid}</td>
            <td>${productData[alpha].itemname}</td>
            <td>@${productData[alpha].itemordered}</td>
          </tr>`
    }
    var i = 0
    for(alpha in dealData){
        i++;
        innerhtml_deals += `
        <tr>
            <th scope="row">${i}</th>
            <td>${dealData[alpha].orderid}</td>
            <td>${dealData[alpha].itemname}</td>
            <td>@${dealData[alpha].itemordered}</td>
          </tr>`
    }
    modelbody_product.innerHTML = innerhtml_product;
    modelbody_deal.innerHTML = innerhtml_deals;
}

function load_data_call(){
    eel.make_order_from_temp()(function(ret){
        if(ret == 'Sucess'){
            const modelbody = document.getElementById('success-message')
            let dataHtml = `
        <div class="alert alert-success" role="alert">
            Orders Sucessfully Placed.
          </div>`
          modelbody.innerHTML = dataHtml;
        }
        else{
            const modelbody = document.getElementById('success-message')
            let dataHtml = `
        <div class="alert alert-success" role="alert">
            Error Occurred!! Check console for more info.
          </div>`
          modelbody.innerHTML = dataHtml;
        }
    })
    order_list()
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

function verify_makeorder(){
    const modelbody2 = document.getElementById('staticBackdrop')
    let dataHtml =`
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-body">
            <p>You want to Place order??<br><b>Note: YOU CAN'T UNDO THIS ONCE ORDER ARE PLACED!!</b></p> 
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-success" data-dismiss="modal" onclick="verify_makeorder2()";>Yes</button>
        </div>
        </div>
    </div>
    </div>;`
    modelbody2.innerHTML = dataHtml;
    $('#staticBackdrop').modal('show');

}   

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