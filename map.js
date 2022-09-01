'use strict'

let map = ((data, data2, data_map = {org_name:'Organization.Name', city:'City', state:'State', lat:'lat', long:'lng', type:'Type', name: 'Initials', pronouns:'Pronouns',quote:'quote'}, selector = '#map-placeholder') => {

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

    const partnerColorScale = d3.scaleOrdinal()
        .domain(["Youth Center","Science Advisor","Community Partner"])
        .range(["#B1F1E2","#FFE599","#FBC28D"])

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
                .attr("fill", "#F3F3F8")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .style("stroke", "white")
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
        // .attr('opacity',.8)
        .attr('fill', partnerColorScale(loc[data_map.type]));
        
    });

    var icon_group = svg.append('g').attr('id','icons')

    data2.forEach(loc => {

        var proj = projection([loc[data_map.long],loc[data_map.lat]])
        var popup_group = icon_group.append('g').attr('class','popups').attr('id',loc[data_map.name]).attr('display','none')

        // Add the path using this helper function
        icon_group
        .append('image')
        .attr('href','assets/icon.svg')
        .attr('x', proj[0])
        .attr('y', proj[1])
        .attr('height',20)
        // .attr('opacity',.8);
        .on("click", function() {
				popup_group.attr('display',1)
			});

        popup_group
        .append('rect')
        .attr('x',200)
        .attr('y',100)
        .attr('height',200)
        .attr('width',500)
        .attr('fill','#F4F4FF')
        .attr('rx',50)
        .attr('stroke','black')

        popup_group
        .append('text')
        .attr('x',width/2)
        .attr('y',height/2)
        .text(loc[data_map.quote])
        .attr('text-anchor','middle')

        popup_group
        .append('text')
        .attr('x',670)
        .attr('y',140)
        .text('X')
        .attr('text-anchor','middle')
        .on("click", function() {
				popup_group.attr('display','none')
			});

        
    });

})
