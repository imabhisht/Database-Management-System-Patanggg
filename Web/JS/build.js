var url_string = window.location.href
var url = new URL(url_string);
var itemid_fromjs = url.searchParams.get("datax");
var itemid_bool = url.searchParams.get("bool")




Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};


window.onload = () => {
  document.getElementById("item_id").value = itemid_fromjs;
  if(itemid_bool=='true'){Download(itemid_fromjs)};
}
var pro_index = 0;
var url_index = 0;
var index_array = []
var url_array = []

//HTML OPERATIONS

function AddField() {
  console.log("adding " ,pro_index)
  var datahtml =
    `
    <br>
    <div class="form-row" id="${pro_index}">
    <div class="col">
      <input type="text" class="form-control" placeholder="Property Name" id="item_properties_name[${pro_index}]">
    </div>
    <div class="col">
      <input type="text" class="form-control" placeholder="Property Value" id="item_properties_value[${pro_index}]">
    </div>
    <button type="button" class="btn btn-danger" onclick="RemoveField(${pro_index});">Remove</button>
  </div>
    `;
  $("#add_properties").append(datahtml)
  index_array.push(pro_index)
  pro_index++;
}

function RemoveField(x) {
  console.log("removing ",x)
  var myobj = document.getElementById(x);
  myobj.remove();
  index_array.remove(x)
}


function Addurl() {
  var alpha = "alpha_"+url_index
  console.log("adding " ,url_index)
  var datahtml =
    `
    <br>
    <div class="form-row" id="${alpha}">
    <div class="col">
      <input type="text" class="form-control" placeholder="Add URL" id="url_name_${alpha}">
    </div>
    <button type="button" class="btn btn-danger" onclick="Removeurl(${url_index});">Remove</button>
  </div>
    `;
  $("#add_images").append(datahtml)
  url_array.push(url_index)
  url_index++;
}

function Removeurl(y) {
  console.log("removing ",y)
  var alpha = "alpha_"+y
  console.log(alpha)
  var myobj = document.getElementById(alpha);
  console.log(myobj)
  myobj.remove();
  url_array.remove(y)
}






//DATABASE EDITING

class Builder{
  constructor(id,name,itemcat,desc,instock,itemor,itemqr,itemrate,prolist,url_list,itemum,isdel){
    this.id = id;
    this.category = itemcat;
    this.name = name;
    this.desc = desc;
    this.inStock = instock;
    this.maxQuantityInUnitsPerOrder = parseInt(itemor);
    this.quantityPerUnit = parseInt(itemqr);
    this.pricePerUnit = parseInt(itemrate);
    this.properties = prolist;
    if(itemum!=""){this.unitMeasure = itemum;};
    this.isDeleted = isdel;
    this.origin = "India";
    this.backgroundColorInt = 0;
    this.images = url_list

  } 

}


function Upload() {

  var properties_list = []
  var url_list = []
  var Item_Id = document.getElementById("item_id").value;
  var Item_Name = document.getElementById("item_name").value;
  var Item_Category = document.getElementById("item_category").value;
  var Item_InStock = document.getElementById("item_instock").checked;
  var Item_QR = document.getElementById("item_quantityrate").value;
  var Item_OR = document.getElementById("item_orderrate").value;
  var Item_Rate = document.getElementById("item_rate").value;
  var Item_Desc = document.getElementById("item_desc").value;
  var Item_UM = document.getElementById("item_um").value;
  var Item_Deleted = document.getElementById("item_deleted").checked;
  console.log(Item_UM,Item_Deleted)

  //var Item_Pros_name = document.getElementById("item_properties_name").value;
  //var Item_Pros_value = document.getElementById("item_properties_value").value;
  for(emp = 0; emp < index_array.length; emp++){
    try{
    properties_list.push({"name":document.getElementById("item_properties_name["+index_array[emp]+"]").value,"value":document.getElementById("item_properties_value["+index_array[emp]+"]").value})
  }
  catch(err){
    console.log(err)
  }
}
  
  for(emp = 0; emp < url_array.length; emp++){
    try{
      url_list.push(document.getElementById("url_name_alpha_"+url_array[emp]).value);
  }
  catch(err){
    console.log(err)
  }
  }
  //console.log({"category":Item_Category,"name":Item_Name,"inStock":Item_InStock,"maxQuantityInUnitsPerOrder":Item_OR,"quantityPerUnit":Item_QR,"pricePerUnit":Item_Rate,"desc":Item_Desc,"properties":properties_list})

  var Echo = new Builder(id=Item_Id,name=Item_Name,itemcat=Item_Category,desc=Item_Desc,
    instock=Item_InStock,itemor=Item_OR,itemqr=Item_QR,itemrate=Item_Rate,
    prolist=properties_list,url_list = url_list,itemum=Item_UM,isdel=Item_Deleted);
  
  console.log((JSON.stringify(Echo)));


  const modelbody2 = document.getElementById('staticBackdrop')
  let dataHtml =`
  <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      <div class="modal-body">
          <p>Waiting for the Response from Database. You will automatically Redirected to the Home.</p>
          <div class="alert alert-warning" role="alert">
          <b>Note: CHECK CONSOLE FOR STATUS...</b>
          </div>
      </div>
      </div>
  </div>
  </div>;`
  modelbody2.innerHTML = dataHtml;
  $('#staticBackdrop').modal('show');
  
  eel.fortox((JSON.stringify(Echo)),Item_Id)(function(ret){
    if(ret=='Success'){
      window.location.href="buildtable.html";
    }
    else{
      $('#staticBackdrop').modal('hide');
      alert("Contact Admin Now!!!!!!!!!!!!!!!!!!!")}
  });

}




