#! /usr/bin/env node

'use strict';

var multiline = require( 'multiline' );
var translateResx = require( './translate-resx' );

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
  .demand('f')
  .option( 'locale', {
    alias: 'l',
    describe: 'Locale to Translate to || Defaults to \'es\''
  } )
  .demand('l')
  // .option( 'key', {
  //   alias: 'k',
  //   describe: 'API Key for use with configure'
  // } )
  .command( 'ls', 'List available Google Translate locales', {}, function ( argv ) {
    var locale = 'en';
    translateResx.locales( locale );
  } )
  // .command( 'configure', 'set Google Translate API Key', {}, function ( argv ) {
  //   //echo('export TESTENV='+argv.key);
  // } )
  .example('$0 -f foo.resx -l es', 'Translate foo.resx to foo.es.resx')
  .help( 'help' )
  .argv;



if ( ( args.v ) || ( args.version ) ) {
  console.log();
  return console.log( require( './package' ).version );
}


if ( ( args.f ) || ( args.file ) && ( args.l ) || ( args.locale ) ) {

  var locale = args.l || 'es';
  var filepath = args.f || args.file;

  translateResx.translate( filepath, locale );
}
