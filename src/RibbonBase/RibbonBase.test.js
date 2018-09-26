import React from 'react';
import ReactDOM from 'react-dom';

import Block from '../RibbonBase/Block'
import RibbonBase from '../RibbonBase/RibbonBase'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<RibbonBase />', () => {

    it('correct dom rendering', () => {

        var props = {
            blocks: [
                {
                    class_id: "All annotations",
                    class_label: "Annotated to 52 classes",
                    color: "#8BC34A",
                    uniqueAssocs: [],
                    uniqueIDs: []
                },

                {
                    class_id: "GO:0003674 aspect",
                    class_label: "molecular function",
                    color: "#fff",
                    no_data: false,
                    separator: true,
                    uniqueAssocs: [],
                    uniqueIDs: ["RGD:620474-GO:0004672", "RGD:620474-GO:0000976", "RGD:620474-GO:0000978", "RGD:620474-GO:0001158", "RGD:620474-GO:0003677", "RGD:620474-GO:0000981", "RGD:620474-GO:0001077", "RGD:620474-GO:0001228", "RGD:620474-GO:0003682", "RGD:620474-GO:0003700", "RGD:620474-GO:0003705", "RGD:620474-GO:0008013"]                    
                }
            ],
            config: {},
            currentBlock: undefined,
            onSlimEnter: () => { },
            onSlimLeave: () => { },
            onSlimSelect: () => { },
            showBlockTitles: true
        }

        const wrapper = shallow(<RibbonBase {...props} />);
        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find('Block')).toHaveLength(props.blocks.length);
    })


    it('correct css classes', () => {

        var props = {
            blocks: [
                {
                    class_id: "All annotations",
                    class_label: "Annotated to 52 classes",
                    color: "#8BC34A",
                    uniqueAssocs: [],
                    uniqueIDs: []
                },

                {
                    class_id: "GO:0003674 aspect",
                    class_label: "molecular function",
                    color: "#fff",
                    no_data: false,
                    separator: true,
                    uniqueAssocs: [],
                    uniqueIDs: ["RGD:620474-GO:0004672", "RGD:620474-GO:0000976", "RGD:620474-GO:0000978", "RGD:620474-GO:0001158", "RGD:620474-GO:0003677", "RGD:620474-GO:0000981", "RGD:620474-GO:0001077", "RGD:620474-GO:0001228", "RGD:620474-GO:0003682", "RGD:620474-GO:0003700", "RGD:620474-GO:0003705", "RGD:620474-GO:0008013"]                    
                }
            ],
            config: {},
            currentBlock: undefined,
            onSlimEnter: () => { },
            onSlimLeave: () => { },
            onSlimSelect: () => { },
            showBlockTitles: true
        }

        const wrapper = shallow(<RibbonBase {...props} />);
        expect(wrapper.find('.ontology-ribbon__strip').exists()).toBe(true);
    })

});