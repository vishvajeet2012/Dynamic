// utils/cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes
module.exports = cache;
