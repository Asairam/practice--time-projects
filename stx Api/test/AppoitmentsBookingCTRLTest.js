
var app = require('../app');
var config = require('config');
// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var unitTest = require('../config/unitTest');

describe('Appoitments Booking CTRL Testing', () => {
    describe('/Create Appoitment', () => {
        // Here we passing valid data
        it('Create Appoitment - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let AppoitmentObj = {
                "bookingInterval": '45',
                "booked": '#A52A2A',
                "reminder": '#5F9EA0',
                "called": '#7FFF00',
                "confirmed": '#D2691E',
                "cancelled": '#DC143C',
                "checkedIn": '#00FFFF',
                "noShow": '#00008B',
                "complete": '#008B8B',
                "conflict": '#B8860B',
                "pendingDeposit": '#8B008B',
                "maximumAvailabilities": '245',
                "displayAvailabilities": 'Ranking Order',
                "isClientNameRequire": true
                };
            chai.request(app).post('/api/appointments/booking').send(AppoitmentObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        // Here we passing invalid data
        it('Create Appoitment - Positive', function(done){
            this.timeout(10000);
            setTimeout(done, 5000);
            let AppoitmentObj = {
                "bookinsdfgInterval": '45',
                "booked": '#A52A2A',
                "remsdinder": '#5F9EA0',
                "called": '#7FFF00',
                "confirmed": '#D2691E',
                "cancelled": '#DC143C',
                "checkedIn": '#00FFFF',
                "noShow": '#00008B',
                "complete": '#008B8B',
                "conflict": '#B8860B',
                "pendingDeposit": '#8B008B',
                "maximumAvailabilities": '245',
                "displayAvailabilities": 'Ranking Order',
                "isClientNameRequire": true
                };
            chai.request(app).post('/api/appointments/booking').send(AppoitmentObj).end((err, res) => {
                if(res.body.status == '1011') {
                    console.log(' ============ ', res.body.message);
                } else{
                    console.log(' ============ ', res.body.message);
                }
            });
        });
        });
});