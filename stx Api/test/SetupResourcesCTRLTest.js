
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('SetupResources CTRL Testing', () => {
    describe('/Create SetupResources', () => {
        // Here we passing valid data
        it('Create SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test1',
                "numberAvailable": 1
            };
            chai.request(app).post('/api/setupservices/resources').send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Create SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test1',
                "numberAvailable": 1
            };
            chai.request(app).post('/api/setupservices/resources').send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test',
                "numberAvailable": 1
            };
            chai.request(app).post('/api/setupservices/resources').send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });
    describe('/Update SetupResources', () => {
        // Here we passing valid data
        it('Update SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test2',
                "numberAvailable": 1
            };
            chai.request(app).put('/api/setupservices/resources/' + id).send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Update SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test21',
                "numberAvailable": 1
            };
            chai.request(app).put('/api/setupservices/resources/' + id).send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Update SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ResourcesObj = {
                "resourceActive": true,
                "resourceName": 'Test2',
                "numberAvailable": 1
            };
            chai.request(app).put('/api/setupservices/resources/' + id).send(ResourcesObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });

    describe('/Get SetupResources', () => {
        // Here we passing valid data
        it('Get SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = 'false';
            chai.request(app).get('/api/setupservices/resources/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Get SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = '';
            chai.request(app).get('/api/setupservices/resources/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Get SetupResources - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = 'true';
            chai.request(app).get('/api/setupservices/resources/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });
});