//import { times, property, omit } from 'lodash';
//import memoize from 'memize';

const { createBlock, registerBlockType } = wp.blocks;
const { PanelBody, RangeControl } = wp.components;
const { Fragment } = wp.element;
const { InspectorControls, InnerBlocks } = wp.blockEditor;

registerBlockType( 'typecase/slider', {
	title: 'Slider' ,
	icon: 'format-gallery',
	category: 'common',
	keywords: [],
	supports: {
		html: false,
		anchor: true,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		timeout: {
			type: 'number',
			default: 7,
		},
		slides: {
			source: 'attribute',
			selector: '.wp-block-typecase-slider',
			attribute: 'data-slides',
			default: 1
		}
	},
	description: 'A simple slider block',

	edit( { attributes, setAttribute, className } ) {
		const { timeout, slides } = attributes;
		//const classes = classnames( className, `timeout-${ timeout }` );

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<RangeControl
							label={ 'Timeout' }
							value={ timeout }
							onChange={ ( newTimeout ) => {
								setAttributes( {
									timeout: newTimeout,
								} );
							} }
							min={ 2 }
							max={ 20 }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ className }>
					<InnerBlocks 
						allowedBlocks={ [ 'typecase/slider-slide' ] }
					/>
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { timeout, slides } = attributes;

		return (
			<div data-timeout={ timeout } data-slides={ slides }  className={ `timeout-${ timeout }` }>
				<InnerBlocks.Content />
			</div>
		);
	},

});
