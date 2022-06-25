// creates abort controller for stopping fetch during autocomplete
var controller = new AbortController();
var signal = controller.signal;

// calls the invoice api with the contents of the invoice search textbox as a query string 
const searchinvoicesApi = async () => {
  var r = await fetch("api/invoice?q=" + $("#invoice_search").val(),
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  // console.log(rd);
  return rd;

};

// handlebars helper for summing amounts from invoicelines table for invoices used in rednerinvociesfromdata
Handlebars.registerHelper('sum', function totalAmount2 (d) {
  amount = 0;

  if (!(d.dbo_invoicelines))
  {
    return amount;

  }

  d.dbo_invoicelines.forEach(item => {
    var iamt = (item.Amount) ? item.Amount : 0;
    var iqty = (item.Quantity) ? item.Quantity : 1;
    amount += iamt * iqty;
  });
  return amount;
    // console.log(amount)
    
});


// foramts date for use in handlebars
Handlebars.registerHelper('formatTime', function (date) {
  if (!date){
    return
  }
 var d = new Date (date);
  return d.toISOString().slice(0,10);;
  // var mmnt = moment(date);
  // return mmnt.format(format);
});

//receive an array of invoice objects and render the html of the invoice list based on received objects
const renderinvoicesFromData = async (d) => {
  // console.log(d);
  
    // var totalAmount = await totalAmount2(this.dbo_invoicelines.Amount);
    // console.log(totalAmount);
    var templateHtml = `
    {{#each this}}
    <tr>
        <th class="d-flex flex-row" scope="row">{{this.BillToName}} <h5 onclick="editInvoice(this)" id="edit_invoice_{{this.Id}}" data-invoice-id="{{this.Id}}" class="start-0" data-bs-toggle="modal" data-bs-target="#editInvoiceModal"><i class="bi bi-pencil ms-4 text-warning"></i></h5></th>
        <td>{{this.InvoiceDate}}</td>
        <td>{{sum this}}</td>
    </tr>
    {{/each}}
      `

    var template = Handlebars.compile(templateHtml);
    var compiledHtml = template(d);
    // inject html for invoice list
    $("#invoices").html(compiledHtml)
};

// await the invoice search then render the data
const doinvoiceSearchUi = async (d) => {
    controller.abort();
    controller = new AbortController()
    signal = controller.signal
    //Do new search
    var invoiceList = await searchinvoicesApi();
    await renderinvoicesFromData(invoiceList);
    
};

// start the invoice search 
const invoiceStartup = async () => {
    await doinvoiceSearchUi();
};
invoiceStartup();

// keyup event for invoice search 
$("#invoice_search").on('keyup', async function(e){
   await doinvoiceSearchUi();
});
// refreshes invoice list when X button clears input in seach input
$("#invoice_search").on('search', async function(e){
    await doinvoiceSearchUi();
});

// calls the invoice api with the contents of the invoice id from edit button 
const editInvoiceApi = async (id) => {
  var r = await fetch(`api/invoice?Id=${id}`,
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  return rd;

};

// creates EDIT CUSTOEMR modal and populates fields with exsisting information and is called from the 
// onclick="editInvoice(this)"
const editInvoice =  async function renderEditInvoiceFromData (d) {
  event.preventDefault();
  var e = await editInvoiceApi ($(d).attr('data-invoice-id'));
    var edit_invoice_html = `
        <div class="form-group row">
          <label for="edit_invoices_customer_name" class="col-sm-2 col-form-label">Bill To: </label>
          <div class="col-sm-10">
          <input type="text" class="billToName form-control" id="edit_invoices_customer_name"
            value = "{{this.BillToName}}" />
          </div>
        </div>
      <div class="form-group row">
        <label for="edit_invoices_date" class="col-sm-2 col-form-label">Date</label>
        <div class="col-sm-10">
          <input type="date" class="billToDate form-control" id="edit_invoices_date" value="{{formatTime InvoiceDate}}"
            onfocus="(this.type='date')" />
        </div>
      </div>
      <div class="form-group row">
        <label for="edit_invoices_amount" class="col-sm-2 col-form-label">Amount</label>
        <div class="col-sm-10">
          <input type="number" class="billToAmount form-control" id="edit_invoices_amount" value = "{{sum this}}" />
        </div>
      </div>
      <div class="form-group row">
          <label for="edit_invoice_adress" class="col-sm-2 col-form-label">Address</label>
          <div class="col-sm-10">
              <input type="text" class="billTo Adress form-control" id="edit_invoice_adress" value="{{this.BillToAddress}}" />
          </div>
      </div>
      <div class="form-group row">
          <label for="edit_invoice_city" class="col-sm-2 col-form-label">City</label>
          <div class="col-sm-10">
              <input type="text" class="billToCity form-control" id="edit_invoice_city" value="{{this.BillToCity}}" />
          </div>
      </div>
      <div class="form-group row">
          <label for="edit_invoice_state" class="col-sm-2 col-form-label">State</label>
          <div class="col-sm-10">
              <input type="text" class="billToState form-control" id="edit_invoice_state" value="{{this.BillToState}}" />
          </div>
      </div>
      <div class="form-group row">
          <label for="edit_invoice_zip" class="col-sm-2 col-form-label">Zip</label>
          <div class="col-sm-10">
              <input type="text" class="billToZip form-control" id="edit_invoice_zip" value="{{this.BillToZip}}" />
          </div>
      </div>
      <div class="form-group row">
        <label for="edit_invoices_terms" class="col-sm-2 col-form-label">Terms</label>
        <div class="col-sm-10">
          <select id="edit_bill_to_terms" class="billToTerms form-select" aria-label="Default select example">
            <option selected">{{this.Terms}}</option>
            <option>In full upon completion</option>
            <option>1/2 Start 1/2 Finish</option>
            <option>Net45</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="form-group d-flex justify-content-around">
          <button id="billToEditButon" data-invoice-id="{{this.Id}}" class="billToEditButon btn btn-primary mt-3" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#editInvoiceOffcanvas" aria-controls="editInvoiceOffcanvas">
            Edit invoice Text
          </button>
          <button class="editPreviewInvoiceButton btn btn-primary mt-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#"
            aria-controls="#">
            View Invoice Preview
          </button>
        </div>
      </div>
    `;

    var invoiceLineItemsHtml = `
      {{#each this.dbo_invoicelines}}
      <div class = "editInvoiceLines border border-light shadow">
        <textarea id="" data-edit-invoice-line-item-id = {{this.Id}} class="billToInvoiceLine w-100 px-2  mt-2 p-0" name="invoices_text"
        >{{this.Description}}</textarea>
        <div class=" d-flex flex-row w-100 mt-1 ">
          <div data-edit-invoice-line-item-Amount = "{{this.Amount}}" class="input-group">
            <span class="input-group-text">$</span>
            <input value="{{this.Amount}}" type="text" class="billToItemAmount form-control" aria-label="" />
          </div>
          <div id="" data-edit-invoice-line-item-#="{{this.Quantity}}" class=" input-group mx-auto">
            <span class="input-group-text">#</span>
            <input value="{{this.Quantity}}" type="text" class="billToItemQuantity form-control" aria-label="" />
          </div>
        </div>
      </div>
      {{/each}}
    `;
    // compile and inject both html variables into main.handlebars
    var template = Handlebars.compile(edit_invoice_html);
    var offCanvisEditTemp = Handlebars.compile(invoiceLineItemsHtml);
    var compilededitHtml = template(e[0]);
    var compilededitOffcanvasInvoiceLinesTemp = offCanvisEditTemp(e[0]) ;
    // inject html for invoice list
    $("#edit-invoice-form").html(compilededitHtml);
    $("#edit-invoice-line-items").html(compilededitOffcanvasInvoiceLinesTemp);
  };

    // function that populates a json object with the user inputs for exsisting invoice and posts them to invoicedb
const postinvoiceUpdate = async function (element) {
  // grabs id from create button (offcanvas i belive) data attribute
  var invoiceId = $("#billToEditButon").data("invoice-id")
  var invLines = []
  $(".editInvoiceLines").each(function (e, index) {
    var editInvoiceLineJson =
      {
        Description: $(this).find(".billToInvoiceLine").val(),
        Amount: $(this).find(".billToItemAmount").val(),
        Quantity: (!$(this).find(".billToItemQuantity").val()) ? 1 : $(this).find(".billToItemQuantity").val()
      }
      invLines.push(editInvoiceLineJson);
  });

  var jsonEditInvoiceInputs = {
      BillToName: $("#edit_invoices_customer_name").val(),
      BillToDate: $("#edit_invoices_date").val(),
      BillToAddress: $("#edit_invoice_adress").val(),
      BillToCity: $("#edit_invoice_city").val(),
      BillToState: $("#edit_invoice_state").val(),
      BillToZip: $("#edit_invoice_zip").val(),
      Terms: $("#edit_bill_to_terms").val(),
      dbo_invoicelines: invLines
      // Invoice_Customer: newInvoiceCustomerId

  };
  let url = `/api/invoice/${invoiceId}`;
  let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  };
  await fetch(
    url,
    {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(jsonEditInvoiceInputs)
    },
  ).then(async rawResponse =>{
      var content = await rawResponse.json()
      // console.log(content);
  });
};

// populates the customer name in the new invoice modal
var newInvoiceCustomerId = "";
const newinvoiceshow = function(e){
  newPropsalCustomerId = $(e).data('new-customer-id');
  $("#new_invoices_customer_name").val($(e).data('invoice-customer-name'))
};

// adds each now invoice line item to new field in new invoice offcanvas in main.handlebars
  // tracks how many list items are added (starts at 1 for IDs to not overlap)
var invoiceLineItemsCount = 1;
$("#newInvoiceAddLineItemButton").click(function (){
  // increments the invoiceLineItemsCount er
  invoiceLineItemsCount += 1;
  // appends the html for an added invoiceLineItem to the #addedinvocielistitems in main.handlebars
  $("#addedInvoiceListItems").append(`
  <div class="row">
    <textarea id="newinvoices_text${invoiceLineItemsCount}" class="w-100 px-2  mt-2 p-0" name="newinvoices_text2">${$("#newinvoices_text1").val()}</textarea>
    <div class=" d-flex flex-row w-100 mt-1">
      <div class="input-group">
        <span class="input-group-text">$</span>
        <input id="new-added-invoice-list-item-price-${invoiceLineItemsCount}" value=${$("#new-invoice-list-item-price-1").val()} type="text" class="form-control" aria-label="">
      </div>
      <div id="####invoice_item_quantity" class="input-group mx-auto">
        <span class="input-group-text">#</span>
        <input id="new-added-invoice-list-item-quantity-${invoiceLineItemsCount}" value=${$("#new-invoice-list-item-quantity-1").val()} type="text" class="form-control" aria-label="">
      </div>
    </div>
  </div>
  `);
  // clears out the add new invoice line text items so a new line item may be added
  $("#newinvoices_text1").val("");
  $("#new-invoice-list-item-price-1").val("");
  $("#new-invoice-list-item-quantity-1").val("")
  
  } 
);


// api for creating new invoice
const postCreateNewinvoice = async function () {
  // creates json body for new invoice post
  // ****add for loop to itt over invoice lines using invocielineitemsount to get data
  var newInvoiceLinesJson = {
    Quantity:
    Description:
    Amount:

  };
  var jsonbody = {
    // BillToName: $("#new_invoices_customer_name").val(),
      BillToDate: $("#new_invoices_date").val(),
      BillToAddress: $("#new_invoice_adress").val(),
      BillToCity: $("#new_invoice_city").val(),
      BillToState: $("#new_invoice_state").val(),
      BillToZip: $("#new_invoice_zip").val(),
      Terms: $("#new_bill_to_terms").val(),
      dbo_invoicelines: invLines,
      Invoice_Customer: newInvoiceCustomerId
  };
  var 
  let url = `/api/invoice/`;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // let r = await fetch(url, {
  //   method: "POST",
  //   headers: headers,
  //   body: JSON.stringify(jsonbody),
  // })
  
  // var content = await r.json();
  // console.log(content);  
};

