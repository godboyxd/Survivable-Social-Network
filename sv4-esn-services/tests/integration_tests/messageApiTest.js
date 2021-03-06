const request = require('supertest');
const express = require('express');
const expect = require('expect.js');

var server = require('../../server.js');
var app = server.getApp;
var conn = server.getConn;

var tempJWT_1;
var newUser_1;
var newUserID_1;
var tempJWT_2;
var newUser_2;
var newUserID_2;
var messageID;

suite('Message API Tests', function(){

    suiteSetup('Setup Users for chat', function(done){
        newUser_1 = {
            'username' : 'message_test_user_1',
            'password' : '123456',
        }
        newUser_2 = {
            'username' : 'message_test_user_2',
            'password' : '123456',
        }
        request(app)
        .post('/users')
        .send(newUser_1)
        .expect(201)
        .end(function(err, res){
            if (err) throw err;
            newUserID_1 = res.body._id;

            // Get the JWT of the Created User
            request(app)
            .post('/login')
            .send(newUser_1)
            .end(function(err, res){
                tempJWT_1 = res.body.token;

                request(app)
                .post('/users')
                .send(newUser_1)
                .expect(201)
                .end(function(err, res){
                    if (err) throw err;
                    newUserID_2 = res.body._id;

                    // Get the JWT of the Created User
                    request(app)
                    .post('/login')
                    .send(newUser_1)
                    .end(function(err, res){
                        tempJWT_2 = res.body.token;
                        done();
                    });
                });
            });
        });
    })

    test('Public Messages GET', function(done){
        request(app)
        .get('/messages')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.body).to.be.an('array');
            expect(res.statusCode).to.eql(200);
            done();
        });
    })

    test('Private Messages GET', function(done){
        request(app)
        .get('/messages/' + newUserID_1 + '/' + newUserID_2)
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.body).to.be.an('array');
            expect(res.statusCode).to.eql(200);
            done();
        });
    })

    test('Messages POST', function(done){
        let message = {
            sender : newUserID_1,
            receiver : newUserID_2,
            message : "Test message",
            sent_at : new Date(),
            broadcast : false,
            user_status: 2,
            user_status_information: 'IM AWESOME'
        };
        request(app)
        .post('/messages')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .send(message)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.body).to.be.an('object');
            expect(res.statusCode).to.eql(201);
            messageID = res.body._id;
            done();
        });
    })

    // Below are test cases for the APIs that is never used in our functionality

    test('Messages GET by ID', function(done){
        request(app)
        .get('/messages/' + messageID)
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.body).to.be.an('object');
            expect(res.statusCode).to.eql(200);
            done();
        });
    })

    test('Messages PUT', function(done){
        let updatedMessage = {
            sender : newUserID_1,
            receiver : newUserID_2,
            message : "Test message new",
        };
        request(app)
        .put('/messages/' + messageID)
        .set('Authorization', 'JWT ' + tempJWT_1)
        .send(updatedMessage)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.body).to.be.an('object');
            expect(res.statusCode).to.eql(200);
            done();
        });
    })

    test('Messages DELETE', function(done){
        request(app)
        .delete('/messages/' + messageID)
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.statusCode).to.eql(204);
            done();
        });
    })

    // Error cases

    test('Error Case - Messages POST - Invalid Sender', function(done){
        let invalidMessage = {
            sender : 'Invalid Sender',
            receiver : 'Invalid Receiver',
            message : "Test message new",
        };
        request(app)
        .post('/messages')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .send(invalidMessage)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.statusCode).to.eql(404);
            done();
        });
    })

    test('Error Case - Messages GET by ID - Invalid ID', function(done){
        request(app)
        .get('/messages/invalidID')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.statusCode).to.eql(404);
            done();
        });
    })

    test('Error Case - Messages PUT - Invalid ID', function(done){
        let updatedMessage = {
            id : 'invalidID',
            sender : newUserID_1,
            receiver : newUserID_2,
            message : "Test message new",
        };
        request(app)
        .put('/messages/invalidID')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .send(updatedMessage)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.statusCode).to.eql(404);
            done();
        });
    })

    test('Error Case - Messages DELETE - Invalid ID', function(done){
        request(app)
        .delete('/messages/invalidID')
        .set('Authorization', 'JWT ' + tempJWT_1)
        .end(function(err, res){
            expect(err).to.not.be.ok();
            expect(res).to.have.property('statusCode');
            expect(res).to.have.property('body');
            expect(res.statusCode).to.eql(404);
            done();
        });
    })

});
