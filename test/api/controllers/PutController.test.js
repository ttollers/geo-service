const assert = require("chai").assert;
const request = require('supertest');
const server = require('../../../app');
const db = require("../../../api/helpers/db");

describe('controllers', function() {

  // Only necessary if using local redis instance
  const flushAll = done => db.flushallStream().done(done);
  before(flushAll);
  afterEach(flushAll);

  describe('PutControllers', function() {

    describe('PUT /hello', function() {

      const body = {
        id: "abc_1",
        lat: 1.123,
        lng: 1.432,
        foo: "bar"
      };
      const key = "key";

      it('should return a default string', function(done) {

        request(server)
          .put(`/${key}`)
          .send(body)
          .set('Accept', 'application/json')
          .expect(204)
          .end(function(err) {
            assert.isNotOk(err);
            db.getStream(`${key}_${body.id}`)
              .tap(result => assert.deepEqual(JSON.parse(result), body))
              .flatMap(() => db.georadiusStream(key, body.lng, body.lat, 5, "m"))
              .tap(result => {
                assert.equal(result[0], body.id);
              })
              .done(done);
          });
      });

    });

  });

});
