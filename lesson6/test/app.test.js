var app = require('../app');
var should = require('should');

describe('test/app.test.js', function () {
    it('should equal 55 when n === 10', function () {
        app.fibonacci(10).should.equal(55);
    });

    it('should equal 0 when n === 0', function () {
        app.fibonacci(0).should.equal(0);
    });

});
