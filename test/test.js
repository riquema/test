var chakram = require('chakram');
var FormUrlencoded = require('form-urlencoded');
var config = require('./../util/settings').config();
var _helpers = require('./../util/helpers').init(config);
var expect = chakram.expect;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var hasToken = false;
var token = '';
var QuoteID = [];

describe('Quote API', function() {
    this.timeout(100000);
    var check = function(done) {
        if (hasToken) done();
        else setTimeout(function() {check(done)}, 1000);
    };

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
            it("Post a Quote "+buyCCY+"/"+sellCCY, function () {
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
                        ])
                            .then(function() {
                            var apiResponse = JSON.stringify(response.body.Id);
                                for (var i = 0; i < apiResponse.body; i++) {
                                    apiResponse[i] = ({key:apiResponse.body[i].Id,sortable:true, resizable:true});
                                }
                                QuoteID = apiResponse;
                        }).then(function() {
                                console.log("Quote ID is ="+QuoteID);
                            });
                    });
            });
        };
        //</editor-fold>
        ShouldPostQuote('AUD',2000,'USD',0,'ozforex');
        ShouldPostQuote('GBP',0,'USD',2000,'ozforex');
    });
    describe('Get Quote', function() {
        var ShouldGetQuote = function() {
            it('Should get quote for', function() {
                var getstring = "https://" + config.baseApiUrl + '/Quote.apiservice/Quote?format=json&Id='+QuoteID;
                var params = {
                    "headers": {
                        "Authorization" : "bearer " + token,
                        "Content-Type" : "application/json"
                    }
                };
                return chakram.get(getstring,params)
                    .then(function(response) {
                        var responseSchema = {
                            properties: {
                                "BuyCurrency": "string",
                                "BuyAmount": "int",
                                "SellCurrency": "string",
                                "SellAmount": "int",
                                "CustomerRate": "int",
                                "Fee": "int",
                                "FeeCurrency": "string"

                            },
                            required: ["BuyCurrency", "BuyAmount", "SellCurrency", "SellAmount", "CustomerRate", "Fee", "FeeCurrency"]
                        };
                        return chakram.waitFor([
                            expect(response).to.have.status(200),
                            expect(response).to.have.schema(responseSchema)
                        ]).then(function() {
                            var apiResponse = JSON.stringify(response.body);
                            console.log(QuoteID+ ' test ' +apiResponse);
                        });
                    });
            });
        };
        ShouldGetQuote()

    });
});