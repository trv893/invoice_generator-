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
        aria-labelledby="dropdownMenuButton1">
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
            <th class="d-flex flex-row" scope="row">{{this.JobName}}<h5
            onclick="editproposal(this)" id="edit_proposal_{{this.Id}}" data-proposal-id={{this.Id}} class=" start-0" data-bs-toggle="modal" data-bs-target="#editProposalModal"><i class="bi bi-pencil ms-4 text-warning"></i></h5></th>
            <td>{{this.Proposal_Customer_dbo_customer.FirstName}} {{this.Proposal_Customer_dbo_customer.LastName}}</td>
            <td>{{this.ProposalDate}}</td>
            <td>{{this.ProposalAmount}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>
      `;

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

// calls the proposal api with the contents of the proposal id from edit button 
const editproposalApi = async (id) => {
  var r = await fetch(`api/proposal?Id=${id}`,
   {
    // signal used to abort fetch
    signal: signal,
  });
  var rd = await r.json();
  return rd;

};

// foramts date for use in handlebars
Handlebars.registerHelper('formatTime', function (date) {
  if (!date){
    return
  }
 var d = new Date (date);
  return d.toISOString().slice(0,10);;
});

// creates EDIT CUSTOEMR modal and populates fields with exsisting information and is called from the 
// onclick="editproposal(this)" attribvute in the above function renderproposalsFromData 
const editproposal =  async function renderEditproposalFromData (d) {
  event.preventDefault();
  var e = await editproposalApi ($(d).attr('data-proposal-id'));
    var edit_proposal_html = `
    <div class="form-group row">
    <label for="edit_proposal_customer_name" class="col-sm-2 col-form-label">Customer</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" id="edit_proposal_customer_name"
            value="{{this.Proposal_Customer_dbo_customer.FirstName}} {{this.Proposal_Customer_dbo_customer.LastName}}" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal-jobname" class="col-sm-2 col-form-label">Job Name</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" id="edit_proposal-jobname" value="{{this.JobName}}"/>
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_date" class="col-sm-2 col-form-label">Date</label>
    <div class="col-sm-10">
        <input type="date" class="form-control" id="edit_proposal_date" value="{{formatTime ProposalDate}}"
            onfocus="(this.type='date')" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_amount" class="col-sm-2 col-form-label">Amount</label>
    <div class="col-sm-10">
        <input type="number" class="form-control" id="edit_proposal_amount" value="{{this.ProposalAmount}}" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_location" class="col-sm-2 col-form-label">Location</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" id="edit_proposal_location" value="{{this.JobLocation}}" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_phone" class="col-sm-2 col-form-label">Job Phone</label>
    <div class="col-sm-10">
        <input type="tel" class="form-control" id="edit_proposal_phone" value="{{this.JobPhone}}" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_date_plans" class="col-sm-2 col-form-label">Plan Date</label>
    <div class="col-sm-10">
        <input type="date" class="form-control" id="edit_proposal_date_plans" value="{{formatTime DateOfPlans}}"
            onfocus="(this.type='date')" />
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_terms" class="col-sm-2 col-form-label">Terms</label>
    <div class="col-sm-10">
        <select class="form-select" id="edit_proposal_terms" aria-label="Select Terms of Payment">
            <option selected>{{this.PaymentTerms}}</option>
            <option>In full upon completion</option>
            <option>1/2 Start 1/2 Finish</option>
            <option>Net45</option>
        </select>
    </div>
</div>
<div class="form-group row">
    <label for="edit_proposal_roofing" class="col-sm-2 col-form-label">Roofing </label>
    <div class="col-sm-10">
        <input type="checkbox" class="" id="edit_proposal_roofing" checked="{{this.Roofing}}"/>
    </div>
</div>
<div class="form-group row">
    <div class="form-group d-flex justify-content-around">
        <button class="btn btn-primary mt-3" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#editProposalOffcanvas" aria-controls="editProposalOffcanvas">
            Edit Proposal Text
        </button>
        <button class="btn btn-primary mt-3" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#editproposalOffcanvas" aria-controls="editProposalOffcanvas">
            Preview Proposal
        </button>
    </div>
</div>
    `;
  var proposalLineItemsHtml = `
  <div class="row">
    <textarea
      data-edit-proposal-text="{{this.Id}}"
      data-edit-proposal-customer-id="{{this.Proposal_Customer}}"
      id="edit_proposals_text"
      class="w-100 px-2 mt-2 p-0"
      name="proposals_text"
    >{{this.ProposalText}}</textarea>
  </div>
`;

  // compile and inject both html variables into main.handlebars
  var template = Handlebars.compile(edit_proposal_html);
  var offCanvisEditTemp = Handlebars.compile(proposalLineItemsHtml);
  var compilededitHtml = template(e[0]);
  var compilededitOffcanvasproposalLinesTemp = offCanvisEditTemp(e[0]) ;
  // inject html for proposal list
  $("#edit-proposal-form").html(compilededitHtml);
  $("#edit-proposal-line-text-area").html(compilededitOffcanvasproposalLinesTemp);
};


  // function that populates a json object with the user inputs for exsisting proposal and posts them to proposal table
  // called from the onclick="postproposalUpdate(this)" attribute in main.handlebars
const postproposalUpdate = async function (element) {
  var proposalId= $("#edit_proposals_text").data("edit-proposal-text");
  var jsonEditproposalInputs = {
    JobName: $("#edit_proposal-jobname").val(),
    ProposalDate: $("#edit_proposal_date").val(),
    JobLocation: $("#edit_proposal_location").val(),
    JobPhone: $("#edit_proposal_phone").val(),
    DateOfPlans: $("#edit_proposal_date_plans").val(),
    ProposalAmount: $("#edit_proposal_amount").val(),
    PaymentTerms: $("#edit_proposal_terms").val(),
    ProposalText: $("#edit_proposals_text").val(),
    Roofing: $("#edit_proposal_roofing").is(":checked"),
    // Proposal_Customer: $("#proposals_text").data("proposal-customer-id")
  }
  let url = `/api/proposal/${proposalId}`;
  let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  };
  await fetch(
    url,
    {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(jsonEditproposalInputs)
    },
  ).then(async rawResponse =>{
      var content = await rawResponse.json()
      // console.log(content);
  });
};
  
// api for creating new proposal
const postCreateNewproposal = async function () {
  // creates json body for new cutomer post
  var jsonbody = {
    JobName: $("#new_proposal_jobname").val(),
    ProposalDate: $("#new_proposal_date").val(),
    JobLocation: $("#new_proposal_location").val(),
    JobPhone: $("#new_proposal_phone").val(),
    DateOfPlans: $("#new_proposal_jobdate").val(),
    ProposalAmount: $("#new_proposal_amount").val(),
    PaymentTerms: $("#new_proposal_terms").val(),
    ProposalText: $("#new_proposals_text").val(),
    Roofing: $("#new_proposal_roofing").is(":checked"),
    Proposal_Customer: newPropsalCustomerId
  };
  let url = `/api/proposal/`;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let r = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(jsonbody),
  })
  
  var content = await r.json();
  console.log(content);  
};

// populates the customer name in the new proposal modal
var newPropsalCustomerId = "";
const newproposalshow = function(e){
  newPropsalCustomerId = $(e).data('new-customer-id');
  $("#new_proposal_customer_name").val($(e).data('proposal-customer-name'))
};