/**** IMPORTS: libraries, functions ****/
// importing d3 modules
import {select} from "d3-selection";
import {csv} from "d3-fetch";
import {nest} from "d3-collection";
import {min,max} from "d3-array";

// importing util functions
import {isMobile} from "./utils/utils";

// importing CSS
import './style/main.css';
import './style/typography.css';
import './style/axes.css';

// importing containers
import LineContainer from './containers/LineContainer';

// layout variables
const margin = {t:0,r:0,b:0,l:0};

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
    const statesConfig = {
        minY: 0,
        maxY: max(states, d => +d.value),
        minX: min(states, d => +d.year),
        maxX: max(states, d => +d.year)
    };
    console.log(statesConfig);

    // nesting datasets
    const statesNested = nest()
        .key(d => d.state)
        .entries(states);

    const vermontNested = nest()
        .key(d => d.rate)
        .entries(vermont);

    // selectind nodes and drawing
    select('#state-rates').data([statesNested])
        .each(lines);

});
