import React from 'react';
import ReactDOM from 'react-dom';

import Block from '../RibbonBase/Block'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<Block />', () => {

    it('correct dom rendering', () => {

        var props = {
            config: {},
            isActive: false,
            onClick: () => { },
            onMouseEnter: () => { },
            onMouseLeave: () => { },
            showTitle: true,
            slimitem: {
                class_id: "GO:0005576",
                class_label: "extracellular",
                color: "#fff",
                no_data: true,
                separator: true
            }
        }

        const wrapper = shallow(<Block {...props} />);
        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find('div').find('div').exists()).toBe(true);

    })


    it('correct css classes', () => {

        var props = {
            config: {},
            isActive: false,
            onClick: () => { },
            onMouseEnter: () => { },
            onMouseLeave: () => { },
            showTitle: true,
            slimitem: {
                class_id: "GO:0005576",
                class_label: "extracellular",
                color: "#fff",
                no_data: true,
                separator: true
            }
        }

        const wrapper = shallow(<Block {...props} />);
        expect(wrapper.find(".ontology-ribbon__block").exists()).toBe(true);        
        expect(wrapper.find(".ontology-ribbon__tile-separator").exists()).toBe(true);        
        expect(wrapper.find(".ontology-ribbon__strip-label").exists()).toBe(true);

    })
        
});