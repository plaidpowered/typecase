
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

class typecasePostBlock extends Component {

	static getInitialState() {
		return {
			posts: [],
            postId: 0,
            postSelection: null
		};
	}

	constructor() {

		super( ...arguments );

		this.state = this.constructor.getInitialState();
        this.getPosts = this.getPosts.bind(this);
        this.getSelection = this.getSelection.bind(this);
		this.changeSelection = this.changeSelection.bind(this);
		
	}

	componentDidMount() {
		this.setState( { postId: this.props.attributes.postId } );
        this.getPosts();
        this.getSelection(this.props.attributes.postId);
	}

	getPosts() {
		return (new wp.api.collections.Posts()).fetch({ data: { per_page: 100 } }).then( (posts) => {
			this.setState({ posts });			
		} );
    }	
    
    getSelection(postId) {
        if (typeof postId === 'number' && postId > 0) {
            (new wp.api.models.Post({ id: this.props.attributes.postId })).fetch().then( (post) => {
    		    this.setState({ postSelection: post });			
            });
        }
        else {
            this.setState( { postSelection: null } );
        }
	}	

	changeSelection(value) {
		this.setState({ postId: parseInt(value) });
        this.props.setAttributes({ 'postId': parseInt(value) });

		this.getSelection(parseInt(value));
		//this.render();
	}

	render() {

		let output = 'loading ...';

		var postSelections = [{value: 0, label: '(Select a post)'}];

		if (this.state.posts.length > 0) {

			this.state.posts.forEach((post) => {
				postSelections.push({value: post.id, label: post.title.rendered});
			});			

        }		
        
        if (this.state.postSelection) {

			output = (
				<Fragment>
					<h4>{this.state.postSelection.title.rendered}</h4>
					<div class="excerpt" dangerouslySetInnerHTML={{ __html: this.state.postSelection.excerpt.rendered }}></div>
				</Fragment>
			);

        } else if (this.state.posts.length > 0) {

			output = (<p><em>Please select a post to feature</em></p>);
			
        }

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Post Settings' ) }>
						<SelectControl
							label={ __( 'Select a post' ) }
							value={ this.props.attributes.postId }
							options={ postSelections }
							onChange={ this.changeSelection }
						/>
					</PanelBody>
				</InspectorControls>
				<div data-post-id={ this.props.attributes.postId || 0 } className={ this.props.className || '' }>
					{ output }
				</div>
			</Fragment>
		);

	}

}

registerBlockType('typecase/single-post', {
	title: __( 'Single Post' ),
	icon: 'admin-post',
	category: 'widgets',
	keywords: [],

	attributes: {
        postId: {
			default: 0,
            type: 'number'
		}
	},
	
	supports: {
		html: false,
		anchor: true
	},

	edit: typecasePostBlock,

	save: function () {
		return null;
	},

});
