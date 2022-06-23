// shows main customers tab, hides proposals and invoices tabs
$( "#mainCustomerTab" ).click(function() {
    $("#customers-search-container-css").show();
    $("#agg_invoices-container-css").hide();
    $("#agg_proposal-container-css").hide();
    });
// shows invoice tab, hides customers and proposals
$( "#mainInvoicesTab" ).click(function() {
    $("#agg_invoices-container-css").show();
    $("#customers-search-container-css").hide();
    $("#agg_proposal-container-css").hide();
    });
// shows proposals tab, hides customers and invoices 
$( "#mainProposalsTab" ).click(function() {
    $("#agg_proposal-container-css").show();
    $("#agg_invoices-container-css").hide();
    $("#customers-search-container-css").hide();
    });