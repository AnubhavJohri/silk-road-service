const fs = require( 'fs' );

//Log the error
let errorLogger = ( err, req, res, next ) => {
    if( err ){
        fs.appendFile( 'ErrorLogger.txt', new Date() + " - " + err.stack + "\n", ( error )=>{
            if( error ) {
                // console.log( "Logging Error Failed" )
            }
        } );
        if( err.status ) {
            res.status( err.status );
        } else{
            res.status(500) ;
        }
        res.json( { "message": err.message } );
        next();
    }
}

module.exports = errorLogger;