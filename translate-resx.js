/*
 * translate-resx
 * https://github.com/ryanluton/translate-resx
 *
 * Copyright (c) 2016 Ryan Luton
 * Licensed under the MIT license.
 */

'use strict';

var apiKey = process.env.GOOGLE_API_KEY || ''; //API KEY FROM GOOGLE CLOUD PLATFORM

// Nodejs libs
var fs = require( 'fs' ); //filesystem
var path = require( 'path' );

// External libs
var xml2js = require( 'xml2js' ); //xml parser
var googleTranslate = require( 'google-translate' )( apiKey ); //google translate

//languages supported by google translate api
exports.locales = function ( locale ) {
  console.log( '' );
  console.log( 'Available Languages' );
  googleTranslate.getSupportedLanguages( locale, function ( err, languageCodes ) {
    console.log( languageCodes );
    // => [{ language: "en", name: "English" }, ...]
  } );
}

//translate resx file 
exports.translate = function ( filename, locale ) {

  //file .ext
  var fileExtension = path.extname( filename );

  //check if filetype matches 
  if ( fileExtension != '.resx' ) {
    return console.log( '\nFiletype does not match .resx or .RESX\n' );
  }

  var fileName = path.basename( filename, '.resx' );
  var folderPath = path.dirname( filename );
  var locale = locale;
  
  var costToTranslate = 0;
  var googleCost = 20 / 1000000;
  var charsToTranslate = 0;

  var fileToTranslate = folderPath + '/' + fileName + fileExtension;




  var filePathToWrite = folderPath + '/' + fileName + '.' + locale + fileExtension;

  //////// TODO 
  // compare &nbsp;
  // check file length
  // error handling
  // cli or frontend to upload resx file
  // couchbase poc


  //translate text
  function sendToGoogle( data, fullFile ) {
    console.log( '  Translating ' + fileToTranslate );
    //data = data.slice( 0, 50 );
    googleTranslate.translate( data, 'en', locale, function ( err, translations ) {
      if ( err ) {
        console.log( err );
      } else {
        var textToShip = [];
        for ( var i = 0; i < translations.length; i++ ) {
          var translatedText = translations[ i ].translatedText;
          //console.log( key + ' ' + value );
          textToShip.push( translatedText );
        }

        costToTranslate = (charsToTranslate * googleCost);
        //console.log( textToShip.length );
        //console.log( fullFile );
        buildXml( textToShip, fullFile );
      }
    } );
  }


  // var array = [ 'text' ],
  //   hasValue = [];
  // for ( var i = 0; i < Things.length; i++ ) {

  //   if ( Things[ i ].value ) {
  //     array.push( value );
  //     hasValue.push( thing[ i ] );
  //   }
  // }






  //prepare text
  function translateFile( data ) {
    var fullFile = data;
    var textStrings = data.root.data;
    var textToTranslate = [];
    for ( var i = 0; i < textStrings.length; i++ ) {
      var key = textStrings[ i ].$.name;
      var value = textStrings[ i ].value[ 0 ];
      //console.log( key + ' ' + value );
      charsToTranslate += value.length;
      textToTranslate.push( value );
    }
    console.log( '  Found ' + textToTranslate.length + ' words ('+charsToTranslate+' characters) to translate' );
    //post array
    sendToGoogle( textToTranslate, fullFile );
  }

  //build xml
  function buildXml( data, fullFile ) {


    var textToReplace = fullFile;

    for ( var i = 0; i < textToReplace.root.data.length; i++ ) {
      textToReplace.root.data[ i ].value = data[ i ];
    }

    //console.log(textToReplace);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject( textToReplace );
    writeFile( xml, filePathToWrite )
  }


  //parse xml
  function parseXml( data ) {
    console.log( '\n  Parsing XML for Translation to ' + locale);
    var parser = new xml2js.Parser();
    parser.parseString( data, function ( err, result ) {
      //console.log( result.root.data );
      translateFile( result );
    } );
  };


  //write file
  function writeFile( dataToWrite, filePathToWrite ) {
    fs.writeFile( filePathToWrite, dataToWrite, function ( err ) {
      if ( err ) return console.log( err );
      console.log( '  File written to ' + filePathToWrite );
      console.log( '  You just gave google aprox $'+ costToTranslate.toFixed(2));
      console.log( '' );
    } );
  }

  //read file
  function readFile( data ) {
    var file = fs.readFileSync( data, "utf8" );
    parseXml( file );
  }

  //start it all
  readFile( fileToTranslate );


};
