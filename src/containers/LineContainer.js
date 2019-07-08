// importing d3 modules
import {select} from 'd3-selection';

// importing containers
import LineChart from '../components/LineChart';
import Tooltip from '../components/TooltipLine';

// instantiating components
const linechart = LineChart();
const tooltip = Tooltip();

function LineContainer(_) {

    let _isMobile = false;
    let _margin = {t:0,r:0,b:0,l:0};

    function exports(data) {

        const root = this;
        const container = select(root);

        // passing values to drawing function
        linechart.isMobile(_isMobile)
            .margin(_margin);

        // appending container and calling drawing function
        let svgContainerUpdate = container.selectAll('.svg-container')
            .data([data]);
        const svgContainerEnter = svgContainerUpdate.enter()
            .append('div')
            .classed('svg-container',true);
        svgContainerUpdate.exit().remove();
        svgContainerUpdate = svgContainerUpdate.merge(svgContainerEnter)
            .each(linechart);

        // tooltip.isMobile(_isMobile);
        // linechart.on('rect:move',function(d) {
        //     tooltip.toggle(true);
        //     select(this).select('#inflation-lines-tooltip')
        //         .data([d])
        //         .each(tooltip);
        // });

    };

    // getter-setter functions
    exports.isMobile = function(_) {
        // _ expects a boolean
        if (_ === 'undefined') return _isMobile;
        _isMobile = _;
        return this;
    };

    exports.margin = function(_) {
        // _ expects an object with t,r,b,l properties
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    return exports;
};

export default LineContainer;
