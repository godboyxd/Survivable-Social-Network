var expect = require('expect');
var userDao = require('../dao/userDao.js');

suite('UserDAO Tests', function(){

    setup('Setup DB Connection', function(done){
        var ConnectionController = require('../controllers/connection-controller.js');
        var conn = new ConnectionController();

        done();
    });

    test('Listing users', function(done){

        done();
    });

    test('Finding user by ID', function(done){

        done();
    });

    test('Creating a user', function(done){

        done();
    });

    test('Updating a user', function(done){

        done();
    });

    test('Removing a user', function(done){

        done();
    });

})
