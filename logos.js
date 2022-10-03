'use strict'

let map = ((data, data_map = {org:'organization', url:'url', x:'x', y:'y'}, selector = '#logos-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    if (window.outerWidth > 900){
    
    // margins for SVG
    var margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }

    // responsive width & height
    var svgWidth = 1440
    var svgHeight = 1160
    } else {
       // margins for SVG
    var margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    } 

    // responsive width & height
    var svgWidth = 400
    var svgHeight = svgWidth/1
    }
    

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".logos-svg").remove();

    const svg = body.append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'logos-svg')
        .append('g')
        .attr('id','logos-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // draw shapes

    svg.append('path')
    .attr('d','M237.5 9.60989C143.1 8.00989 -37.6905 -21.5567 -60.0238 32.61C-66.8572 69.11 -91.3003 353.21 -94.5003 449.61C-98.5003 570.11 -166.524 756.644 120.976 818.11C265.976 849.11 641.453 833.803 691 532.61C710 417.11 616.476 385.11 593.976 249.11C557.251 27.125 355.5 11.6099 237.5 9.60989Z')
    .attr('fill','#52E0BE')
    .attr('opacity',0.3)
    .attr('transform','translate(-103,80)')

})
