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
  return rd;

};

//receive an array of invoice objects and render the html of the invoice list based on received objects
const renderinvoicesFromData = async (d) => {
    var templateHtml = `
    <tr>
        <th scope="row">{{this.BillToName}}</th>
        <td>{{this.InvoiceDate}}</td>
        <td>{{this.InvoiceLines_Invoice_dbo_invoice.Amount}}</td>
    </tr>
      `

    var template = Handlebars.compile(templateHtml);
    var compiledHtml = template(d);
    // inject html for invoice list
    $("#invoiceSeach").html(compiledHtml)
    console.log(this);

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

