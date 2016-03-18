/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import { translate } from 'lib/mixins/i18n';
import { getEditedPost } from 'state/posts/selectors';
import { getPostType } from 'state/post-types/selectors';
import { getEditorPostId } from 'state/ui/editor/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import QueryPostTypes from 'components/data/query-post-types';

function EditorStatusLabelPlaceholder( { siteId, typeSlug, type, className } ) {
	const classes = classnames( 'editor-status-label__placeholder', className );

	let postType;
	switch ( typeSlug ) {
		case 'post': postType = translate( 'Post', { context: 'noun' } ); break;
		case 'page': postType = translate( 'Page' ); break;
		default: postType = get( type, 'labels.singular_name', '' );
	}

	return (
		<button className={ classes }>
			{ 'post' !== typeSlug && 'page' !== typeSlug && (
				<QueryPostTypes siteId={ siteId } />
			) }
			<strong>
				{ translate( 'Loading %(postType)s…', { args: { postType } } ) }
			</strong>
		</button>
	);
}

EditorStatusLabelPlaceholder.propTypes = {
	siteId: PropTypes.nujmber,
	typeSlug: PropTypes.string,
	type: PropTypes.object,
	className: PropTypes.string
};

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const props = { siteId };

	const post = getEditedPost( state, siteId, getEditorPostId( state ) );
	if ( ! post ) {
		return props;
	}

	return Object.assign( props, {
		typeSlug: post.type,
		type: getPostType( state, siteId, post.type )
	} );
} )( EditorStatusLabelPlaceholder );
