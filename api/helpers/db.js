"use strict";

let redis = require('redis');
const hl = require("highland");

const redisConfig = {
  "host": process.env.REDIS_HOST || "localhost",
  "port": process.env.REDIS_PORT || 6379
};

const client = redis.createClient(redisConfig);
module.exports = hl.streamifyAll(client);
