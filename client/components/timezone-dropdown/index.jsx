
/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import Dropdown from 'components/select-dropdown';

/**
 * Module variables
 */
const { Component, PropTypes } = React;
const noop = () => {};
const undocumented = wpcom.undocumented();

class TimezoneDropdown extends Component {
	constructor() {
		super();

		// bound methods
		this.onSelect = this.onSelect.bind( this );

		this.state = {
			timezones: [ { label: '', value: '' } ]
		};
	}

	componentWillMount() {
		undocumented.timezones( ( err, zones ) => {
			if ( err ) {
				return console.log( err );
			}

			let timezones = [];

			for ( let continent in zones.timezones_by_continent ) {
				let cities = zones.timezones_by_continent[ continent ];
				cities = [ {
					label: continent,
					value: continent,
					isLabel: true
				} ].concat( cities, [ null ] );

				timezones = timezones.concat( cities );
			}

			this.setState( { timezones } );
		} );
	}

	onSelect( zone ) {
		this.props.onSelect( zone );
	}

	render() {
		return (
			<Dropdown
				className="timezone-dropdown"
				valueLink={ this.props.valueLink }
				options={ this.state.timezones }
				selectedText={ this.props.selectedZone }
				onSelect={ this.onSelect }
			/>
		);
	}
};

TimezoneDropdown.defaultProps = {
	onSelect: noop
};

TimezoneDropdown.propTypes = {
	selectedZone: PropTypes.string,
	onSelect: PropTypes.func
}

export default TimezoneDropdown;
