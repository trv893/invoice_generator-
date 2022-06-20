var customerList = [];
const refreshCustomers = async () => {
  var r = await fetch("api/customer");
  var rd = await r.json();
  customerList = rd;

  console.log(rd);
};

//bs
const renderCustomers = async () => {
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
    var compiledHtml = template(customerList);
    $("#customerlist").html(compiledHtml)
    console.log(compiledHtml);

};

const startup = async () => {
    await refreshCustomers();
    await renderCustomers();
};

startup();
