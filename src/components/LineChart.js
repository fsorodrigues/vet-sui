// importing d3 modules
import {select,mouse} from 'd3-selection';
import {axisBottom,axisLeft} from 'd3-axis';
import {min,max,range} from 'd3-array';
import {line,curveLinear} from "d3-shape";
import {dispatch} from "d3-dispatch";

// importing util functions
import {parseYear,formatYear,forceSort} from '../utils/utils';

function LineChart(_) {

    let _isMobile = false;
    let _curve = curveLinear;
    let _layout;
    let _config;
    let _scaleX;
    let _scaleY;

    const dispatcher = dispatch(
        'config:set',
        'line:reappend',
        'line:highlight:stroke:color',
        'line:default:stroke:color',
        'line:highlight:stroke:width',
        'line:default:stroke:width',
        'cursor:draw',
        'cursor:hide',
        'tooltip:toggle',
        'tooltip:untoggle'
    );

    function exports(data) {

        const root = this;
        const container = select(root);

        if (_config.forceOrder) {
            forceSort(data,['U.S.','Vermont'])
        }

        // appending svg
        let svgUpdate = container.selectAll('.svg')
            .data([data]);
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('svg',true);
        svgUpdate.exit().remove();
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('height', _layout.clientHeight)
            .attr('width', _layout.clientWidth);

        // appending g
        let plotUpdate = svgUpdate.selectAll('.plot')
            .data(d => [d]);
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot', true);
        plotUpdate.exit().remove();
        plotUpdate = plotUpdate.merge(plotEnter)
            .attr('transform',`translate(${_layout.margin.l},${_layout.margin.t})`);

        // instantiate axis generator
        const axisX = axisBottom()
            .scale(_scaleX)
            .tickSize(-_layout.h)
            .ticks(_config.nXTicks)
            .tickFormat(d => `'${formatYear(d)}`);

        const axisY = axisLeft()
            .scale(_scaleY)
            .ticks(5)
            .tickSize(-_layout.w);

        // call axes
        let axisXNode = plotUpdate.selectAll('.axis-x')
			.data([1]);
		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis axis-x');
        axisXNode.exit().remove();
		axisXNode = axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${_layout.h})`)
			.call(axisX);

		let axisYNode = plotUpdate.selectAll('.axis-y')
			.data([1]);
		const axisYNodeEnter = axisYNode.enter()
			.append('g')
			.attr('class','axis axis-y');
        axisYNode.exit().remove();
		axisYNode = axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(0,0)`)
			.call(axisY);

        // LINE CHART
        // instantiate path generators
        const lineGen = line()
            .x(d => _scaleX(parseYear(d[_config.X])))
            .y(d => _scaleY(+d[_config.Y]))
            .curve(_curve);

        // appending <g> for path
        let lineGroupUpdate = plotUpdate.selectAll('.line-group')
            .data(d => d);
        const lineGroupEnter = lineGroupUpdate.enter()
            .append('g')
            .classed('line-group',true);
        lineGroupUpdate.exit().remove();
        lineGroupUpdate = lineGroupUpdate.merge(lineGroupEnter)
            .attr('stroke', d => _config.getColor(d))
            .attr('stroke-width', d => _config.getStrokeWidth(d))
            .attr('fill','none');

        // appending paths to groups
        let curveLineUpdate = lineGroupUpdate.selectAll('.line-path')
            .data(d => [d.values]);
        const curveLineEnter = curveLineUpdate.enter()
            .append('path')
            .classed('line-path',true);
        curveLineUpdate.exit().remove();
        curveLineUpdate = curveLineUpdate.merge(curveLineEnter)
            .attr('d',lineGen);

        lineGroupUpdate.on('mouseenter', function(d) {
            const thisEl = select(this);
            dispatcher.call('config:set',null,_config.Y);
            dispatcher.call('line:reappend',{thisEl:this,all:lineGroupUpdate},null);
            dispatcher.call('line:highlight:stroke:color',{thisEl:thisEl,all:lineGroupUpdate},d);
            dispatcher.call('line:highlight:stroke:width',{thisEl:thisEl,all:lineGroupUpdate},d);

        }).on('mouseleave', function(d) {
            const thisEl = select(this);
            dispatcher.call('line:default:stroke:color',{thisEl:thisEl,all:lineGroupUpdate},d);
            dispatcher.call('line:default:stroke:width',{thisEl:thisEl,all:lineGroupUpdate},d);
        });

    };

    // getter-setter functions
    exports.isMobile = function(_) {
        // _ expects a boolean
        if (_ === 'undefined') return _isMobile;
        _isMobile = _;
        return this;
    };

    exports.layout = function(_) {
        // _ expects an object
        if (_ === 'undefined') return _layout;
        _layout = _;
        return this;
    };

    exports.config = function(_) {
        // _ expects an object
        if (_ === 'undefined') return _config;
        _config = _;
        return this;
    };

    exports.scaleX = function(_) {
        // _ expects a d3 scale function
        if (_ === 'undefined') return _scaleX;
        _scaleX = _;
        return this;
    };

    exports.scaleY = function(_) {
        // _ expects a d3 scale function
        if (_ === 'undefined') return _scaleY;
        _scaleY = _;
        return this;
    };

    exports.curve = function(_) {
        // _ expects a d3 curve function
        if (_ === 'undefined') return _curve;
        _curve = _;
        return this;
    }

    exports.on = function(eventType,cb) {
        // eventType expects a string
        // cb expects a function
        dispatcher.on(eventType,cb);
        return this;
    };

    return exports;
};

