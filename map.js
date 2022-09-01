'use strict'

let map = ((data, data_map = {name:'Organization.Name', city:'City', state:'State', lat:'lat', long:'lng'}, selector = '#map-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    if (window.outerWidth > 900){
    
    // margins for SVG
    var margin = {
        left: 210,
        right: 210,
        top: 100,
        bottom: 100
    }

    // responsive width & height
    var svgWidth = 1400//parseInt(d3.select(selector).style('width'), 10)
    var svgHeight = (svgWidth / 2)
    } else {
       // margins for SVG
    var margin = {
        left: 40,
        right: 40,
        top: 180,
        bottom: 250
    } 

    // responsive width & height
    var svgWidth = 400//parseInt(d3.select(selector).style('width'), 10)
    var svgHeight = svgWidth/0.65//(svgWidth*1.4)
    }
    

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".map-svg").remove();

    const svg = body.append('svg')
        // .attr('height', svgHeight)
        // .attr('width', svgWidth)
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'map-svg')
        .append('g')
        .attr('id','map-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    ////////////////////////////////////
    //////////////scales////////////////
    ////////////////////////////////////

    const indicatorColorScale = d3.scaleOrdinal()
        .domain([data_map.y1,data_map.y2,data_map.y3])
        .range(["#1268B3","#63C2A1","#C69530"])

    // Map and projection
    var scl = 0.35, mult = 2
    const projection = d3.geoMercator()
        .scale(width / scl / Math.PI)
        .translate([width*mult+150, height*mult-150]);

    // Load external data and boot
d3.json("https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/500k/2021/state.json").then( function(geodata) {


        // Draw the map
        svg.append("g").attr('id','states')
            .selectAll(".country")
            .data(geodata.features)
            .join("path")
                .attr('class','country')
                .attr('id',d => d.properties.NAME.replace(" ", "-"))
                .attr("fill", "lightblue")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .style("stroke", "#fafafa")
                .style('stroke-width',1.25)
                .style('opacity',.8);

        d3.select("#Alaska").attr('transform',"translate(200 600) scale(0.5)")
        d3.select("#Hawaii").attr('transform',"translate(1070 -570) scale(2)")
        d3.select("#Puerto-Rico").attr('display',"none")

        document.getElementById('map-group').insertBefore(document.getElementById('states'), document.getElementById('circles'));
    
    })

    var circ_group = svg.append('g').attr('id','circles')

    data.forEach(loc => {

        var proj = projection([loc[data_map.long],loc[data_map.lat]])

        // Add the path using this helper function
        circ_group
        .append('circle')
        .attr('cx', proj[0])
        .attr('cy', proj[1])
        .attr('r', 5)
        .attr('fill', 'red');
        
    });


    document.getElementById('map-group').insertBefore(document.getElementById('states'), document.getElementById('circles'));
    

})
