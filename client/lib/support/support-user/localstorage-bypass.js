/**
 * External dependencies
 */
import debugModule from 'debug';

const debug = debugModule( 'calypso:support-user' );

export const length = ( memoryStore ) => {
	return () => {
		debug( 'Bypassing localStorage', 'length property' );
		return Object.keys( memoryStore ).length;
	}
}

export const key = ( memoryStore ) => {
	return ( index ) => {
		debug( 'Bypassing localStorage', 'key' );
		if( index >= Object.keys( memoryStore ).length ) {
			return null;
		}

		return Object.keys( memoryStore )[ index ];
	}
}

export const setItem = ( memoryStore, allowedKeys, original ) => {
	return ( key, value ) => {
		if ( allowedKeys.indexOf( key ) > -1 ) {
			original( key, value );
			return;
		}

		debug( 'Bypassing localStorage', 'setItem', key );
		memoryStore[ key ] = value;
	}
}

export const getItem = ( memoryStore, allowedKeys, original ) => {
	return ( key ) => {
		if ( allowedKeys.indexOf( key ) > -1 ) {
			return original( key );
		}

		debug( 'Bypassing localStorage', 'getItem', key );
		return memoryStore[ key ] || null;
	}
}

export const removeItem = ( memoryStore, allowedKeys, original ) => {
	return ( key ) => {
		if ( allowedKeys.indexOf( key ) > -1 ) {
			original( key );
			return;
		}

		debug( 'Bypassing localStorage', 'removeItem', key );
		delete memoryStore[ key ];
	};
};

export const clear = ( memoryStore ) => {
	return () => {
		debug( 'Bypassing localStorage', 'clear' );

		for (var key in memoryStore) {
			delete memoryStore[ key ];
		}
	};
};

export default function( allowedKeys ) {
	if ( window && window.localStorage && window.Storage && window.Storage.prototype ) {
		debug( 'Bypassing localStorage' );
		const memoryStore = {};
		const _setItem = window.Storage.prototype.setItem.bind( window.localStorage );
		const _getItem = window.Storage.prototype.getItem.bind( window.localStorage );
		const _removeItem = window.Storage.prototype.removeItem.bind( window.localStorage );

		Object.defineProperty( Storage.prototype, 'length', {
			get: length( memoryStore ),
		} );

		Object.assign( Storage.prototype, {
			setItem: setItem( memoryStore, allowedKeys, _setItem ),
			getItem: getItem( memoryStore, allowedKeys, _getItem ),
			removeItem: removeItem( memoryStore, allowedKeys, _removeItem ),
			key: key( memoryStore ),
			clear: clear( memoryStore ),
		} );
	}
}
