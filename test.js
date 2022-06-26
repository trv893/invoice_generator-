var db = require("./Develop/models");
var initModels = require("./Develop/models/init-models");
var models = initModels(db.sequelize);
const Op = db.Sequelize.Op;

const test = async function () {
  var findOpts = {
    include: [
      {
        model: models.dbo_customers,
        as: "Proposal_Customer_dbo_customer",
        where: {},
      },
    ],
  };

  var x = "$Proposal_Customer_dbo_customer.FirstName$";

  findOpts.where = {
    [Op.or]: [
      {
        ["$Proposal_Customer_dbo_customer.FirstName$"]: {
          [Op.like]: "j%",
        },
      },
      {
        JobName: {
          [Op.like]: "j%",
        },
      },
    ],
  };

  try {
    var c = await models.dbo_proposals.findAll(findOpts);
    console.log(c);
  } catch (e) {
    console.log(e);
  }

  console.log(c);
};

test();
