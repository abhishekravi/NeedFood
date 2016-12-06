module.exports = function (app) {

    /* require the modules needed */
    var oauthSignature = require('oauth-signature');
    var n = require('nonce')();
    var qs = require('querystring');
    var request = require('request');
    app.post('/api/search', searchQuery);

    /**
     * method to perform yelp api search
     * @param req
     * @param res
     */
    function searchQuery(req, res) {
        var query = req.body;
        var method = 'GET';
        var url = 'http://api.yelp.com/v2/search';
        var user = req.user;
        var location = 'Boston';
        if(user){
            if(user.homeTown)
                location = user.homeTown;
        }
        if(query.location) {
            location = query.location;
        }

        var params = {
            location: location,
            oauth_consumer_key: process.env.YELP_CONSUMER_KEY, //Consumer Key
            oauth_token: process.env.YELP_TOKEN, //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: n().toString().substr(0,10),
            oauth_nonce: n(),
            category_filter: 'food',
            sort: 2,
            limit: 10,
            actionlinks: true
        };
        if(query.text && query.text != '')
            params['term'] = query.text;
        var consumerSecret = process.env.YELP_CONSUMER_SECRET; //Consumer Secret
        var tokenSecret = process.env.YELP_SECRET_TOKEN; //Token Secret
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
        params['oauth_signature'] = signature;
        var paramURL = qs.stringify(params);

        /* Add the query string to the url */
        var apiURL = url+'?'+paramURL;
        request(apiURL, function(error, response, body){
            if (!error && response.statusCode == 200) {
                //var data = JSON.parse(body)
                res.send(body);
            } else{
                res.sendStatus(400).send(body);
            }
        });
    }
};