// creates abort controller for stopping fetch during autocomplete
var controller = new AbortController();
var signal = controller.signal;

const failedlogin = function(){
  localStorage.clear();
  window.location = '/';

};

// calls the customer api with the contents of the customer search textbox as a query string
const searchCustomersApi = async () => {
  try {
    var r = await fetch("api/customer?q=" + $("#customer_search").val(), {
      // signal used to abort fetch
      headers: {
        Authorization: "Bearer " + localStorage.getItem("key"),
      },
      signal: signal,
    });
    var rd = await r.json();
    return rd;
  } catch (err) {
    failedlogin();
  }
};

//receive an array of customer objects and render the html of the customer list based on received objects
const renderCustomersFromData = async (d) => {
  var templateHtml = `
  <ul style="margin:0px 0px; padding:0px 0px; list-style:none;">


    {{#each this}}
    <li>
      <a class="d-flex btn btn-light shadow-sm m-1 EditCustomer" onclick="editCustomer(this)" id="customer_{{this.Id}}" data-customer-id={{this.Id}} data-bs-toggle="modal" data-bs-target="#editcustomerModal">
        
          <div class="p-2 col-9">
            <div class="row datarow ">
              <span class="text-uppercase list-primary" > {{this.FirstName}} {{this.LastName}} </span>
            </div>
            <div class="row datarow">
              <span> {{this.Address}}, {{this.City}} </span>
            </div>
          </div>
    
          <div class="p-2 d-flex col-3">
            <div class="row">
              <div class="col">
              <i  onclick="location.href='tel:{{this.Phone1}}'" class="bi btn btn-success bi-telephone ms-2 shadow"  >&nbsp;</i>
                <i  onclick="newproposalshow(this)" data-new-customer-id="{{this.Id}}" data-proposal-customer-name="{{this.FirstName}} {{this.LastName}}" class="bi btn btn-success bi-file-earmark-medical ms-2 shadow" data-bs-toggle="modal" data-bs-target="#newProposalModal">&nbsp;</i>
                <i onclick="newinvoiceshow(this)" data-new-invoice-customer-id="{{this.Id}}" data-invoice-customer-name="{{this.FirstName}} {{this.LastName}}" class="bi btn btn-success bi-coin ms-2 shadow" data-bs-toggle="modal" data-bs-target="#newInvoiceModal">&nbsp;</i>
              </div>
            </div>
          </div>  
      </a>
    <li>
    {{/each}}   
  </ul>   
      `;  

  var template = Handlebars.compile(templateHtml);
  var compiledHtml = template(d);
  // inject html for customer list
  $("#customerlist").html(compiledHtml);
  // console.log(compiledHtml);
};

// await the customer search then render the data
const doCustomerSearchUi = async (d) => {
  controller.abort();
  controller = new AbortController();
  signal = controller.signal;
  //Do new search
  var customerList = await searchCustomersApi();
  await renderCustomersFromData(customerList);
};

// start the customer search
const startup = async () => {
  await doCustomerSearchUi();
};
startup();

// keyup event for customer search
$("#customer_search").on("keyup", async function (e) {
  await doCustomerSearchUi();
});
// refreshes customer list when X button clears input in seach input
$("#customer_search").on("search", async function (e) {
  await doCustomerSearchUi();
});

// calls the customer api with the contents of the customer id from edit button
const searchEditCustomersApi = async (id) => {
  try {
    var r = await fetch(`api/customer?Id=${id}`, {
      // signal used to abort fetch
      signal: signal,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("key"),
      },
    });
    var rd = await r.json();
    return rd;
  } catch (err) {
    failedlogin();
  }
};

// creates EDIT CUSTOEMR modal and populates fields with exsisting information and is called from the html with onclick="editCustomer(this)"
const editCustomer = async function renderEditCustomersFromData(d) {
  event.preventDefault();
  var e = await searchEditCustomersApi($(d).attr("data-customer-id"));
  var edit_customer_html = `
                <div class="form-group row">
                  <label for="edit_customer_first_name" class="col-sm-2 col-form-label">First</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_first_name" value="{{this.FirstName}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_last_name" class="col-sm-2 col-form-label">Last</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_last_name" value="{{this.LastName}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_company" class="col-sm-2 col-form-label">Company</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_company" value="{{this.Company}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_adress" class="col-sm-2 col-form-label">Address</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_adress" value="{{this.Address}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_city" class="col-sm-2 col-form-label">City</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_city" value="{{this.City}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_state" class="col-sm-2 col-form-label">State</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_state" value="{{this.State}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_zip" class="col-sm-2 col-form-label">Zip</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="edit_customer_zip" value="{{this.Zip}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_phone1" class="col-sm-2 col-form-label">Phone</label>
                  <div class="col-sm-10">
                    <input type="tel" class="form-control" id="edit_customer_phone1" value="{{this.Phone1}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_phone2" class="col-sm-2 col-form-label">Phone</label>
                  <div class="col-sm-10">
                    <input type="tel" class="form-control" id="edit_customer_phone2" value="{{this.Phone2}}" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="edit_customer_email1" class="col-sm-2 col-form-label">Email</label>
                  <div class="col-sm-10">
                    <input type="email" class="form-control" id="edit_customer_email1" value="{{this.Email}}"/>
                  </div>
                </div>

                <div class="modal-footer d-flex justify-content-around">
                  <button onclick="postCustomerUpdate(this)" type="button" data-customer-id= "{{this.Id}}" class="btn btn-primary">Update</button>
                </div>
            </div>
    `;
  var template = Handlebars.compile(edit_customer_html);
  var compilededitHtml = template(e[0]);
  // inject html for customer list
  $("#edit-customer-form").html(compilededitHtml);
};

// function that populates a json object with the user inputs for exsisting customer and posts them to customerdb
// called from the onclick="postCustomerUpdate(this)" attribute in the above handlebars html
const postCustomerUpdate = async function (element) {
  // id value from update button on edit customer
  var customerId = $(element).attr("data-customer-id");
  // turns customer inputs into json for PUT
  var jsonbody = {
    FirstName: $("#edit_customer_first_name").val(),
    LastName: $("#edit_customer_last_name").val(),
    Company: $("#edit_customer_company").val(),
    Phone1: $("#edit_customer_phone1").val(),
    Phone2: $("#edit_customer_phone2").val(),
    Email: $("#edit_customer_email1").val(),
    Address: $("#edit_customer_adress").val(),
    City: $("#edit_customer_city").val(),
    State: $("#edit_customer_state").val(),
    Zip: $("#edit_customer_zip").val(),
  };
  let url = `/api/customer/${customerId}`;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: 'Bearer ' + localStorage.getItem("key")
  };
  await fetch(url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(jsonbody),
 
  }).then(async (rawResponse) => {
    var content = await rawResponse.json();
    // console.log(content);
  });
};

// api for creating new customer
const postCreateNewCustomer = async function () {
  // creates json body for new cutomer post
  var jsonbody = {
    FirstName: $("#new_customer_first_name").val(),
    LastName: $("#new_customer_last_name").val(),
    Company: $("#new_customer_company").val(),
    Phone1: $("#new_customer_phone1").val(),
    Phone2: $("#new_customer_phone2").val(),
    Email: $("#new_customer_email1").val(),
    Address: $("#new_customer_adress").val(),
    City: $("#new_customer_city").val(),
    State: $("#new_customer_state").val(),
    Zip: $("#new_customer_zip").val(),
  };
  let url = `/api/customer/`;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: 'Bearer ' + localStorage.getItem("key")
  };

  let r = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(jsonbody),
    
  })
  
  var content = await r.json();
  console.log(content);  
};
