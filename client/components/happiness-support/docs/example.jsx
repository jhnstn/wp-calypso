/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import HappinessSupport from 'components/happiness-support';

export default React.createClass( {
	displayName: 'HappinessSupport',

	render() {
		return (
			<div className="design-assets__group">
				<h2><a href="/devdocs/app-components/happiness-support">HappinessSupport</a></h2>

				<HappinessSupport />
			</div>
		);
	}
} );
