// importing d3 modules
import {select} from 'd3-selection';
import {scaleLinear,scaleTime} from 'd3-scale';
import {curveBasis,curveBundle,curveCardinal} from 'd3-shape';
import {dispatch} from 'd3-dispatch';

// importing containers
import LineChart from '../components/LineChart';
import Tooltip from '../components/TooltipLine';

// instantiating components
const linechart = LineChart();
const tooltip = Tooltip();

// importing util functions
// import {} from '../utils/utils';

function LineContainer(_) {

    let _isMobile = false;
    let _margin = {t:0,r:0,b:0,l:0};
    let _config = {
        minY: 0,
        maxY: 1,
        minX: 0,
        maxX: 1
    };

    const dispatcher = dispatch(
        'config:set'
    );

    function exports(data) {

        // selecting root element
        const root = this;
        const container = select(root);

        // layout variables
        const layout = {
            clientHeight: root.clientHeight,
            clientWidth: root.clientWidth,
            margin: _margin,
        };
        layout.h = layout.clientHeight - (layout.margin.t + layout.margin.b);
        layout.w = layout.clientWidth - (layout.margin.l + layout.margin.r);

        // defining scales
        const scaleX = scaleTime()
            .domain([_config.minX,_config.maxX])
            .range([0,layout.w]);

        const scaleY = scaleLinear()
            .domain([_config.minY,_config.maxY])
            .range([layout.h,0]);

        // passing values to drawing function
        linechart.isMobile(_isMobile)
            .layout(layout)
            .config(_config)
            .scaleX(scaleX)
            .scaleY(scaleY);

        // appending container and calling drawing function
        let svgContainerUpdate = container.selectAll('.svg-container')
            .data([data]);
        const svgContainerEnter = svgContainerUpdate.enter()
            .append('div')
            .classed('svg-container',true);
        svgContainerUpdate.exit().remove();
        svgContainerUpdate = svgContainerUpdate.merge(svgContainerEnter)
            .each(linechart);

        linechart.on('config:set', function(d) {
            dispatcher.call('config:set',null,d);

        }).on('line:reappend', function() {
            const filter = this.all.filter(d => (d.key === 'Vermont') | (d.key === 'U.S.')).nodes();
            filter.forEach(el => {
                el.parentNode.appendChild(el);
            })
            this.thisEl.parentNode.appendChild(this.thisEl);

        }).on('line:highlight:stroke:color', function(d) {
            this.thisEl.attr('stroke', e => _config.getColor(e) === 'gainsboro' ? 'black' : _config.getColor(e))

        }).on('line:default:stroke:color', function(d) {
            this.all.attr('stroke', e => _config.getColor(e));

        }).on('line:highlight:stroke:width', function(d) {
            this.all.attr('stroke-width', e => _config.getColor(e) === _config.getColor(d) ? _config.getStrokeWidth(d) : 0.75);
            this.thisEl.attr('stroke-width',3)

        }).on('line:default:stroke:width', function(d) {
            this.all.attr('stroke-width', e => _config.getStrokeWidth(e));
        });

        // this.all.attr('stroke-width',1);

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

    exports.config = function(_) {
        // _ expects an object
        if (_ === 'undefined') return _config;
        _config = _
        return this;
    };

    exports.on = function(eventType,cb) {
        // eventType expects a string
        // cb expects a function
        dispatcher.on(eventType,cb);
        return this;
    };

    return exports;
};

export default LineContainer;
