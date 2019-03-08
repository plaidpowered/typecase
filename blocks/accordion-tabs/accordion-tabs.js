//import { times, property, omit } from 'lodash';
//import memoize from 'memize';

const { createBlock, registerBlockType } = wp.blocks;
const { PanelBody, ToggleControl, TextControl } = wp.components;
const { Fragment } = wp.element;
const { InspectorControls, InnerBlocks } = wp.editor;

registerBlockType( 'typecase/accordion-tabs', {
	title: 'Accordion/Tabs' ,
	icon: 'list-view',
	category: 'common',
	keywords: [],
	supports: {
		html: false,
		anchor: true,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		/* this attribute is backward. if it's 'true', it will show an accordion, not tabs */
		displayAsTabs: {		
			type: 'boolean'	,
			default: false,
		},
		autoClose: {		
			type: 'boolean'	,
			default: false,
		},
		mobileWidth: {
			type: 'string',
			default: 600
		},
		collapsedByDefault: {
			type: 'boolean',
			default: false
		}
	},
	description: 'Tabbed or Accordion-collapsed content',

	edit( { attributes, setAttributes, className } ) {
		const { displayAsTabs, autoClose, mobileWidth, collapsedByDefault } = attributes;
		//const classes = classnames( className, `timeout-${ timeout }` );

		if (! mobileWidth) {
			setAttributes( { mobileWidth: 600 } );
		}

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<ToggleControl
							label={ 'Behave as accordion' }							
							checked={ displayAsTabs }
							onChange={ () => {
								setAttributes( {
									displayAsTabs: ! displayAsTabs,
								} );
							} }
						/>
						<ToggleControl
							label={ 'Auto-close other tabs when new tab is opened' }
							help={ '(Only affects accordion behavior)' }
							checked={ autoClose }
							onChange={ () => {
								setAttributes( {
									autoClose: ! autoClose,
								} );
							} }
						/>
						<ToggleControl
							label={ 'Do not open first tab' }
							help={ '(Only affects accordion behavior)' }
							checked={ collapsedByDefault }
							onChange={ () => {
								setAttributes( {
									collapsedByDefault: ! collapsedByDefault,
								} );
							} }
						/>
						<TextControl
							label={ 'Maximum Width for Mobile Tabs' }
							help={ '(Only affects tab behavior)' }
							value={ mobileWidth }
							onChange={ ( newWidth ) => {
								setAttributes( { mobileWidth: newWidth } );
							} }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ className } >
					<InnerBlocks 
						allowedBlocks={ [ 'typecase/accordion-tabs-content' ] }
					/>
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { displayAsTabs, autoClose, mobileWidth, collapsedByDefault } = attributes;

		let classBehavior = !! displayAsTabs ? '__use-accordion' : '__use-tabs';

		if (!! autoClose && !! displayAsTabs) {
			classBehavior += ' __auto-close';
		}	

		if (!! collapsedByDefault) {
			classBehavior += ' __load-collapsed';
		}

		/** for backward compatibility with versions that were missing the mobile-width data attribute: */
		if (parseInt(mobileWidth, 10) === 600) {

			return (
				<div className={ classBehavior } >
					<InnerBlocks.Content />
				</div>
			);

		} else {

			return (
				<div className={ classBehavior } data-mobile-width={ mobileWidth || 600 } >
					<InnerBlocks.Content />
				</div>
			);

		}

		
		
	},

});
