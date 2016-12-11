module.exports = function (app) {

    /* require the modules needed */
    var oauthSignature = require('oauth-signature');
    var n = require('nonce')();
    var qs = require('querystring');
    var request = require('request');
    app.post('/api/search', searchQuery);
    app.post('/api/search/place', searchBusiness);
    var method = 'GET';

    var consumerSecret = process.env.YELP_CONSUMER_SECRET; //Consumer Secret
    var tokenSecret = process.env.YELP_SECRET_TOKEN; //Token Secret

    /**
     * method to perform yelp api search
     * @param req
     * @param res
     */
    function searchQuery(req, res) {
        var params = {
            oauth_consumer_key: process.env.YELP_CONSUMER_KEY, //Consumer Key
            oauth_token: process.env.YELP_TOKEN, //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: n().toString().substr(0,10),
            oauth_nonce: n()
        };
        var query = req.body;
        var location='Boston';
        var url = 'http://api.yelp.com/v2/search';
        var user = req.user;
        if(user){
            if(user.homeTown)
                location = user.homeTown;
        }
        if(query.location) {
            location = query.location;
        }
        if(query.offset)
            params['offset'] = query.offset;
        if(query.text && query.text != '')
            params['term'] = query.text;
        params['location'] = location;
        params['category_filter'] = 'restaurants';
        params['sort'] = 2;
        params['limit'] = 10;
        params['actionlinks'] = true;
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
        params['oauth_signature'] = signature;
        var paramURL = qs.stringify(params);
        /* Add the query string to the url */
        var apiURL = url+'?'+paramURL;
        request(apiURL, function(error, response, body){
            if (!error && response.statusCode == 200) {
                body[query] = query;
                var data = JSON.parse(body);
                data['query'] = query;
                res.json(data);
            } else{
                res.sendStatus(400).send(body);
            }
        });
    }

    function searchBusiness(req, res) {
        var params = {
            oauth_consumer_key: process.env.YELP_CONSUMER_KEY, //Consumer Key
            oauth_token: process.env.YELP_TOKEN, //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: n().toString().substr(0,10),
            oauth_nonce: n()
        };
        var query = req.body;
        var url = 'http://api.yelp.com/v2/business/' + query.text;
        params['actionlinks'] = true;
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
        params['oauth_signature'] = signature;
        var paramURL = qs.stringify(params);

        /* Add the query string to the url */
        var apiURL = url + '?'+paramURL;
        request(apiURL, function(error, response, body){
            if (!error && response.statusCode == 200) {
                body[query] = query;
                var data = JSON.parse(body);
                data['query'] = query;
                res.json(data);
            } else{
                res.sendStatus(400);
            }
        });
    }
};