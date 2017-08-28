import React, { Component, PropTypes }  from 'react';
import FlipMove from 'react-flip-move';

import RibbonStore from '../data/RibbonStore';
import ActionType from '../event/ActionType';

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

    return (
      <li style={assocStyle}>
        <img className='assoc-img' src={img} />
        <h3 className='assoc-subject' >{assoc.subject.id}</h3>
        <h5 className='assoc-go'>{assoc.object.label}</h5>
      </li>
    )
  }

  getTaxonImage(taxid) {
    if (taxid === 'NCBITaxon:7227') {
      return 'http://www.benchfly.com/blog/wp-content/uploads/2010/01/Drosophila.jpg';
    } else
    if (taxid === 'NCBITaxon:9606') {
      return 'https://definicion.de/wp-content/uploads/2016/04/biopsicosocial.jpg';
    }
    if (taxid === 'NCBITaxon:10090') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE4OMLrQ2PYiqb6dI_wvxuH5fopp54mb81x7EUkmPziCu0SFPOHg';
    }
    if (taxid === 'NCBITaxon:10116') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Fancy_rat_blaze.jpg/1024px-Fancy_rat_blaze.jpg';
    }
    if (taxid === 'NCBITaxon:559292') {
      return 'https://pbs.twimg.com/profile_images/1752488737/twitter_logo_3_400x400.gif';
    }
    if (taxid === 'NCBITaxon:6239') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzh7zEV3s6sjJjXkKjfgGL2yevpeBu7-HtUWNva4kGgtBZHEWCxg';
    }
    if (taxid === 'NCBITaxon:7955') {
      return 'https://zfin.org/images/betterfish.jpg';
    }
    else {
      console.log('taxid='+taxid);
      return 'https://image.freepik.com/free-icon/text-box-without-text_318-33104.jpg';
    }
  }
}

export default AssociationsView;
