// importing d3 modules
import {select,mouse} from 'd3-selection';

// importing util functions
import {formatContent} from '../utils/utils';

// importing components

// instantiating components

function TooltipContent() {

    // let _circleNode;
    // let _radiusOffset;
    // let _toggle = true;
    // let _isMobile = false;

    function exports(data) {

        // access to root elements
        const root = this;
        const container = select(this);

        // append tooltip
        let tooltipTitleUpdate = container.selectAll('.tooltip-title')
            .data([data]);
        const tooltipTitleEnter = tooltipTitleUpdate.enter()
            .append('p')
            .classed('tooltip-title',true);
        tooltipTitleUpdate.exit().remove();
        tooltipTitleUpdate = tooltipTitleUpdate.merge(tooltipTitleEnter)
            .html(d => formatContent(d));

    }

    return exports;
}

export default TooltipContent;
