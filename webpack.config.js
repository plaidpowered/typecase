/*global require*/

const fs = require( 'fs' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const autoprefixer = require( 'autoprefixer' );

const pluginDir = fs.realpathSync( process.cwd() );
const resolvePlugin = relativePath => path.resolve( pluginDir, relativePath );

const extractConfig = {
	use: [],
};

module.exports = {
	entry: {
		'_build/accordion-tabs/accordion-tabs': resolvePlugin( 'blocks/accordion-tabs/accordion-tabs.js' ),
		'_build/accordion-tabs-content/accordion-tabs-content': resolvePlugin( 'blocks/accordion-tabs-content/accordion-tabs-content.js' ),
		'_build/cta/cta': resolvePlugin( 'blocks/cta/cta.js' ),
		'_build/container/container': resolvePlugin( 'blocks/container/container.js' ),
		'_build/email-signup/email-signup': resolvePlugin( 'blocks/email-signup/email-signup.js' ),
		'_build/page-index/page-index': resolvePlugin( 'blocks/page-index/page-index.js' ),
		'_build/single-post/single-post': resolvePlugin( 'blocks/single-post/single-post.js' ),
		'_build/search/search': resolvePlugin( 'blocks/search/search.js' ),
		'_build/slider/slider': resolvePlugin( 'blocks/slider/slider.js' ),
		'_build/slider-slide/slider-slide': resolvePlugin( 'blocks/slider-slide/slider-slide.js' ),
	},
	output: {
		pathinfo: true,
		path: resolvePlugin('.'),
		filename: '[name].js',
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.(js|jsx|mjs)$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				},
			},
		}],
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				comparisons: false,
			},
			mangle: {
				safari10: true,
			},
			output: {
				comments: false,
				ascii_only: true,
			},
			sourceMap: false,
		}),
	],
	stats: 'minimal',
};
