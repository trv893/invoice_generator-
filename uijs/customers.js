// creates abort controller for stopping fetch during autocomplete
var controller = new AbortController();
var signal = controller.signal;

// calls the customer api with the contents of the customer search textbox as a query string 
const searchCustomersApi = async () => {
  var r = await fetch("api/customer?q=" + $("#customer_search").val(),
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  return rd;

};

//receive an array of customer objects and render the html of the customer list based on received objects
const renderCustomersFromData = async (d) => {
    var templateHtml = `
    {{#each this}}
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-between p-md-1">
                <div class="align-self-center d-flex flex-row">
                    <a class="btn btn-light shadow-sm rounded" href="tel:713-992-0916">

                        <tr>
                            <td>{{this.FirstName}} {{this.LastName}}</td>

                        </tr>

                    </a>
                    <h3 onclick="editCustomer(this)" id="customer_{{this.Id}}" data-customer-id = {{this.Id}} class="EditCustomer start-0" data-bs-toggle="modal" data-bs-target="#editcustomerModal"><i class="bi bi-pencil ms-4 text-warning"></i></h3>
                </div>
               
                    <div class="align-self-center shadow-sm rounded">
                        <a class="btn btn-primary" href="tel:{{this.Phone1}}">
                            <i class="bi bi-telephone"></i>
                        </a>
                    </div>
                    <div class="align-self-center shadow-sm">
                        <a class="btn btn-primary" href="mailto:{{this.Email}}">
                            <i class="bi bi-envelope" ></i>
                        </a>
                    </div>
            </div>
        </div>
    </div>
      {{/each}}
      `

    var template = Handlebars.compile(templateHtml);
    var compiledHtml = template(d);
    // inject html for customer list
    $("#customerlist").html(compiledHtml)
    // console.log(compiledHtml);
};

// await the customer search then render the data
const doCustomerSearchUi = async (d) => {
    controller.abort();
    controller = new AbortController()
    signal = controller.signal
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
$("#customer_search").on('keyup', async function(e){
   await doCustomerSearchUi();
});
// refreshes customer list when X button clears input in seach input
$("#customer_search").on('search', async function(e){
    await doCustomerSearchUi();
});

// calls the customer api with the contents of the customer id from edit button 
const searchEditCustomersApi = async (id) => {
  var r = await fetch(`api/customer?Id=${id}`,
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  return rd;

};

// creates EDIT CUSTOEMR modal and populates fields with exsisting information and is called from the html with onclick="editCustomer(this)"
 const editCustomer =  async function renderEditCustomersFromData (d) {
  event.preventDefault();
  var e = await searchEditCustomersApi ($(d).attr('data-customer-id'));
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
    $("#edit-customer-form").html(compilededitHtml)
  };

  // function that populates a json object with the user inputs for exsisting customer and posts them to customerdb
const postCustomerUpdate = async function (element) {
  // id value from update button on edit customer 
  var customerId = element.attributes[2].value;
  // gets values from customer edit inputs
  var htmldata = $(element).parentsUntil('div.modal-body')[1];
  // turns customer inputs into json for PUT
  var jsonbody = {
    FirstName: htmldata[0].value,
    LastName: htmldata[1].value,
    Company: htmldata[2].value,
    Phone1: htmldata[7].value,
    Phone2: htmldata[8].value,
    Email: htmldata[4].value,
    Adress: htmldata[3].value,
    City: htmldata[4].value,
    State: htmldata[5].value,
    Zip: htmldata[6].value,
  };
  let url = `/api/customer/${customerId}`;
  let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  };
  await fetch(
    url,
    {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(jsonbody)
    },
  ).then(async rawResponse =>{
      var content = await rawResponse.json()
      console.log(content);
  });
};