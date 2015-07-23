/**
 * Created by riquema on 22/07/2015.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var chakram = require('chakram'),
    FormUrlencoded = require('form-urlencoded'),
    expect = chakram.expect;

describe('it should do something', function() {
    it('should do something', function () {
        var response = chakram.get('https://api.qa5.ozforex.local/refdata.apiservice/Currencies?format=json');
        expect(response).to.have.status(200);
        return chakram.wait()
            .then(function (response) {
                var apiResponse = JSON.stringify(response.body);
                console.log(apiResponse);
            });
    });
});

describe('posting information',(function(){
    it('should post information and get a response',function(){

    })
}))