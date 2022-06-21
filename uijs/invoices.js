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
  d.dbo_invoicelines.forEach(item => {
    console.log(item.Amount)
    if(item.Amount){
      amount += parseFloat(item.Amount);
      }
    }
  )
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
        <th scope="row">{{this.BillToName}}</th>
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

