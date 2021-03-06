/**
 * External dependencies
 */
var noop = require( 'lodash/noop' ),
	React = require( 'react' ),
	PureRenderMixin = require( 'react-pure-render/mixin' ),
	classNames = require( 'classnames' );

/**
 * Internal dependencies
 */
var Gridicon = require( 'components/gridicon' ),
	postUtils = require( 'lib/posts/utils' );

var StatusLabel = React.createClass( {
	propTypes: {
		onClick: React.PropTypes.func,
		post: React.PropTypes.object,
		type: React.PropTypes.string
	},

	mixins: [ PureRenderMixin ],

	getDefaultProps: function() {
		return {
			onClick: noop,
			post: null,
			advancedStatus: false,
			type: 'post'
		};
	},

	getInitialState: function() {
		return {
			currentTime: Date.now()
		};
	},

	componentDidMount: function() {
		// update the `currentTime` every minute
		this.currentTimeTimer = setInterval( this.updateCurrentTime, 60000 );
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( nextProps.post !== this.props.post ) {
			// the post has been updated, so update the current time so that
			// it will be the most up-to-date when re-rendering
			this.updateCurrentTime();
		}
	},

	componentWillUnmount: function() {
		clearInterval( this.currentTimeTimer );
	},

	render: function() {
		var statusClass = 'post-editor-status-label';

		if ( ! this.props.post ) {
			return (
				<button className="post-editor-status-label is-placeholder">
					<strong>
						{
							'post' === this.props.type
								? this.translate( 'Loading Post…' )
								: this.translate( 'Loading Page…' )
						}
					</strong>
				</button>
			);
		}

		statusClass = classNames( statusClass, 'is-' + this.props.post.status );

		return (
			<button
				className={ statusClass }
				onClick={ this.props.onClick }
				ref="statusLabel"
				aria-label={ this.translate( 'Show advanced status details' ) }
				aria-pressed={ !! this.props.advancedStatus }
			>
				<Gridicon icon="cog" size={ 16 } />
				{ this.renderLabel() }
			</button>
		);
	},

	renderLabel: function() {
		var post = this.props.post,
			editedTime = this.moment( postUtils.getEditedTime( post ) ),
			label;

		if ( ! post.modified ) {
			return this.translate( 'New Draft' );
		}

		// prevent JP sites from showing a draft as saved in the future
		if ( 'draft' === post.status &&
				editedTime.isAfter( this.state.currentTime )
		) {
			editedTime = this.moment( this.state.currentTime );
		}

		const timeFromNow = editedTime.from( this.state.currentTime );

		switch ( post.status ) {
			case 'publish':
				label = this.translate( '{{strong}}Published{{/strong}} %(relativeTimeFromNow)s', {
					args: { relativeTimeFromNow: timeFromNow },
					components: {
						strong: <strong />
					}
				} );
				break;
			case 'private':
				label = this.translate( '{{strong}}Published Privately{{/strong}} %(relativeTimeFromNow)s', {
					args: { relativeTimeFromNow: timeFromNow },
					components: {
						strong: <strong />
					}
				} );
				break;
			case 'draft':
				label = this.translate( '{{strong}}Draft saved{{/strong}} %(relativeTimeFromNow)s', {
					args: { relativeTimeFromNow: timeFromNow },
					components: {
						strong: <strong />
					}
				} );
				break;
			case 'pending':
				label = this.translate( '{{strong}}Pending Review{{/strong}} %(relativeTimeFromNow)s', {
					args: { relativeTimeFromNow: timeFromNow },
					components: {
						strong: <strong />
					}
				} );
				break;
			case 'future':
				label = this.translate( '{{strong}}Scheduled{{/strong}} %(relativeTimeFromNow)s', {
					args: { relativeTimeFromNow: timeFromNow },
					components: {
						strong: <strong />
					}
				} );
				break;
			case 'trash':
				label = this.translate( '{{strong}}Trashed{{/strong}}', {
					components: {
						strong: <strong />
					}
				} );
				break;
			default:
				label = '';
				break;
		}

		return label;
	},

	updateCurrentTime: function() {
		this.setState( {
			currentTime: Date.now()
		} );
	}
} );

module.exports = StatusLabel;
