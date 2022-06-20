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
          <div class="align-self-center shadow-sm rounded">
            <a class="btn btn-light" href="tel:713-992-0916">
              
          <tr>
              <td>{{this.FirstName}} {{this.LastName}}</td>
          </tr>
       
            </a>
          </div>
          <div class="align-self-center shadow-sm rounded">
            <a class="btn btn-primary" href="tel:{{this.Phone1}}">
              <i class="bi bi-telephone"></i>
            </a>
          </div>
          <div class="align-self-center shadow-sm">
            <a class="btn btn-primary" href="mailto:{{this.Email}}">
              <i class="bi bi-envelope"></i>
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