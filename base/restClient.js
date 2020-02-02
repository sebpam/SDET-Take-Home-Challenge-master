const request = require('supertest');
const urls = require('../config/urls');

module.exports = {

    submitGetRequest: function( params, returnResponse ){
        request( urls[ 'baseUrl' ] )
            .get( urls[ 'endpoints' ][ 'get' ] + params )
            .set( { 'Content-type':'application/json' } )
            .end( returnResponse );
    }

};