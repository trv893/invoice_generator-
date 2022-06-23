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

//receive an array of invoice objects and render the html of the invoice list based on received objects
const renderinvoicesFromData = async (d) => {
  // console.log(d);
  
    // var totalAmount = await totalAmount2(this.dbo_invoicelines.Amount);
    // console.log(totalAmount);
    var templateHtml = `
    {{#each this}}
    <tr>
        <th class="d-flex flex-row" scope="row">{{this.BillToName}} <h5 onclick="editInvoice(this)" id="edit_invoice_{{this.Id}}" class=" start-0" data-bs-toggle="modal" data-bs-target="#editInvoiceModal"><i class="bi bi-pencil ms-4 text-warning"></i></h5></th>
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

// calls the customer api with the contents of the customer id from edit button 
const editInvoiceApi = async (id) => {
  var r = await fetch(`api/customer?Id=${id}`,
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
  var e = await editInvoiceApi ($(d).attr('data-customer-id'));
    var edit_customer_html = `
    `;
    var template = Handlebars.compile(edit_customer_html);
    var compilededitHtml = template(e[0]);
    // inject html for customer list
    $("#edit-customer-form").html(compilededitHtml)
  };