/**
 * Created by riquema on 22/07/2015.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var chakram = require('chakram'),
    FormUrlencoded = require('form-urlencoded'),
    expect = chakram.expect;

describe('Get - ref data', function() {
    it('should bring back all currencies', function () {
        var response = chakram.get('https://api.qa5.ozforex.local/refdata.apiservice/Currencies?format=json');
        expect(response).to.have.status(200);
        return chakram.wait()
            .then(function (response) {
                var apiResponse = JSON.stringify(response.body);
                console.log('Currency list:' + apiResponse);
            });
    });
});

describe('POST - Authentication request',(function(){
    it('Should bring back an access token',function(){

        var postData = FormUrlencoded.encode(
            {
                'client_id' : 'ozforex.qa5.ozforex.local',
                'redirect_uri' : 'https://ozforex.qa5.ozforex.local/login/token',
                'response_type' : 'code',
                'scope' : 'ALLAPI',
                'state' : 'qwerty',
                'Username' : 'jacksda',
                'Password' : 'Testuser1'
            });
        var options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            },
            followAllRedirects: true,
            timeout: 10000
        };

        var response = chakram.post('https://api.qa5.ozforex.local/authentication.apiservice/authorise', postData,options);
        return chakram.waitFor([
            expect(response).to.have.status(200),
            expect(response).to.have.schema({
                "type" : "object",
                properties: {
                    encriptedToken : {
                        type: 'string'
                    },
                    accesstoken : {
                        type: 'string'
                    }

                }
            })

        ])
            .then(function(response){
                var apiResponse = JSON.stringify(response.body.accesstoken);
                console.log('access token :' + apiResponse);
            })



    })
}))