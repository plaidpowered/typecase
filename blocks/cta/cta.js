//import { isEmpty, times } from 'lodash';

const { Dashicon, IconButton, PanelBody, RangeControl, ToggleControl, Toolbar, withNotices } = wp.components;
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

registerBlockType( 'typecase/cta', {

    title: 'CTA',
	icon: 'format-status',
	description: 'An important CTA',
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
            selector: 'h2',
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
		buttonText: {
			type: 'string'
		}, 
		buttonUrl: {
			type: 'string'
		},
		textReverse: {
			type: 'boolean',
			default: false
		},
		inlineLink: {
			type: 'boolean',
			default: false
		}
    },

    edit: withNotices( ( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) => {
		const { id, title, content, image, contentAlign, buttonText, buttonUrl, textReverse, inlineLink } = attributes;

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
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ 'Edit image' }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
			</Fragment>
		);
		
		if ( ! image ) {
			const hasTitle = true;
			const icon = hasTitle ? undefined : 'format-image';

			classes += ` no-image-selected`;

			return (
				<MediaPlaceholder
					icon={ icon }
					className={ className }
					labels={ {
						title: 'Background Image',
						name: 'an image',
					} }
					onSelect={ onSelectImage }
					accept="image/*"
					allowedTypes={['image']}
					notices={ noticeUI }
					onError={ noticeOperations.createErrorNotice }
				/>
			);
		}

		return (
			<Fragment>
				<Fragment>
					{ controls }
				
					<InspectorControls>
						<PanelBody title={ 'CTA Text Settings' }>
							<ToggleControl
								label={ 'Reverse Text Color (for dark photos)' }
								checked={ !! textReverse }
								onChange={ () => setAttributes( { textReverse: ! textReverse } ) }
							/>
							<ToggleControl
								label={ 'Inline button' }
								checked={ !! inlineLink }
								onChange={ () => setAttributes( { inlineLink: ! inlineLink } ) }
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
				<figure className={ classes }>
				
					<img className="background" src={ image } />
					
					<figcaption>
						<RichText
							tagName="h2"
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
						<span>
							<RichText
								tagName="span"
								placeholder={ 'Add text…' }
								value={ buttonText }
								onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={ 'wp-block-cta__link' }
								keepPlaceholderOnFocus
							/>
							<form
								className="core-blocks-button__inline-link"
								onSubmit={ ( event ) => event.preventDefault() }>
								<Dashicon icon="admin-links" />
								<URLInput
									value={ buttonUrl }
									onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
								/>
								<IconButton icon="editor-break" label={ 'Apply' } type="submit" />
							</form>
						</span>
					</figcaption>
				</figure>
			</Fragment>
		);
    } ),
    
    save( { attributes, className } ) {
		const { image, title, content, contentAlign, buttonText, buttonUrl, textReverse, inlineLink } = attributes;
		//const style = backgroundImageStyles( image );
		let classes = className,
			captionClasses = "",
			linkClasses = "wp-block-cta__link button";
        
        if (contentAlign !== 'left') {
            classes += ` has-${contentAlign}-content`;
		}
		if (!! textReverse) {
			captionClasses = `reverse-text-color`;
		}
		
		linkClasses += (!! inlineLink) ? " button-inline" : " button-primary";

		return (
			<figure className={ classes }>
				<img className="background" src={ image } />
				<figcaption className={ captionClasses }>
					{ title && title.length > 0 && (
						<RichText.Content tagName="h2" className="wp-block-cta-title" value={ title } />
					) }
					{ content && content.length > 0 && (
						<RichText.Content tagName="p" className="wp-block-cta-text" value={ content } />
					) }
					{ buttonUrl && buttonUrl.length > 0 && (
						<RichText.Content
							tagName="a"
							className={ linkClasses }
							href={ buttonUrl }
							value={ buttonText }
						/>
					) }
				</figcaption>
			</figure>
		);
	}
    
});