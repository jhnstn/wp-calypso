"use strict"; // eslint-disable-line
var config = require( 'config' ),
	path = require( 'path' ),
	utils = require( './utils' ),
	fs = require( 'fs' ),
	glob = require( 'glob' );

function buildSectionModules( sections, sectionDir, loader ) {
	var dependencies,
		loadSection = '',
		sectionLoaders = '';

	if ( config.isEnabled( 'code-splitting' ) ) {
		try {
			fs.mkdirSync( path.join( sectionDir, 'sections' ) );
		} catch( e ) {
			//
		}
		// cleanup existing files
		const existingFiles = glob.sync( 'sections/**/*', { cwd: sectionDir } );
		existingFiles.forEach( function( f ) {
			fs.unlinkSync( path.join( sectionDir, f ) )
		} );

		dependencies = new Set();

		sections.forEach( function( section ) {
			const moduleName = 'sections/' + section.name,
				modulePath = path.join( sectionDir, 'sections', section.name + '.js' );
			let sectionDependencies = [
				"var page = require( 'page' ),",
				"\tlayoutFocus = require( 'lib/layout-focus' ),",
				"\tReact = require( 'react' ),",
				"\tLoadingError = require( 'layout/error' ),",
				"\tclasses = require( 'component-classes' ),",
				"\tcontroller = require( 'controller' );",
				'\n',
				'var _loadedSections = {};'
			].join( '\n' );
			sectionLoaders = '';
			loadSection = singleEnsure( section.name );
			section.paths.forEach( function( p ) {
				sectionLoaders += splitTemplate( p, section );
			} );

			let moduleContent = [
				sectionDependencies,
				'module.exports = {',
				'	get: function() {',
				'		return ' + JSON.stringify( sections ) + ';',
				'	},',
				'	load: function() {',
				'		' + sectionLoaders,
				'	},',
				'	preload: function( section ) {',
				'		switch ( section ) {',
				'		' + loadSection,
				'		}',
				'	}',
				'};'
			].join( '\n' );


			fs.appendFileSync( modulePath, moduleContent );
			loader.addDependency( moduleName );
			dependencies.add( moduleName );
		} );

		dependencies = Array.from( dependencies );
		sectionLoaders = dependencies.map( function( d ) {
			return 'require( ' + JSON.stringify( d ) + ').load()';
		} ).join( '\n' );

		loadSection = dependencies.map( function( d ) {
			return [
				'case ' + JSON.stringify( d ) + ':',
				'	 return require.ensure([], function() {}, ' + JSON.stringify( d ) + ' );',
				' 	break;\n'
			].join( '\n' );
		} ).join( '\n' );

		return [
			'module.exports = {',
			'	get: function() {',
			'		return ' + JSON.stringify( sections ) + ';',
			'	},',
			'	load: function() {',
			'		' + sectionLoaders,
			'	},',
			'	preload: function( section ) {',
			'		switch ( section ) {',
			'		' + loadSection,
			'		}',
			'	}',
			'};'
		].join( '\n' );
	} else {
		dependencies = "var controller = require( 'controller' );\n";
		sectionLoaders = getRequires( sections );
		return [
			dependencies,
			'module.exports = {',
			'	get: function() {',
			'		return ' + JSON.stringify( sections ) + ';',
			'	},',
			'	load: function() {',
			'		' + sectionLoaders,
			'	},',
			'	preload: function( section ) {',
			'		switch ( section ) {',
			'		' + loadSection,
			'		}',
			'	}',
			'};'
		].join( '\n' );
	}

	throw new Error( 'oh no' );
}

function getRequires( sections ) {
	var content = '';

	sections.forEach( function( section ) {
		content += requireTemplate( section.module );
	} );

	return content;
}

function splitTemplate( path, section ) {
	var regex, result;
	if ( path === '/' ) {
		path = JSON.stringify( path );
	} else {
		regex = utils.pathToRegExp( path );
		path = '/' + regex.toString().slice( 1, -1 ) + '/';
	}

	result = [
		'page( ' + path + ', function( context, next ) {',
		'	if ( _loadedSections[ ' + JSON.stringify( section.module ) + ' ] ) {',
		'		context.store.dispatch( { type: "SET_SECTION", section: ' + JSON.stringify( section ) + ' } );',
		'		layoutFocus.next();',
		'		return next();',
		'	}',
		'	context.store.dispatch( { type: "SET_SECTION", isLoading: true } );',
		'	require.ensure([' + JSON.stringify( section.module ) + '], function( r, error ) {',
		'		if ( error ) {',
		'			if ( ! LoadingError.isRetry() ) {',
		'				LoadingError.retry( ' + JSON.stringify( section.name ) + ' );',
		'			} else {',
		'				context.store.dispatch( { type: "SET_SECTION", isLoading: false } );',
		'				LoadingError.show( ' + JSON.stringify( section.name ) + ' );',
		'			}',
		'			return;',
		'		}',
		'		context.store.dispatch( { type: "SET_SECTION", isLoading: false } );',
		'		context.store.dispatch( { type: "SET_SECTION", section: ' + JSON.stringify( section ) + ' } );',
		'		if ( ! _loadedSections[ ' + JSON.stringify( section.module ) + ' ] ) {',
		'			r( ' + JSON.stringify( section.module ) + ' )( controller.clientRouter );',
		'			_loadedSections[ ' + JSON.stringify( section.module ) + ' ] = true;',
		'		}',
		'		layoutFocus.next();',
		'		next();',
		'	}, ' + JSON.stringify( section.name ) + ' );',
		'} );\n'
	];

	return result.join( '\n' );
}

function requireTemplate( module ) {
	return 'require( ' + JSON.stringify( module ) + ' )( controller.clientRouter );\n';
}

function singleEnsure( chunkName ) {
	var result = [
		'case ' + JSON.stringify( chunkName ) + ':',
		'	return require.ensure([], function() {}, ' + JSON.stringify( chunkName ) + ' );',
		'	break;\n'
	];

	return result.join( '\n' );
}

module.exports = function( content ) {
	var sections;

	this.cacheable && this.cacheable();

	sections = require( this.resourcePath );

	if ( ! Array.isArray( sections ) ) {
		this.emitError( 'Chunks module is not an array' );
		return content;
	}

	this.addDependency( 'page' );

	return buildSectionModules( sections, path.dirname( this.resourcePath ), this );
};
