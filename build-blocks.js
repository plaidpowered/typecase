'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on( 'unhandledRejection', err => {
	throw err;
} );

// Modules.
const fs = require( 'fs' );
const ora = require( 'ora' );
const path = require( 'path' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
//const fileSize = require( 'filesize' );
//const gzipSize = require( 'gzip-size' );
const resolvePkg = require( 'resolve-pkg' );
const config = require( './webpack.config' );
const cgbDevUtilsPath = resolvePkg( 'cgb-dev-utils', { cwd: __dirname } );
const clearConsole = require( cgbDevUtilsPath + '/clearConsole' );
const formatWebpackMessages = require( cgbDevUtilsPath +
	'/formatWebpackMessages' );

/**
 * Build function
 *
 * Create the production build and print the deployment instructions.
 *
 * @param {json} webpackConfig config
 */
async function build( webpackConfig ) {
	// Compiler Instance.
	const compiler = await webpack( webpackConfig );

	// Run the compiler.
	compiler.run( (err, stats) => {

		if (err) {
			return console.log( err );
		}

		// Get the messages formatted.
		const messages = formatWebpackMessages( stats.toJson( {}, true ) );

		// If there are errors just show the errors.
		if ( messages.errors.length ) {
			// Only keep the first error. Others are often indicative
			// of the same problem, but confuse the reader with noise.
			if (messages.errors.length > 1) {
				messages.errors.length = 1;
			}
			// Formatted errors.
			console.log( '\n❌ ', chalk.black.bgRed( ' Failed to compile build. \n' ) );
			console.log( '\n👉 ', messages.errors.join( '\n\n' ) );

			// Don't go beyond this point at this time.
			return;
		}

		// CI.
		if (process.env.CI 
		&& (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') 
		&&  messages.warnings.length) {
			console.log(
				chalk.yellow(
					'\nTreating warnings as errors because process.env.CI = true.\n' +
						'Most CI servers set it automatically.\n'
				)
			);
			console.log( messages.warnings.join( '\n\n' ) );
		}

		// Start the build.
		console.log( chalk.green('>> '),  ' Blocks built successfully!' );

		return true;

	});
}

//console.log(config);

build( config );
