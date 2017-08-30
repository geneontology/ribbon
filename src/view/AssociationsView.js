import React, { Component, PropTypes }  from 'react';
import FlipMove from 'react-flip-move';

import RibbonStore from '../data/RibbonStore';
import ActionType from '../event/ActionType';
import AGR_taxons from '../data/taxa';

class AssociationsView extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    var slimlist = RibbonStore.getSlimList();
    const InfoArray = slimlist.map((slimitem, index) => {
      return <AssociationList
        goid={slimitem.goid}
        key={slimitem.goid}
      />;
    });
    return (
      <div className='assoc-view'>
        <div > {InfoArray} </div>
      </div>
    );
  }
};

class AssociationList extends Component {
  constructor(props) {
    super(props);
    const {goid} = this.props;
    var visible = RibbonStore.isVisible(goid);
    this.state = ({
      visible: visible
    });
  }

  componentDidMount() {
    RibbonStore.addListener(this.onToggle.bind(this), ActionType.TOGGLE );
  }

  onToggle() {
    var visible = RibbonStore.isVisible(this.props.goid);
    this.setState({
      visible: visible}
    );
  }

  componentWillUnmount() {
    //RibbonStore.removeListener(this.onToggle.bind(this) );
  }

  renderAssociations(slimitem) {
    return slimitem.uniqueAssocs.map((assoc, index) => {
      return <Association
        assoc={assoc}
        key={index}
      />;
    });
  }
  formatEasing() {
    const easingValues = ['0', '0', '1.0', '1.0'];
    return `cubic-bezier(${ easingValues.join(',') })`;
  }
  render() {
    const {goid} = this.props;
    var slimitem = RibbonStore.getSlimItem(goid);
    var rows = ( this.state.visible &&
      <div className='assoc-list'>
        <div>
        <FlipMove
          duration='500'
          delay='0'
          easing={this.formatEasing()}
          staggerDurationBy='0'
          staggerDelayBy='0'
          typeName='ul'
        >
          { this.renderAssociations(slimitem) }
        </FlipMove>
        </div>
      </div>
    )
    return rows;
  }
}

class Association extends Component {

  render() {
    const { assoc } = this.props;
    const assocStyle = {
      margin: '6px',
      padding: '2px',
      borderRadius: '3px',
      boxShadow: '1px 1px 1px rgba(0,0,0,0.2)',
      backgroundColor: assoc.color
    }
    var img = this.getTaxonImage(assoc.subject.taxon.id);
    var genelink = `http://dev.alliancegenome.org:4001/gene/${assoc.subject.id}`;
    var golink = `http://amigo.geneontology.org/amigo/term/${assoc.object.id}`;
    console.log(golink);
    return (
      <li style={assocStyle}>
        <img className='assoc-img' src={img} />
        <h3 className='assoc-subject' >
          <a title={genelink} href={genelink}>{assoc.subject.label}</a>
        </h3>
        <h5 className='assoc-go'>
          <a title={golink} href={golink}>{assoc.object.label}</a>
        </h5>
      </li>
    )
  }

  getTaxonImage(taxid) {
    var image_url = AGR_taxons.get(taxid);
    if (image_url === 'undefined' || image_url === null) {
      console.log('taxid='+taxid);
      image_url = 'https://image.freepik.com/free-icon/text-box-without-text_318-33104.jpg';
    }
    return image_url;
  }
}

export default AssociationsView;
