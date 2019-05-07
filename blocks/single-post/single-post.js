
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

	constructor() {

		super( ...arguments );

		this.state = {
			posts: [],
            postId: 0,
            postSelection: null
		};

	}

	componentDidMount() {
		this.setState( { postId: this.props.attributes.postId } );
        this.getRecentPosts();
        this.getSelectedPost( this.props.attributes.postId );
	}


	componentDidUpdate( prevProps ) {
		this.handleChange( prevProps );
	}

	getRecentPosts() {
		return ( new wp.api.collections.Posts() ).fetch( { data: { per_page: 100 } } ).then( ( posts ) => {
			this.setState( { posts } );
		} );
    }

    getSelectedPost( postId ) {

        if ( typeof postId === 'number' && postId > 0 ) {
            (new wp.api.models.Post( { id: this.props.attributes.postId } ) ).fetch().then( (post) => {
    		    this.setState( { postSelection: post } );
            } );
        }
        else {
            this.setState( { postSelection: null } );
		}
		
	}

	handleChange( prevProps ) {

	}

	render() {
		const {
			attributes,
			setAttributes,
			className
		} = this.props;

		const {
			posts,
			postSelection
		} = this.state;

		let output = 'loading ...';

		var postSelections = [ { value: 0, label: '(Select a post)' } ];

		if ( posts && posts.length > 0 ) {

			posts.forEach( (post) => {
				postSelections.push( { value: post.id, label: post.title.rendered } );
			});

        }

        if ( postSelection ) {

			output = (
				<Fragment>
					<h4>{ postSelection.title.rendered }</h4>
					<div class="excerpt" dangerouslySetInnerHTML={ { __html: postSelection.excerpt.rendered } }></div>
				</Fragment>
			);

        } else if ( posts.length > 0 ) {

			output = (<p><em>Please select a post to feature</em></p>);

		}
		
		const setSelection = ( value ) => setAttributes( { postId: parseInt( value, 10 ) } );

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Post Settings' ) }>
						<SelectControl
							label={ __( 'Select a post' ) }
							value={ attributes.postId }
							options={ postSelections }
							onChange={ setSelection }
						/>
					</PanelBody>
				</InspectorControls>
				<div data-post-id={ attributes.postId || 0 } className={ className || '' }>
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
