/**
 * External dependencies
 */
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import QueryMediaStorage from 'components/data/query-media-storage';
import { getMediaStorage } from 'state/sites/media-storage/selectors';
import PlanStorageButton from 'components/plan-storage/button';

const PlanStorage = React.createClass( {

	displayName: 'PlanStorage',

	propTypes: {
		mediaStorage: React.PropTypes.object,
		site: React.PropTypes.object.isRequired,
		onClick: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			onClick: noop
		}
	},

	render() {
		if ( ! this.props.site || ! this.props.site.ID || this.props.site.jetpack ) {
			return null;
		}
		const classes = classNames( this.props.className, 'plan-storage' );
		return (
			<div className={ classes } >
				<QueryMediaStorage siteId={ this.props.site.ID } />
				<PlanStorageButton
					sitePlanName={ this.props.site.plan.product_name_short }
					mediaStorage={ this.props.mediaStorage }
					onClick={ this.props.onClick }
				/>
			</div>
		);
	}
} );

export default connect( ( state, ownProps ) => {
	return {
		mediaStorage: getMediaStorage( state, ownProps.site.ID )
	};
} )( PlanStorage );
