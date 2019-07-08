// importing d3.js
import {format} from "d3-format";
import {timeFormat,timeParse} from "d3-time-format";

export const formatPct = format(".2%");
export const formatPct1 = format(".1%");

export const formatComma = format(",");
export const formatDecimals = format(".2f");

export const parseTime = timeParse("%Y-%m-%d");
export const formatYear = timeFormat("%Y");

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

//
export const parseInflation = d => {
	return {
		date:parseTime(d.date),
		nominal:+d["max-in-vt"],
		adjusted:+d["real-in-vt"],
	};
};

export const formatContent = d => {
	if (formatYear(d.date) >= "2019") {
		return `<span class='tooltip-bold'>${formatYear(d.date)}</span> projected value: <span class='tooltip-bold'>$${formatDecimals(d.nominal)}</span>`;
	} else if (formatYear(d.date) === "1968") {
		return `In <span class='tooltip-bold'>${formatYear(d.date)}</span> the minimum wage reached its maximum purchasing power at <span class='tooltip-bold'>$${formatDecimals(d.nominal)}</span>, or <span class='tooltip-bold'>$${formatDecimals(d.adjusted)}</span> in 2018.`;
	} else {
		return `In <span class='tooltip-bold'>${formatYear(d.date)}</span> the minimum wage value was <span class='tooltip-bold'>$${formatDecimals(d.nominal)}</span>, the equivalent to <span class='tooltip-bold'>$${formatDecimals(d.adjusted)}</span> in 2018.`;
	}
};
