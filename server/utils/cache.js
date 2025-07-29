const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 900 }); // cache expires in 300 seconds (5 minutes)

module.exports = cache;
