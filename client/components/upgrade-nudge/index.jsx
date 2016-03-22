/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import analytics from 'analytics';

export default React.createClass( {

	displayName: 'UpgradeNudge',

	propTypes: {
		onClick: React.PropTypes.func,
		className: React.PropTypes.string,
		message: React.PropTypes.string,
		icon: React.PropTypes.string,
		event: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			onClick: noop,
			message: 'And get your own domain address.',
			icon: 'star',
			event: null
		}
	},

	handleClick() {
		if ( this.props.event ) {
			analytics.tracks.recordEvent( 'calypso_upgrade_nudge_cta_click', {
				cta_name: this.props.event
			} );
		}
		this.props.onClick();
	},

	render() {
		const classes = classNames( this.props.className, 'upgrade-nudge' );
		return (
			<Button className={ classes } onClick={ this.handleClick }>
				<div className="upgrade-nudge__info">
					<span className="upgrade-nudge__title">
						{ this.translate( 'Upgrade to Premium' ) }
					</span>
					<span className="upgrade-nudge__message" >
						{ this.props.message }
					</span>
				</div>
				<Gridicon icon={ this.props.icon } />
			</Button>
		);
	}
} );
