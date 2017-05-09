'use strict';

const db = require("../helpers/db");

module.exports = {
  put: put
};


function put(req, res) {
  const key = req.swagger.params.key.value;
  const body = req.swagger.params.body.value;

  db.geoaddStream(key, body.lng, body.lat, body.id)
    .flatMap(() => db.setStream(`${key}_${body.id}`, JSON.stringify(body)))
    .toCallback(err => {
      if(err) {
        if(err.name === "ValidationError") res.status(400).send(err.details);
        else res.status(500).send(err);
      }
      else res.sendStatus(204);
    });
}
