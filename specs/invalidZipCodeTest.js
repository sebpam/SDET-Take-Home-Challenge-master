const test = require('../validationsModules/getResponseValidation.js');
const scenario = require('../fixtures/scenarios.json');
describe('This test Validates the error response payload structure an invalid zip code', function(){
	test.runFailureAssertions( scenario[ 'invalidZip' ]);
});