function Download(dataid){
  eel.megaton(dataid)(function(ret){
    var listObj = JSON.parse(ret);
    var Data = []
    for(i=0;i<listObj.length;i++){
        var userObj = JSON.parse(listObj[i]);
        Data.push(userObj)
    }
    console.log(Data)
    WriteDataFrom(Data[0])
})
}

function WriteDataFrom(datax){
  document.getElementById("item_id").value = datax.item_id;
  document.getElementById("item_name").value = datax.item_name;
  document.getElementById("item_category").value = datax.item_category;
  document.getElementById("item_instock").checked = datax.item_stock;
  document.getElementById("item_quantityrate").value = datax.item_qr; 
  document.getElementById("item_orderrate").value = datax.item_or;
  document.getElementById("item_rate").value = datax.item_rate;
  document.getElementById("item_desc").value = datax.item_desc;
  document.getElementById("item_um").value = datax.item_unitmeasure;
  document.getElementById("item_deleted").checked = datax.item_isDeleted;


  for(exp = 0; exp < (datax.item_prolist).length; exp++){
    var pro_name = "item_properties_name["+exp+"]";
    var pro_value = "item_properties_value["+exp+"]";
    var datahtml =
    `
    <br>
    <div class="form-row" id="${exp}">
    <div class="col">
      <input value="${datax.item_prolist[exp].name}" type="text" class="form-control" placeholder="Property Name" id=${pro_name}>
    </div>
    <div class="col">
      <input value="${datax.item_prolist[exp].value}" type="text" class="form-control" placeholder="Property Value" id=${pro_value}>
    </div>
    <button type="button" class="btn btn-danger" onclick="RemoveField(${exp});">Remove</button>
  </div>
    `;
  $("#add_properties").append(datahtml)
  index_array.push(exp)
  }
  pro_index = exp;

  for(exp = 0; exp < (datax.item_urllist).length; exp++){
    var url_name = "url_name_alpha_"+exp;
    var alpha = "alpha_"+exp
    var datahtml =
    `
    <br>
    <div class="form-row" id="${alpha}">
    <div class="col">
      <input value="${datax.item_urllist[exp]}" type="text" class="form-control" placeholder="Add URL" id=${url_name}>
    </div>
    <button type="button" class="btn btn-danger" onclick="Removeurl(${exp});">Remove</button>
  </div>
    `;
  $("#add_images").append(datahtml)
  url_array.push(exp)
  }
  url_index = exp;
}

function verify_edit(){

  const modelbody2 = document.getElementById('staticBackdrop')
  let dataHtml =`
  <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      <div class="modal-body">
          <p>Are you sure you want to edit this<br><b>Note: THIS MAY CRASH MAIN APPICATION!!</b></p> 
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
          <button type="button" class="btn btn-success" data-dismiss="modal" onclick="Upload()";>Yes</button>
      </div>
      </div>
  </div>
  </div>;`
  modelbody2.innerHTML = dataHtml;
  $('#staticBackdrop').modal('show');

}  

function Remove(){
  console.log("this is to reomove: ",itemid_fromjs)
  const modelbody2 = document.getElementById('staticBackdrop')
  let dataHtml =`
  <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      <div class="modal-body">
          <p>Waiting for the Response from Database. You will automatically Redirected to the Home.</p>
          <div class="alert alert-warning" role="alert">
          <b>Note: CHECK CONSOLE FOR STATUS...</b>
          </div>
      </div>
      </div>
  </div>
  </div>;`
  modelbody2.innerHTML = dataHtml;
  $('#staticBackdrop').modal('show');

  eel.charlie(itemid_fromjs)(function(ret){
    if(ret=='Success'){
      window.location.href="buildtable.html";
    }
    else{
      $('#staticBackdrop').modal('hide');
      alert("Contact Admin Now!!!!!!!!!!!!!!!!!!!")}
  });
}


function verify_remove(){

  const modelbody2 = document.getElementById('staticBackdrop')
  let dataHtml =`
  <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      <div class="modal-body">
          <p>Are you sure you want to edit this<br><b>Note: THIS WILL REMOVE ITEM FROM DATABASE!!</b></p> 
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
          <button type="button" class="btn btn-success" data-dismiss="modal" onclick="Remove()";>Yes</button>
      </div>
      </div>
  </div>
  </div>;`
  modelbody2.innerHTML = dataHtml;
  $('#staticBackdrop').modal('show');

}