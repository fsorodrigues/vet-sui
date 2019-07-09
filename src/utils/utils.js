// importing d3.js
import {format} from "d3-format";
import {timeParse,timeFormat} from "d3-time-format";

// export const formatPct = format(".2%");
// export const formatPct1 = format(".1%");
//
// export const formatComma = format(",");
// export const formatDecimals = format(".2f");

export const parseYear = timeParse('%Y');
export const formatYear = timeFormat('%y');

export const isMobile = () => {
	if (navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i) ) {
		return true;
	} else {
		return false;
	}
};

export const forceSort = (d,values) => {
	values.forEach(e => {
		d.push(d.splice(d.indexOf(d.filter(f => f.key === e)[0]), 1)[0]);
	});
}
