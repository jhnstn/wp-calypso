/**
* External dependencies
*/
import React from 'react';
import page from 'page';
import toTitleCase from 'to-title-case';
import trim from 'lodash/trim';

/**
 * Internal dependencies
 */
import SearchCard from 'components/search-card';
import SearchDemo from 'components/search/docs/example';
import Notices from 'components/notice/docs/example';
import GlobalNotices from 'components/global-notices/docs/example';
import Buttons from 'components/button/docs/example';
import ButtonGroups from 'components/button-group/docs/example';
import Gridicons from 'components/gridicon/docs/example';
import Accordions from 'components/accordion/docs/example';
import SocialLogos from 'components/social-logo/docs/example';
import SelectDropdown from 'components/select-dropdown/docs/example';
import SegmentedControl from 'components/segmented-control/docs/example';
import Cards from 'components/card/docs/example';
import TokenFields from 'components/token-field/docs/example';
import CountedTextareas from 'components/forms/counted-textarea/docs/example';
import ProgressBar from 'components/progress-bar/docs/example';
import Popovers from 'components/popover/docs/example';
import Ranges from 'components/forms/range/docs/example';
import Gauge from 'components/gauge/docs/example';
import Headers from 'components/header-cake/docs/example';
import DropZones from 'components/drop-zone/docs/example';
import FormFields from 'components/forms/docs/example';
import SectionNav from 'components/section-nav/docs/example';
import Spinners from 'components/spinner/docs/example';
import Rating from 'components/rating/docs/example';
import DatePicker from 'components/date-picker/docs/example';
import InputChrono from 'components/input-chrono/docs/example';
import TimezoneDropdown from 'components/timezone-dropdown/docs/example';
import ClipboardButtons from 'components/forms/clipboard-button/docs/example';
import ClipboardButtonInput from 'components/clipboard-button-input/docs/example';
import HeaderCake from 'components/header-cake';
import InfoPopover from 'components/info-popover/docs/example';
import FoldableCard from 'components/foldable-card/docs/example';
import SectionHeader from 'components/section-header/docs/example';
import PaymentLogo from 'components/payment-logo/docs/example';
import Count from 'components/count/docs/example';
import Version from 'components/version/docs/example';
import BulkSelect from 'components/bulk-select/docs/example';
import ExternalLink from 'components/external-link/docs/example';
import FeatureGate from 'components/feature-example/docs/example';
import FilePickers from 'components/file-picker/docs/example';
import Collection from 'devdocs/design/search-collection';

export default React.createClass( {
	displayName: 'DesignAssets',

	getInitialState() {
		return { filter: '' };
	},

	onSearch( term ) {
		this.setState( { filter: trim( term || '' ).toLowerCase() } );
	},

	backToComponents() {
		page( '/devdocs/design/' );
	},

	render() {
		return (
			<div className="design-assets" role="main">
				{
					this.props.component
					? <HeaderCake onClick={ this.backToComponents } backText="All Components">
						{ toTitleCase( this.props.component ) }
					</HeaderCake>
					: <SearchCard
						onSearch={ this.onSearch }
						initialValue={ this.state.filter }
						placeholder="Search components…"
						analyticsGroup="Docs">
					</SearchCard>
				}
				<Collection component={ this.props.component } filter={ this.state.filter }>
					<Accordions />
					<BulkSelect />
					<ButtonGroups />
					<Buttons />
					<Cards />
					<ClipboardButtonInput />
					<ClipboardButtons />
					<Count />
					<CountedTextareas />
					<DatePicker />
					<DropZones searchKeywords="drag" />
					<ExternalLink />
					<FeatureGate />
					<FilePickers />
					<FoldableCard />
					<FormFields searchKeywords="input textbox textarea radio"/>
					<Gauge />
					<GlobalNotices />
					<Gridicons />
					<Headers />
					<InfoPopover />
					<InputChrono />
					<Notices />
					<PaymentLogo />
					<Popovers />
					<ProgressBar />
					<Ranges />
					<Rating />
					<SearchDemo />
					<SectionHeader />
					<SectionNav />
					<SegmentedControl />
					<SelectDropdown searchKeywords="menu" />
					<SocialLogos />
					<Spinners searchKeywords="loading" />
					<TimezoneDropdown />
					<TokenFields />
					<Version />
				</Collection>
			</div>
		);
	}
} );
