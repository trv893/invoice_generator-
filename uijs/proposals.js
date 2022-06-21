// creates abort controller for stopping fetch during autocomplete
var controller = new AbortController();
var signal = controller.signal;

// calls the proposal api with the contents of the proposal search textbox as a query string 
const searchproposalsApi = async () => {
  var r = await fetch("api/proposal?q=" + $("#proposal_search").val(),
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  return rd;

};

//receive an array of proposal objects and render the html of the proposal list based on received objects
const renderproposalsFromData = async (d) => {
    var templateHtml = `
    <table
        id="proposal-table-css"
        class="table table-striped mw-8"
        aria-labelledby="dropdownMenuButton1"
      >
        <thead>
          <tr>
            <th scope="col">Job</th>
            <th scope="col">Customer</th>   
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
        {{#each this}}
          <tr>
            <th class="d-flex flex-row" scope="row">{{this.JobName}}<h5 id="edit_proposal_{{this.Id}}" class=" start-0" data-bs-toggle="modal" data-bs-target="#editProposalModal"><i class="bi bi-pencil ms-4 text-warning"></i></h5></th>
            <td>{{this.Proposal_Customer_dbo_customer.FirstName}} {{this.Proposal_Customer_dbo_customer.LastName}}</td>
            <td>{{this.ProposalDate}}</td>
            <td>{{this.ProposalAmount}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>>
      `

    var template = Handlebars.compile(templateHtml);
    var compiledHtml = template(d);
    // inject html for proposal list
    $("#proposalSeach").html(compiledHtml)

};

// await the proposal search then render the data
const doproposalSearchUi = async (d) => {
    controller.abort();
    controller = new AbortController()
    signal = controller.signal
    //Do new search
    var proposalList = await searchproposalsApi();
    await renderproposalsFromData(proposalList);
    
};

// start the proposal search 
const proposalStartup = async () => {
    await doproposalSearchUi();
};
proposalStartup();

// keyup event for proposal search 
$("#proposal_search").on('keyup', async function(e){
   await doproposalSearchUi();
});
// refreshes proposal list when X button clears input in seach input
$("#proposal_search").on('search', async function(e){
    await doproposalSearchUi();
});

