import React from 'react';
import ReactDOM from 'react-dom';

import Block from '../RibbonBase/Block'
import FilterDropdown from '../view/FilterDropdown'
import FilterItem from '../view/FilterItem'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<FilterItem />', () => {

    it('correct dom rendering', () => {
        var props = { filter: "filter1", selected: false }
        const wrapper = shallow(<FilterItem {...props} />);

        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find('div').find('div').exists()).toBe(true);
    })

    it('correct css classes', () => {
        // testing when the filter is unselected
        var props = { filter: "filter1", selected: false }
        const wrapper = shallow(<FilterItem {...props} />);
        
        expect(wrapper.find('.ontology-ribbon__filter_row').exists()).toBe(true);
        expect(wrapper.find('.ontology-ribbon__radio').exists()).toBe(true);
        expect(wrapper.find('.ontology-ribbon__radio-unselected').exists()).toBe(true);

        // testing when the filter is selected
        var props2 = { filter: "filter1", selected: true }
        const wrapper2 = shallow(<FilterItem {...props2} />);
        expect(wrapper2.find('.ontology-ribbon__radio-selected').exists()).toBe(true);

    })

});