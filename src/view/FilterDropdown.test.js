import React from 'react';
import ReactDOM from 'react-dom';

import Block from '../RibbonBase/Block'
import FilterDropdown from '../view/FilterDropdown'
import FilterItem from '../view/FilterItem'

import sinon from 'sinon';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<FilterDropdown />', () => {

    // it('simulates click events', () => {
    //     var filtersMap = new Map();
    //     filtersMap.set("filter1", true);
    //     filtersMap.set("filter2", false);
    //     var props = { filters: filtersMap, isOpen: false }        

    //     var onButtonClick = sinon.spy();
    //     // onButtonClick.call();
    //     console.log(onButtonClick.callCount);

    //     const wrapper = shallow(<FilterDropdown filterHandler={onButtonClick} {...props} />);
    //     wrapper.find('FaFilter').simulate('click');
    //     expect(onButtonClick).toHaveProperty('callCount', 1);
    // });


    it('correct dom rendering (when closed)', () => {
        var filtersMap = new Map();
        filtersMap.set("filter1", true);
        filtersMap.set("filter2", false);
        var props = { filters: filtersMap, isOpen: false }        
        const wrapper = shallow(<FilterDropdown {...props} />);

        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find(FilterItem)).toHaveLength(0);
    })    
    
    it('correct dom rendering (when opened)', () => {
        var filtersMap = new Map();
        filtersMap.set("filter1", true);
        filtersMap.set("filter2", false);
        var props = { filters: filtersMap, isOpen: true }      
        const wrapper = shallow(<FilterDropdown {...props} />);

        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find(FilterItem)).toHaveLength(filtersMap.size);

    })

    it('correct css classes', () => {
        var filtersMap = new Map();
        filtersMap.set("filter1", true);
        filtersMap.set("filter2", false);
        var props = { filters: filtersMap, isOpen: true }      
        const wrapper = shallow(<FilterDropdown {...props} />);
        
        expect(wrapper.find('.ontology-ribbon__filter_list').exists()).toBe(true);
        expect(wrapper.find('.checkbox').exists()).toBe(true);
    })    
    
        
});