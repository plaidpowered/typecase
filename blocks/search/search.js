//import { isEmpty, times } from 'lodash';

const { 
	Dashicon, 
	IconButton, 
	PanelBody, 
	RangeControl, 
	TextControl,
	ToggleControl, 
	Toolbar, 
	withNotices 
} = wp.components;
const { Fragment } = wp.element;
const { createBlock, registerBlockType } = wp.blocks;
const { 
	URLInput,
    BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	AlignmentToolbar,
    RichText
} = wp.editor;

function backgroundImageStyles( url ) {
	return url ?
		{ backgroundImage: `url(${ url })` } :
		undefined;
}

registerBlockType( 'typecase/search', {

    title: 'Search Form',
	icon: 'search',
	description: 'Search widget',
    attributes: {},
    category: 'widgets',
    keywords: [],
	supports: {
		html: false,
		anchor: false
	},

	attributes: {
        title: {
            type: 'array',
            source: 'children',
            selector: 'h4',
            default: 'Search our site'
        },
        content: {
            type: 'array',
            source: 'children',
            selector: 'p'
        },
        image: {
            type: 'string'
        },
        id: {
            type: 'number'
        },
        contentAlign: {
            type: 'string',
            default: 'left',
		},
		textReverse: {
			type: 'boolean',
			default: false
		}
    },

    edit: withNotices( ( { attributes, setAttributes, className } ) => {
		const { id, title, content, image, contentAlign, textReverse, submitLabel, formAction } = attributes;

        const onSelectImage = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { image: undefined, id: undefined } );
				return;
			}
			setAttributes( { image: media.url, id: media.id } );
		};

		//const style = backgroundImageStyles( image );
        let classes = className;
        if (contentAlign !== 'left') {
            classes += ` has-${ contentAlign }-content`;
        }

		const controls = (
			<Fragment>
				<BlockControls>
					<AlignmentToolbar
						value={ contentAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { contentAlign: nextAlign } );
						} }
					/>
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ id }
							allowedTypes={['image']}
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ 'Edit image' }
									icon="format-image"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
			</Fragment>
        );

        let uploader = <img className="background" src={ image } />;

		if ( ! image ) {			
            classes += ` no-image-selected`;            
            upload = '';
		}

		return (
			<Fragment>
				<Fragment>
					{ controls }				
					<InspectorControls>
						<PanelBody title={ 'Form Content Settings' }>
							<ToggleControl
								label={ 'Reverse Text Color (for dark photos)' }
								checked={ !! textReverse }
								onChange={ () => setAttributes( { textReverse: ! textReverse } ) }
							/>
						</PanelBody>
						<PanelBody title={ 'Form Settings' }>
							<TextControl
								label={ 'Form Action' }
								value={ formAction }												
								onChange={ ( newAction ) => {
									setAttributes( { formAction: newAction } );
								} }
							/>
							<TextControl
								label={ 'Submit Label' }
								value={ submitLabel }
								placeholder={ 'Subscribe' }											
								onChange={ ( newLabel ) => {
									setAttributes( { submitLabel: newLabel } );
								} }
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
				<figure className={ classes }>
				
                    { uploader }					
					
					<figcaption>
						<RichText
							tagName="h4"
							className="wp-block-cover-image-title"
							placeholder={ 'Write title…' }
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							inlineToolbar
						/>
						<RichText
							tagName="p"
							className="wp-block-cover-image-text"
							placeholder={ 'Write text…' }
							value={ content }
							onChange={ ( value ) => setAttributes( { content: value } ) }
							inlineToolbar
						/>
					</figcaption>
				</figure>
			</Fragment>
		);
    } ),
    
    save( { attributes, className } ) {
		const { image, title, content, contentAlign, textReverse, submitLabel, formAction } = attributes;
		//const style = backgroundImageStyles( image );
		let classes = className,
            captionClasses = "";
                    
        if (contentAlign !== 'left') {
            classes += ` has-${contentAlign}-content`;
		}
		if (!! textReverse) {
			captionClasses = `reverse-text-color`;
		}
		
		return (
			<aside className={ classes }>

				<img className="background" src={ image } />

				<form className={ captionClasses } method="GET" action={ formAction }>

					{ title && title.length > 0 && (
						<RichText.Content tagName="h4" className="wp-block-cta-title" value={ title } />
                    ) }
                    
					{ content && content.length > 0 && (
						<RichText.Content tagName="p" className="wp-block-cta-text" value={ content } />
                    ) }

                    <div className={ `wp-block-typecase-search--fields` } >
					
						<input type="text" name="s" type="text" className={ `wp-block-typecase-search--input` } />
						<button type="submit" className={ `wp-block-typecase-search--submit` }>{ submitLabel || 'Search' }</button>

					</div>
                    
				</form>

			</aside>
		);
	}
    
});