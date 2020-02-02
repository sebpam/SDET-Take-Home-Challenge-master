const test = require('../validationsModules/getResponseValidation.js');
const scenario = require('../fixtures/scenarios.json');
describe('This test Validates the error response payload structure with an invalid zip & sku regex', function(){
	test.runFailureAssertions( scenario[ 'missingZip' ]);
});