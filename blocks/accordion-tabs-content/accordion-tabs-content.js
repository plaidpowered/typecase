//import { isEmpty, times } from 'lodash';

const { Fragment } = wp.element;
const { createBlock, registerBlockType } = wp.blocks;
const { 
	InspectorControls, 
	InnerBlocks, 
	RichText
} = wp.editor;

registerBlockType( 'typecase/accordion-tabs-content', {

    title: 'Accordion/Tab Content Section',
	parent: [ 'typecase/accordion-tabs' ],
	icon: 'welcome-write-blog',
	description: 'A content section within an Accordion/Tab block',
    attributes: {},
    category: 'common',
    keywords: [],
	supports: {
		html: false,
		anchor: false
	},

	attributes: {
        title: {
            type: 'array',
            source: 'children',
            selector: 'h2.--title',
        }
    },

    edit( { attributes, className, setAttributes } ) {

		const { title } = attributes;

		return (
			<div className={ className }>
				<RichText
					tagName="h2"
					placeholder={ 'Section title…' }
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					inlineToolbar
				/>
				<div>
					<InnerBlocks />
				</div>
			</div>
		);
	},
    
    save( { attributes, className } ) {
		
		const { title } = attributes;		

		return (
			<section className={ className }>
				<h2 className="--title">{ title }</h2>
				<div className="--content">
					<InnerBlocks.Content />
				</div>
			</section>
		);
	}
    
});