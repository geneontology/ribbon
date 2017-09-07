import React, { Component, PropTypes }  from 'react';
import FlipMove from 'react-flip-move';

import AGR_taxons from '../data/taxa';

class AssociationsView extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    currentTermId: PropTypes.string,
    slimlist: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        goid: PropTypes.string,
        golabel: PropTypes.string,
        uniqueAssocs: PropTypes.array,
        visible: PropTypes.bool
      })
    )
  };

  render() {
    const {slimlist} = this.props;
    return (
      <div className='assoc-view'>
      {
        slimlist.filter((slimitem) => {
          return slimitem.goid === this.props.currentTermId;
        }).map((slimitem) => {
          return (
            <AssociationList
              key={slimitem.goid}
              slimitem={slimitem}
            />
          )
        })
      }
      </div>
    );
  }
};

class AssociationList extends Component {

  static propTypes = {
    slimitem: PropTypes.shape({
      uniqueAssocs: PropTypes.array
    })
  };

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
    const {goid, slimitem} = this.props;
    return (
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
    );
  }
}

class Association extends Component {

  static propTypes = {
    assoc: PropTypes.shape({
      subject: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        taxon: PropTypes.shape({
          id: PropTypes.string.isRequired
        }).isRequired,
      }),
      object: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
      color: PropTypes.string
    })
  };

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
