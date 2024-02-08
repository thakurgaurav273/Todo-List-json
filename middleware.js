const cors = require('cors');

module.exports = {
  after: function(app) {
    app.use(cors());
  }
};
