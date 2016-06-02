#! /usr/bin/env node

'use strict';

var multiline = require('multiline');
var translateResx = require('./translate-resx');

var args = require( 'yargs' )
  .usage( '$0 <cmd> [args]' )
  .option( 'version', {
    alias: 'v',
    describe: 'Package Version'
  } )
  .option( 'file', {
    alias: 'f',
    describe: 'RESX File to Translate'
  } )
  .option( 'locale', {
    alias: 'l',
    describe: 'Locale to Translate to || Defaults to \'es\''
  } )
  .command( 'tresx', 'Translate Your RESX Files', {}, function ( argv ) {
    console.log( 'hello', argv.name, 'welcome to yargs!' )
  } )
  .help( 'help' )
  .argv;



if ( ( args.v ) || ( args.version ) ) {
  console.log();
  return console.log( require( './package' ).version );
}


if ( ( args.f ) || ( args.file ) && args.l ) {

  var locale = args.l || 'es';
  var filepath = args.f || args.file || '';

  translateResx.translate( filepath, locale );
}


if ( ( args.lc ) || ( args.locales ) ) {
  console.log( 'true' );
  var locale = 'en';
  translateResx.locales( locale );
}
