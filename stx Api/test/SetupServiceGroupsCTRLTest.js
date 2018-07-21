
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Setup ServiceGroups CTRL Testing', () => {
    describe('/Create Setup ServiceGroups', () => {
        // Here we passing valid data
        it('Create Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdf',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd'
            };
            chai.request(app).post('/api/setupservices/servicegroups').send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Create Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdfq',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd'
            };
            chai.request(app).post('/api/setupservices/servicegroups').send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdfka',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd'
            };
            chai.request(app).post('/api/setupservices/servicegroups').send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });
    describe('/Update Setup ServiceGroups', () => {
        // Here we passing valid data
        it('Update Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdfka',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd'
            };
            chai.request(app).put('/api/setupservices/servicegroups/' + id).send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Update Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdfka2',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd23'
            };
            chai.request(app).put('/api/setupservices/servicegroups/' + id).send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Update Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var id = 62;
            let ServiceGroupsObj = {
                "serviceActive": true,
                "serviceName": 'afdfkar',
                "color": '#ffffff',
                "sortOrder": '3',
                "onlineName": 'sd'
            };
            chai.request(app).put('/api/setupservices/servicegroups/' + id).send(ServiceGroupsObj).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });

    describe('/Get Setup ServiceGroups', () => {
        // Here we passing valid data
        it('Get Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = 'false';
            chai.request(app).get('/api/setupservices/servicegroups/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing valid data
        it('Get Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = '';
            chai.request(app).get('/api/setupservices/servicegroups/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Get Setup ServiceGroups - Positive', function (done) {
            this.timeout(10000);
            setTimeout(done, 5000);
            var type = 'true';
            chai.request(app).get('/api/setupservices/servicegroups/' + type).end((err, res) => {
                if (res.body.status == '1001') {
                    console.log(' ============ ', res.body.message);
                } else {
                    console.log(' ============ ', res.body.message);
                }
            });
        });
    });
});