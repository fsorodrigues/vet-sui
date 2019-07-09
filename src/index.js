/**** IMPORTS: libraries, functions ****/
// importing d3 modules
import {select} from "d3-selection";
import {csv} from "d3-fetch";
import {nest} from "d3-collection";
import {min,max} from "d3-array";

// importing util functions
import {isMobile,parseYear} from "./utils/utils";

// importing CSS
import './style/main.css';
import './style/typography.css';
import './style/axes.css';

// importing containers
import LineContainer from './containers/LineContainer';

// layout variables
const margin = {t:5,r:15,b:15,l:15};

/**** INSTANCES: create instances of functions ****/
// instantiating mobile check
const mobile = isMobile();

// instantiating containers
const lines = LineContainer()
    .margin(margin)
    .isMobile(mobile);

/**** DRAWING: loading data, selecting root elements, calling drawing functions ****/
// loading data sets
const states = csv('./data/vets-states.csv',d => d);
const vermont = csv('./data/vets-vermont.csv',d => d);

Promise.all([states,vermont]).then(([states,vermont]) => {
    // data transformation
    // creating configs for different charts
    const statesConfig = {
        minY: 0,
        maxY: max(states, d => +d.rate),
        minX: parseYear(min(states, d => +d.year)),
        maxX: parseYear(max(states, d => +d.year)),
        X:"year",
        Y:"rate",
        getColor: d => d.key === 'Vermont' ? '#B23232' : d.key === 'U.S.' ? '#4169E1' :'gainsboro',
        getStrokeWidth: d => d.key === 'Vermont' ? 3 : d.key === 'U.S.' ? 3 : 1.25,
        nXTicks: 10,
        forceOrder:true,
        tooltipFunction:d => d,
        tooltipContainer:'#state-rates-tooltip'
    };

    const vermontConfig = {
        minY: 0,
        maxY: max(vermont, d => +d.value),
        minX: parseYear(min(vermont, d => +d.year)),
        maxX: parseYear(max(vermont, d => +d.year)),
        X:"year",
        Y:"value",
        getColor: d => d.key === 'veteran-rate' ? '#B23232' : 'gainsboro',
        getStrokeWidth: d => 3,
        nXTicks: 5,
        forceOrder:false,
        tooltipFunction:d => d,
        tooltipContainer:'#vermont-rates-tooltip'
    };

    // nesting datasets
    const statesNested = nest()
        .key(d => d.state)
        .entries(states);

    const vermontNested = nest()
        .key(d => d.rate)
        .entries(vermont);

    // selecting node and drawing
    // but, first, passing down variables to drawing function
    lines.config(statesConfig);
    select('#state-rates').data([statesNested])
        .each(lines);

    // selecting node and drawing
    // but, first, passing down variables to drawing function
    lines.config(vermontConfig);
    select('#vermont-rates').data([vermontNested])
        .each(lines);

    lines.on('config:set', function(d) {
        if (d === 'value') {
            lines.config(statesConfig);

        } else {
            lines.config(vermontConfig);
        }
    })


});
