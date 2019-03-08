
//import './style.scss';
//import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n

const {
	Fragment,
	withAPIData,
	Component
} = wp.element;

const { 
	registerBlockType,
	BlockControls	
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
	InspectorControls
} = wp.editor;

const { 
	PanelBody,
	SelectControl		
} = wp.components;


const { withSelect } = wp.data;

class typecasePageIndex extends Component {

	static getInitialState() {
		return {
			pages: [],
			pageSelected: 0,
		};
	}

	constructor() {

		super( ...arguments );

		this.state = this.constructor.getInitialState();
		this.getPages = this.getPages.bind(this);
		this.changeSelection = this.changeSelection.bind(this);
		
	}

	componentDidMount() {
		this.setState( { pageSelected: this.props.attributes.pageSelected } );
		this.getPages();
	}

	getPages() {
		return (new wp.api.collections.Pages()).fetch({ data: { per_page: -1, parent: 0 } }).then( (pages) => {
			this.setState({ pages });			
		} );
	}	

	changeSelection(value) {
		this.setState({ selectedPost: parseInt(value) });
		this.props.setAttributes({ 'pageSelected': parseInt(value) });
	}

	render() {

		let output = 'loading ...';

		var pageSelections = [{value: 0, label: 'Show all parent pages'}];

		if (this.state.pages.length > 0) {
			this.state.pages.forEach((page) => {
				pageSelections.push({value: page.id, label: page.title.rendered});
			});

			output = "This will show a list of links to the child pages of the parent you've selected in this block's settings.";
		}		

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Navigation Settings' ) }>
						<SelectControl
							label={ __( 'Page Parent' ) }
							value={ this.props.attributes.pageSelected }
							options={ pageSelections }
							onChange={ this.changeSelection }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ this.props.className || '' }>
					<p>{ output }</p>
				</div>
			</Fragment>
		);

	}

}

registerBlockType('typecase/page-index', {
	title: __( 'Page Index' ),
	icon: 'images-menu',
	category: 'widgets',
	keywords: [],

	attributes: {
        pageSelected: {
			default: 0,
			type: 'number'
		}
	},
	
	supports: {
		html: false,
		anchor: true
	},

	edit: typecasePageIndex,

	save: function () {
		return null;
	},

});
