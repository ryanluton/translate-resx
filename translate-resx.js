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

// External libs
var xml2js = require( 'xml2js' ); //xml parser
var googleTranslate = require( 'google-translate' )( apiKey ); //google translate


//languages supported by google translate api
exports.locales = function (locale) {
  console.log('');
  console.log('Available Languages');
  googleTranslate.getSupportedLanguages(locale, function(err, languageCodes) {
    console.log(languageCodes);
    // => [{ language: "en", name: "English" }, ...]
  });
}

//translate resx file 
exports.translate = function ( filename, locale ) {

  var locale = locale;
  var fileToTranslate = 'AdminSettings.ascx';

  //local files not included in repo
  var resxFolderPath = './resx/';
  var completeFolderPath = './translated/';

  //clean this up
  var filePath = resxFolderPath + fileToTranslate + '.resx';
  var filePathToWrite = completeFolderPath + fileToTranslate + '.' + locale + '.resx';

  //////// TODO 
  // compare &nbsp;
  // check file length
  // error handling
  // cli or frontend to upload resx file
  // couchbase poc


  //translate text
  function sendToGoogle( data, fullFile ) {
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
      textToTranslate.push( value );
    }
    //console.log( textToTranslate.length );
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
    console.log( '  Parsing XML to JSON' );
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
      console.log( 'File written to ' + filePathToWrite );
    } );
  }

  //read file
  function readFile( filePath ) {
    var file = fs.readFileSync( filePath, "utf8" );
    parseXml( file );
  }

  //start it all
  readFile( filePath );


};