export default LineChart;



// let labelXUpdate = axisXNode.selectAll('.axis-x-label')
//     .data([_chartConfig.x_label]);
// const labelXEnter = labelXUpdate.enter()
//     .append('text');
// labelXUpdate = labelXEnter.merge(labelXEnter)
//     .classed('axis-x-label',true)
//     .attr('fill', 'black')
//     .attr('transform',`translate(${w/2},${margin.b-margin.t})`)
//     .attr('text-anchor', 'middle')
//     .text(d => d);

// let labelYUpdate = axisYNode.selectAll('.axis-y-label')
//     .data([_chartConfig.y_label]);
// const labelYEnter = labelYUpdate.enter()
//     .append('text');
// labelYUpdate = labelYEnter.merge(labelYEnter)
//     .classed('axis-y-label',true)
//     .attr('fill', 'black')
//     .attr('transform',`translate(${-margin.l/2},${h/2}) rotate(${270})`)
//     .attr('text-anchor', 'middle')
//     .text(d => d);

// let cursorUpdate = plotUpdate.selectAll('.cursor-hover')
//     .data([1]);
// const cursorEnter = cursorUpdate.enter()
//     .append('line')
//     .classed('cursor-hover',true)
//     .attr('y1',0);
// cursorUpdate.exit().remove();
// cursorUpdate = cursorUpdate.merge(cursorEnter)
//     .attr('stroke','black')
//     .attr('stroke-width',1)
//     .attr('x1',0)
//     .attr('x2',0)
//     .attr('y2',0);

// let rectUpdate = plotUpdate.selectAll('.rect-hover')
//     .data(d => [d]);
// const rectEnter = rectUpdate.enter()
//     .append('rect')
//     .classed('rect-hover',true)
//     .attr('x',0)
//     .attr('y',0);
// rectUpdate.exit().remove();
// rectUpdate = rectUpdate.merge(rectEnter)
//     .attr('fill-opacity',0)
//     .attr('height',h)
//     .attr('width',w);

// rectUpdate.on('mousemove',function(d) {
//     const [x,y] = mouse(this);
//     cursorUpdate.attr('x1',x)
//         .attr('x2',x)
//         .attr('y2',h);

//     const date = scaleX.invert(x);
//     let dataFiltered = d.filter(e => e.date <= date);
//     dataFiltered = dataFiltered[dataFiltered.length - 1];

//     const vizContainer = container.node().parentNode.parentNode;
//     const [mouseX,mouseY] = mouse(vizContainer);

//     const data = {
//         data:dataFiltered,
//         pos:{
//             x:mouseX,
//             y:mouseY
//         }
//     };

//     dispatcher.call('rect:move',container.node().parentNode.parentNode,data);

// }).on('mouseleave',function(d) {
//     cursorUpdate.attr('x1',0)
//         .attr('x2',0)
//         .attr('y2',0);
// });
