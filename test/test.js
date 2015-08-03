var chakram = require('chakram');
var FormUrlencoded = require('form-urlencoded');
var config = require('./../util/settings').config();
var _helpers = require('./../util/helpers').init(config);
var expect = chakram.expect;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var hasToken = false;
var token = '';

describe('Quote API', function() {
    this.timeout(100000);
    var check = function(done) {
        if (hasToken) done();
        else setTimeout(function() {check(done)}, 1000);
    }

    before(function(done){
        _helpers.getAccessToken(config)
            .then(function (data) {
                return data.body.accesstoken;
            }).then(function (accessToken) {
                token = accessToken;
                hasToken = true;
            });
        check(done);
    });

    describe("Create a Quote", function () {
        //<editor-fold desc="headers, parameters and schema">
        var ShouldPostQuote = function (buyCCY,buyAmount,sellCCY,sellAmount,brandType) {
            it("Post a Quote", function () {
                var getstring = "https://" + config.baseApiUrl + "/Quote.apiservice/Quote?format=json";
                var postData = FormUrlencoded.encode(
                    {
                        'Username': config.username,
                        'BuyCurrency': buyCCY,
                        'BuyAmount': buyAmount,
                        'SellCurrency': sellCCY,
                        'SellAmount': sellAmount,
                        'SystemNameShort': brandType,
                        'LegalEntityAlias': brandType
                    });
                var options = {
                    headers: {
                        'Authorization' : "bearer " + token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };
                return chakram.post(getstring, postData, options)
                    .then(function (response) {
                        var responseSchema = {
                            properties: {
                                Id: 'string',
                                IsError : 'string'
                            },
                            required: ["Id"]
                        };
                        return chakram.waitFor([
                            expect(response).to.have.status(200),
                            expect(response).to.have.schema(responseSchema)
                        ]);
                    });
            });
        };
        //</editor-fold>
        ShouldPostQuote('AUD',2000,'USD',0,'ozforex');
        ShouldPostQuote('GBP',0,'USD',2000,'ozforex');
    });
});