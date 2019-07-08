// importing d3 modules
import {select,mouse} from 'd3-selection';
import {scaleLinear,scaleTime} from 'd3-scale';
import {axisBottom,axisLeft} from 'd3-axis';
import {min,max,range} from 'd3-array';
import {line,curveLinear,curveStep} from "d3-shape";
import {dispatch} from "d3-dispatch";

// importing util functions
import {parseTime} from '../utils/utils';

function LineChart(_) {

    let _margin = {t:0, r:0, b:0, l:0};
    let _isMobile = false;
    let _maxY = 15;
    let _curve = curveStep;
    let _chartConfig;

    const dispatcher = dispatch('rect:move','rect:leave');

    function exports(data) {

        const root = this;
        const container = select(root);

        const clientHeight = root.clientHeight;
        const clientWidth = root.clientWidth;
        const margin = _margin;
        const h = clientHeight - (margin.t + margin.b);
        const w = clientWidth - (margin.l + margin.r);

        // appending svg
        let svgUpdate = container.selectAll('.svg')
            .data([data]);
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('svg',true);
        svgUpdate.exit().remove();
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('height', clientHeight)
            .attr('width', clientWidth);

        // appending g
        let plotUpdate = svgUpdate.selectAll('.plot')
            .data(d => [d]);
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot', true);
        plotUpdate.exit().remove();
        plotUpdate = plotUpdate.merge(plotEnter)
            .attr('transform',`translate(${margin.l},${margin.t})`);

        // data transformation
        const minDate = min(data,d => d.date);
        const maxDate = max(data,d => d.date);

        // // instantiate scales
        // const scaleX = scaleTime()
        //     .domain([minDate,maxDate])
        //     .range([0,w]);

        // const scaleY = scaleLinear()
        //     .domain([0,_maxY])
        //     .range([h,0]);

        // // LINE CHART
        // // instantiate path generators
        // const stepGen = line()
        //     .x(d => scaleX(d.date))
        //     .y(d => scaleY(d.nominal))
        //     .curve(curveStep);

        // const curveGen = line()
        //     .x(d => scaleX(d.date))
        //     .y(d => scaleY(d.adjusted))
        //     .curve(curveLinear);

        // // instantiate axis generator
        // const axisX = axisBottom()
        //     .scale(scaleX)
        //     .tickSize(-h)
		// 	.ticks(5);

        // const axisY = axisLeft()
        //     .scale(scaleY)
        //     .tickSize(-w)
        //     .tickValues(range(0,18,3))
        //     .ticks(5);

        // // appending <g> for path
        // let stepGroupUpdate = plotUpdate.selectAll('.step-group')
        //     .data(d => [d.filter(e => e.date < parseTime("2019-01-01"))]);
        // const stepGroupEnter = stepGroupUpdate.enter()
        //     .append('g')
        //     .classed('step-group',true);
        // stepGroupUpdate.exit().remove();
        // stepGroupUpdate = stepGroupUpdate.merge(stepGroupEnter);

        // // appending paths to groups
        // let stepLineUpdate = stepGroupUpdate.selectAll('.line-path')
        //     .data(d => [d]);
        // const stepLineEnter = stepLineUpdate.enter()
        //     .append('path')
        //     .classed('line-path',true);
        // stepLineUpdate.exit().remove();
        // stepLineUpdate = stepLineUpdate.merge(stepLineEnter)
        //     .attr('d',stepGen)
        //     .style('stroke', "#E9967A")
        //     .style('stroke-width', 2)
        //     .style('fill','none');

        // // appending <g> for path
        // let curveGroupUpdate = plotUpdate.selectAll('.curve-group')
        //     .data(d => [d.filter(e => e.date < parseTime("2019-01-01"))]);
        // const curveGroupEnter = curveGroupUpdate.enter()
        //     .append('g')
        //     .classed('curve-group',true);
        // curveGroupUpdate.exit().remove();
        // curveGroupUpdate = curveGroupUpdate.merge(curveGroupEnter);

        // // appending paths to groups
        // let curveLineUpdate = curveGroupUpdate.selectAll('.line-path')
        //     .data(d => [d]);
        // const curveLineEnter = curveLineUpdate.enter()
        //     .append('path')
        //     .classed('line-path',true);
        // curveLineUpdate.exit().remove();
        // curveLineUpdate = curveLineUpdate.merge(curveLineEnter)
        //     .attr('d',curveGen)
        //     .style('stroke', "#B23232")
        //     .style('stroke-width', 2)
        //     .style('fill','none');

        // // appending <g> for path
        // let projGroupUpdate = plotUpdate.selectAll('.proj-group')
        //     .data(d => [d.filter(e => e.date > parseTime("2017-01-01"))]);
        // const projGroupEnter = projGroupUpdate.enter()
        //     .append('g')
        //     .classed('proj-group',true);
        // projGroupUpdate.exit().remove();
        // projGroupUpdate = projGroupUpdate.merge(projGroupEnter);

        // // appending paths to groups
        // let projLineUpdate = projGroupUpdate.selectAll('.line-path')
        //     .data(d => [d]);
        // const projLineEnter = projLineUpdate.enter()
        //     .append('path')
        //     .classed('line-path',true);
        // projLineUpdate.exit().remove();
        // projLineUpdate = projLineUpdate.merge(projLineEnter)
        //     .attr('d',stepGen)
        //     .style('stroke', "#E9967A")
        //     .style('stroke-width', 2)
        //     .style('stroke-dasharray', `0.2px 4px`)
        //     .style('stroke-linecap',"round")
        //     .style('fill','none');

        // // call axes
        // let axisXNode = plotUpdate.selectAll('.axis-x')
		// 	.data([1]);
		// const axisXNodeEnter = axisXNode.enter()
		// 	.append('g')
		// 	.attr('class','axis axis-x');
        // axisXNode.exit().remove();
		// axisXNode = axisXNode.merge(axisXNodeEnter)
		// 	.attr('transform',`translate(0,${h})`)
		// 	.call(axisX);

		// let axisYNode = plotUpdate.selectAll('.axis-y')
		// 	.data([1]);
		// const axisYNodeEnter = axisYNode.enter()
		// 	.append('g')
		// 	.attr('class','axis axis-y');
        // axisYNode.exit().remove();
		// axisYNode = axisYNode.merge(axisYNodeEnter)
        //     .attr('transform',`translate(0,0)`)
		// 	.call(axisY);

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

    exports.chartConfig = function(_) {
        // _ expects an object with t,r,b,l properties
        if (_ === 'undefined') return _chartConfig;
        _chartConfig = _;
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

export default LineChart;
