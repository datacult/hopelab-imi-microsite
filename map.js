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
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    } 

    // responsive width & height
    var svgWidth = 400//parseInt(d3.select(selector).style('width'), 10)
    var svgHeight = svgWidth/0.8//(svgWidth*1.4)
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
        .range(["#52E0BE","#FFD966","#FAB269"])

        if (window.outerWidth > 900){
    
            // Map and projection
            var scl = 0.35, mult = 2
            var projection = d3.geoMercator()
            .scale(width / scl / Math.PI)
            .translate([width*mult+150, height*mult-150]);

            // variables
            var circ_rad = 5, ak_trans = 'translate(200 600)', hi_trans = 'translate(1070 -570)', hi_scl = 2, icon_size = 30;

            } else {
             
            // Map and projection
            var scl = 0.35, mult = 1.55
            var projection = d3.geoMercator()
            .scale(width / scl / Math.PI)
            .translate([width*mult+185, height*mult-300]);

            // variables
            var circ_rad = 2.5, ak_trans = 'translate(175 360)', hi_trans = 'translate(570 -300)', hi_scl = 2, icon_size = 25;
        }

    // Load external data and boot
d3.json("https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/500k/2021/state.json").then( function(geodata) {


        // Draw the map
        svg.append("g").attr('id','states')
            .selectAll(".country")
            .data(geodata.features)
            .join("path")
                .attr('class','country')
                .attr('id',d => d.properties.NAME.replace(" ", "-"))
                .attr("fill", "#F0F0F5")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .style("stroke", "white")
                .style('stroke-width',1.25)
                .style('opacity',.8);

        d3.select("#Alaska").attr('transform',ak_trans+" scale("+ak_scl+")")
        d3.select("#Hawaii").attr('transform',hi_trans+" scale("+hi_scl+")")
        d3.select("#Puerto-Rico").attr('display',"none")

        document.getElementById('map-group').insertBefore(document.getElementById('states'), document.getElementById('circles'));
    
    })

    var circ_group = svg.append('g').attr('id','circles')
    var youth = circ_group.append('g').attr('id','youth')
    var science = circ_group.append('g').attr('id','science')
    var community = circ_group.append('g').attr('id','community')

    data.forEach(loc => {

        var proj = projection([loc[data_map.long],loc[data_map.lat]])

        var group
        (loc[data_map.type] == 'Youth Center') ? group = youth : (loc[data_map.type] == 'Science Advisor') ? group = science : group = community

        // Add the path using this helper function
        group
        .append('circle')
        .attr('class',loc[data_map.state]+'circ')
        .attr('id',loc[data_map.type].replace(' ','-'))
        .attr('cx', proj[0])
        .attr('cy', proj[1])
        .attr('r', circ_rad)
        .attr('opacity',(loc[data_map.type] == 'Youth Center') ? .5 : 1)
        .attr('fill', partnerColorScale(loc[data_map.type]));
        
    });

    // document.getElementById('circles').insertBefore(document.getElementById('Science-Advisor'), document.getElementById('Youth-Center'));
    // document.getElementById('circles').insertBefore(document.getElementById('Community-Partner'), document.getElementById('Science-Advisor'));

    var icon_group = svg.append('g').attr('id','icons')

    data2.forEach(loc => {

        var proj = projection([loc[data_map.long],loc[data_map.lat]])
        
        // Add the path using this helper function
        icon_group
        .append('image')
        .attr('href','assets/Testimonial.svg')
        .attr('class',loc[data_map.state])
        .attr('id','testimonial'+loc[data_map.state])
        .attr('x', proj[0])
        .attr('y', proj[1])
        .attr('height',icon_size)
        .attr('width',icon_size*.863)
        .attr('cursor','pointer')
        .on("click", function() {
				popup_group.attr('display',1)
			});

        var icon_loc = document.getElementById('testimonial'+loc[data_map.state]).getBBox();
        
        d3.select('#testimonial'+loc[data_map.state])
            .attr('x',proj[0]-icon_loc.width/4)
            .attr('y',proj[1]-icon_loc.height/1.3);

        var popup_group = icon_group.append('g').attr('class','popups').attr('id',loc[data_map.name]).attr('display','none')
        var rect_width = 500, rect_height = 200

        popup_group
        .append('rect')
        .attr('x',width/2-rect_width/2)
        .attr('y',height/2-rect_height/2)
        .attr('height',rect_height)
        .attr('width',rect_width)
        .attr('fill','#F4F4FF')
        .attr('rx',50)
        .attr('stroke','white')
        .attr('stroke-width',5)

        popup_group
        .append('text')
        .attr('x',width/2)
        .attr('y',height/2)
        .text(loc[data_map.quote])
        .attr('text-anchor','middle')

        popup_group
        .append('image')
        .attr('href','assets/x.svg')
        .attr('x',width/2+rect_width/2-40)
        .attr('y',height/2-rect_height/2+25)
        .attr('height',15)
        .attr('cursor','pointer')
        .on("click", function() {
				popup_group.attr('display','none')
			});

        
    });

    var ak_scl = 0.5;
    d3.selectAll('.AKcirc').attr('transform',ak_trans+" scale("+ak_scl+")").attr('r',circ_rad/ak_scl)
    d3.selectAll('.HIcirc').attr('transform',hi_trans+" scale("+hi_scl+")").attr('r',circ_rad/hi_scl)


})
