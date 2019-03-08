
//import './style.scss';
//import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InnerBlocks } = wp.editor; 

registerBlockType( 'typecase/container', {
	title: __( 'Container' ),
	icon: 'welcome-widgets-menus',
	category: 'layout',
	keywords: [],
	supports: {
		html: false,
		anchor: true,
		align: [ 'wide', 'full' ],
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function (props) {
		return (
			<div className={ props.className }>
				<InnerBlocks />
			</div>
		);
	},

	save: function (props) {
		return (
            <div>
				<InnerBlocks.Content />
			</div>
		);
	},

});
