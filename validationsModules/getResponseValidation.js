const expect = require('chai').expect;
const request = require('../base/restClient')['submitGetRequest'];

//let response = [];
//let singlObjFromResp = {};
//let statusCode;

const hoursOfOperations = require('../fixtures/hoursOfOperations.json')

module.exports = {

    // submitGetRequest: function( scenario ){

    // 	it('Should make get call and save response', function( done ){
    		
    // 		const getParams = "?" + "sku="+ scenario.sku + "&zipcode=" + scenario.zipCode;
    //         request( getParams, function( err, rsp ){
    //         	if( err ){
    //         		console.log( err );
    //                 done();
    //         	} else {
    //         		response = rsp.body;
    //         		statusCode = rsp.statusCode;
    //                 done();
    //         	}
    //         });
    // 	});
    // },

    runSuccessAssertions: function( scenario ){

    	//this.submitGetRequest( scenario );

        let cityName = scenario.city;

        let response = [];
        let singlObjFromResp = {};
        let statusCode;


        it('Should make get call and save response', function( done ){
            
            const getParams = "?" + "sku="+ scenario.sku + "&zipcode=" + scenario.zipCode;
            request( getParams, function( err, rsp ){
                if( err ){
                    console.log( err );
                    done();
                } else {
                    response = rsp.body;
                    statusCode = rsp.statusCode;
                    done();
                }
            });
        });


 
        it('Should validate all address response obj properties are accordingly returned', function(){
            response.forEach( function( addrObj ){
            	let addrObjproperties = Object.getOwnPropertyNames( addrObj ).sort();
                let responseProperties = [ 'address1','city','hours','latitude','longitude','phoneNumber','state','storeName','storeNumber','zipcode' ]
                if( addrObjproperties.length > 10 ){
                    responseProperties.push( 'address2' );
                }
                expect( addrObjproperties ).to.eql( responseProperties.sort() );
            });            
    	});

        it('Should validate all hours response obj properties are accordingly returned', function(){
            response.forEach( function( addrObj, i ){
                let hoursObjProperties = Object.getOwnPropertyNames( addrObj.hours ).sort();
                let options = {
                    0: JSON.stringify( [ 'regularHours','specialHours' ].sort() ),
                    1: JSON.stringify( [ 'regularHours','pickupHours' ].sort() ),
                    3: JSON.stringify( [ 'regularHours','pickupHours', 'specialHours' ].sort() ),
                    4: JSON.stringify( [ 'pickupHours', 'specialHours' ].sort() )
                };
                let a = JSON.stringify( hoursObjProperties );                
                let t = function(){
                    if( a === options[ 0 ] || a === options[ 1 ] || a === options[ 2 ] || a === options[ 3 ] || a === options[ 4 ] ){
                        return true;
                    } else {
                        return false;
                    }
                }
                expect( t() ).to.equal( true );
            });          
        });
        
        it("Should capture and save specific city object from response", function( done ){
            singlObjFromResp = response.find( function( obj ){
                return obj.city === cityName;
            });
            done();
        });

        it("Should validate correct first line address is returned", function(){
            expect( singlObjFromResp.address1 ).to.equal( scenario.address1 );
        });

        if( scenario.address2 ){
            it("Should validate correct second line address is returned", function(){
               expect( singlObjFromResp.address2 ).to.equal( scenario.address2 );
            });
        }

        it("Should validate the correct city latitude is returned", function(){
            expect( singlObjFromResp.latitude ).to.equal( scenario.latitude );
        });

        it("Should validate the correct city longitude is returned", function(){
            expect( singlObjFromResp.longitude ).to.equal( scenario.longitude );
        });

        it("Should validate the correct store phone number is returned", function(){
            expect( singlObjFromResp.phoneNumber ).to.equal( scenario.phoneNumber );
        });

        it("Should validate the correct state value is returned", function(){
            expect( singlObjFromResp.state ).to.equal( scenario.state );
        });

        it("Should validate the correct store name is returned", function(){
            expect( singlObjFromResp.storeName ).to.equal( scenario.storeName );
        });

        it("Should validate the correct store number is returned", function(){
            expect( singlObjFromResp.storeNumber ).to.equal( scenario.storeNumber );
        });

        it("Should validate the correct zip code is returned", function(){
            expect( singlObjFromResp.zipcode ).to.equal( scenario.zipcode );
        });

        if( scenario.regularHours ){           
            it(`Should validate the regular closing hours for ${cityName} city are returned`, function(){         
                let timeIndex;
                singlObjFromResp.hours.regularHours.forEach( function( regHrs ) {
                    timeIndex = scenario.regularHours.closeTimes[ regHrs.dayIndex ];                 
                    expect( regHrs.closeTime ).to.equal( hoursOfOperations.closeTimes[ timeIndex ] );
                });
            });

            it(`Should validate the regular opening hours for ${cityName} city are returned`, function(){         
                let timeIndex;
                singlObjFromResp.hours.regularHours.forEach( function( regHrs ) {
                    timeIndex = scenario.regularHours.openTimes[ regHrs.dayIndex ];                 
                    expect( regHrs.openTime ).to.equal( hoursOfOperations.openTimes[ timeIndex ] );
                });
            });
        }
        
        if( scenario.pickupHours ){           
            it(`Should validate the correct pick up closing hours for ${cityName} city are returned`, function(){         
                let timeIndex;
                singlObjFromResp.hours.pickupHours.forEach( function( pckpHrs ) {
                    timeIndex = scenario.pickupHours.closeTimes[ pckpHrs.dayIndex ];                 
                    expect( pckpHrs.closeTime ).to.equal( hoursOfOperations.closeTimes[ timeIndex ] );
                });
            });

            it(`Should validate the correct pick up opening hours for ${cityName} city are returned`, function(){         
                let timeIndex;
                singlObjFromResp.hours.pickupHours.forEach( function( pckpHrs ) {
                    timeIndex = scenario.pickupHours.openTimes[ pckpHrs.dayIndex ];                 
                    expect( pckpHrs.openTime ).to.equal( hoursOfOperations.openTimes[ timeIndex ] );
                });
            });
        }

        if( scenario.specialHours ){
            it('Should validate the correct special hours is open valud is returned', function(){
                expect( singlObjFromResp.hours.specialHours[ 0 ].isOpen ).to.equal( scenario.specialHours.isOpen );
            });
            it('Should validate the correct special hours close time is returned', function(){
                expect( singlObjFromResp.hours.specialHours[ 0 ].closeTime ).to.equal( scenario.specialHours.closeTime );
            });
            it('Should validate the correct special hours open time is returned', function(){
                expect( singlObjFromResp.hours.specialHours[ 0 ].openTime ).to.equal( scenario.specialHours.openTime );
            });
        }

    },

    runFailureAssertions: function( scenario ){


        let response = [];
        let singlObjFromResp = {};
        let statusCode;


        it('Should make get call and save response', function( done ){
            
            const getParams = "?" + "sku="+ scenario.sku + "&zipcode=" + scenario.zipCode;
            request( getParams, function( err, rsp ){
                if( err ){
                    console.log( err );
                    done();
                } else {
                    response = rsp.body;
                    statusCode = rsp.statusCode;
                    done();
                }
            });
        });

        let type = scenario.errorResponse.type ? scenario.errorResponse.type : "object";
        let errorObj = {};
        let innerErrorObj = {};
        this.submitGetRequest( scenario );

        if( scenario.errorResponse.type.toLowerCase() === "array" ){

            it("Should validate the error response payload structure", function(){                
                response.forEach( function( rsp ){
                    let responseObjproperties = Object.getOwnPropertyNames( rsp );
                    expect( responseObjproperties.sort() ).to.eql( [ 'error', 'message' ].sort() );
                });                    
            });

            it("Should validate the resposne inrer error obj structure", function(){
                response.forEach( function( rsp ){
                    rsp.error.forEach( function( erObj ){
                        let errorObjKeys = Object.getOwnPropertyNames( erObj ).sort();
                        expect( errorObjKeys ).to.eql( [ 'code','params','message','path' ].sort());
                    });
                });
            })
          
            scenario.errorResponse.errors.forEach( function( errs, i ){

                it("Should capture the error obj", function(){
                    errorObj = response.find( function( eObj ){
                        return eObj.message.replace(/\s/g, '') === errs.message.replace(/\s/g, '');
                    } );                 
                }); 

                it("Should validate the error code", function(){
                    expect( errorObj.error[ 0 ].code ).to.equal( errs.error[ 0 ].code )
                });

                it("Should validate the regex list", function(){
                    expect( errorObj.error[ 0 ].params ).to.have.members( errs.error[ 0 ].params )
                });  

                it("Should validate the error message", function(){
                    expect( errorObj.error[ 0 ].message ).to.equal( errs.error[ 0 ].message )
                });  

                it("Should validate the error path", function(){
                    expect( errorObj.error[ 0 ].path ).to.equal( errs.error[ 0 ].path )
                });        
            });
                       

        } else {

            it("Should validate the error response payload structure", function(){
                let responseObjproperties = Object.getOwnPropertyNames( response );
                let errorObj = Object.getOwnPropertyNames( response.error );
                expect( responseObjproperties ).to.eql( [ 'error' ] );
                expect( errorObj ).to.eql( [ 'message' ] )        
            });

            it("Should validate the correct error message is returned", function(){
                expect( response.error.message.replace(/\s/g, '') ).to.equal( scenario.errorResponse.errorMessage.replace(/\s/g, '' ) );
            });

        }
        
    }

};
