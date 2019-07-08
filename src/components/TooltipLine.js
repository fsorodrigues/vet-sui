// importing d3 modules
import {select,mouse} from 'd3-selection';

// importing components
import TooltipContent from './TooltipLineContent';

// instantiating components
const tooltipcontent = TooltipContent();

// importing stylesheets

function Tooltip() {

    let _circleNode;
    let _radiusOffset;
    let _toggle = true;
    let _isMobile = false;

    function exports(data) {

        // access to root elements
        const root = this;
        const container = select(this);

        if (_toggle ){

            const parentNode = root.parentNode;
            const parentCoordinates = parentNode.getBoundingClientRect();
            const w = root.clientWidth;

            let posLimit = 2*parentCoordinates.width/3;

            if (_isMobile) {
                posLimit = parentCoordinates.width/2;
            };

            // append tooltip container
            let tooltipUpdate = container.selectAll('.d3-tooltip')
                .data([data.data]);
            const tooltipEnter = tooltipUpdate.enter()
                .append('div')
                .classed('tooltip',true);
            tooltipUpdate.exit().remove();
            tooltipUpdate = tooltipUpdate.merge(tooltipEnter)
                .each(tooltipcontent);

            // compute positions
            let hPos = data.pos.x;

            // handle vertical position
            container.style('top',`${25}px`);

            // handle horizontal position
            if (hPos > posLimit) {
                hPos = data.pos.x - w;
                container.style('left',`${hPos}px`)
                    .style('right','');
            } else {
                container.style('left',`${hPos}px`)
                    .style('right','');
            }

            // remove intial transparency
            container.style("opacity",1);


        } else {
            container.style('top',`${-1000}px`)
                .style('left',`${-1000}px`)
                .style('right','');
        }

    }

    exports.isMobile = function(_) {
        // _ expects a boolean
        if (_ === 'undefined') return _isMobile;
        _isMobile = _;
        return this;
    };

    exports.circleNode = function(_) {
        // _ expects a node
        if (_ === 'undefined') return _circleNode;
        _circleNode = _;
        return this;
    };

    exports.radiusOffset = function(_) {
        // _ expects a float
        if (_ === 'undefined') return _radiusOffset;
        _radiusOffset = _;
        return this;
    };

    exports.toggle = function(_) {
        // _ expects a json object
        if (_ === 'undefined') return _toggle;
        _toggle = _;
        return this;
    };

    return exports;
}

export default Tooltip;
