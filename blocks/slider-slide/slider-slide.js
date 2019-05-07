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

registerBlockType( 'typecase/slider-slide', {

    title: 'Slide',
	parent: [ 'typecase/slider' ],
	icon: 'format-image',
	description: 'A single slide within a Slider block.',
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
		}
    },

    edit: withNotices( ( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) => {
		const { id, title, content, image, contentAlign, buttonText, buttonUrl, textReverse } = attributes;

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
        );

		if ( ! image ) {
			const hasTitle = true;
			const icon = hasTitle ? undefined : 'format-image';

			classes += ` no-image-selected`;

			return (
				<Fragment>
					{ controls }
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
				</Fragment>
			);
		}

		return (
			<Fragment>
				<Fragment>
					{ controls }
					<InspectorControls>
						<PanelBody title={ 'Slide Settings' }>
							<ToggleControl
								label={ 'Reverse Text Color (for dark photos)' }
								checked={ !! textReverse }
								onChange={ () => setAttributes( { textReverse: ! textReverse } ) }
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
								className={ 'wp-block-slider-slide__link' }
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
		const { image, title, content, contentAlign, buttonText, buttonUrl, textReverse, id } = attributes;
		//const style = backgroundImageStyles( image );
		let classes = className,
			captionClasses;
        
        if (contentAlign !== 'left') {
            classes = `${classes} has-${contentAlign}-content`;
		}
		
		captionClasses = (!! textReverse) ? "text-color-reverse" : "";

		if (!! textReverse) {
			classes = classes + " __reverse";
		}

		return (
			<figure className={ classes }>
				<img className="background" src={ image } />
				<figcaption className={ captionClasses }>
					{ title && title.length > 0 && (
						<RichText.Content tagName="h2" className="wp-block-typecase-slider-slide-title" value={ title } />
					) }
					{ content && content.length > 0 && (
						<RichText.Content tagName="p" className="wp-block-typecase-slider-slide-text" value={ content } />
					) }
					{ buttonUrl && buttonUrl.length > 0 && (
						<RichText.Content
							tagName="a"
							className={ "wp-block-typecase-slider-slide__link button button-primary" }
							href={ buttonUrl }
							value={ buttonText }
						/>
					) }
				</figcaption>
			</figure>
		);
	}
    
});