'use strict'

let usage = ((data, data_map = {x:'page', y:'views', section:'section', content:'content', state:'state', time:'avg_time', select:'All'}, selector = '#usage-placeholder') => {

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
    d3.select(".usage-svg").remove();

    const svg = body.append('svg')
        // .attr('height', svgHeight)
        // .attr('width', svgWidth)
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'usage-svg')
        .append('g')
        .attr('id','usage-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    ////////////////////////////////////
    //////////////scales////////////////
    ////////////////////////////////////

    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0,100])
    // .domain(d3.extent(data, d => d[data_map.x]))

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0,10000])

    const contentColorScale = d3.scaleOrdinal()
        .domain(["Learn","Resource","Community","Activity"])
        .range(["#F3AA5E","#834EF3","#FFE599","#52E0BE"])

    const petalScale = d3.scaleLinear()
        .range([.2,1])
        .domain([0,120])

    ////////////////////////////////////
    ///////////////axis/////////////////
    ///////////////////////////////////
    let tickLabels = ['Stress','Queerness','Gender','Stigma'];
    let tickValues = [20,40,60,80]

    const axisScale = d3.scaleOrdinal()
        .domain(tickLabels)
        .range(tickValues)

    const xAxis = d3.axisBottom(xScale).ticks(3).tickValues(tickValues).tickFormat((d,i) => tickLabels[i])

    svg.append("g")
        .attr("class", 'axis')
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height+10})`)
        .call(xAxis.tickSize(0));

    svg.select('#x-axis .domain')
        .attr('stroke',0);

    svg
        .append("line")
        .attr('id','x-line')
        .attr('y1',height)
        .attr('y2',height)
        .attr('x1',0)
        .attr('x2',width)
        .attr('stroke','#2A353C');

    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("refX", 0)
        .attr("refY", 3)
        .attr("orient", "auto")
        .attr("markerUnits", "strokeWidth")
        .append("path")
        .attr("d", "M0,0 L0,6 L9,3 z")
        .attr("fill", "#000");

    svg
        .append("line")
        .attr('id','y-line')
        .attr('y1',height*(2/3))
        .attr('y2',height)
        .attr('x1',0)
        .attr('x2',0)
        .attr('stroke','#2A353C');

    svg
        .append("line")
        .attr('id','y-line')
        .attr('y1',height/3)
        .attr('y2',0)
        .attr('x1',0)
        .attr('x2',0)
        .attr('stroke','#2A353C')
        .attr('marker-end',"url(#arrow)");

    svg
        .append('text')
        .attr('id','y-label')
        .attr('x',-height/2)
        .attr('y',5)
        .attr('text-anchor','middle')
        .attr('transform','rotate(-90)')
        .text('Guide Views')
        .style('font-family','Montserrat')

    svg.selectAll('.axis').style('font-family','Montserrat')

    
    ////////////////////////////////////
    ///////////////data/////////////////
    ////////////////////////////////////

     if (data_map.select != 'All') {
        data = data.filter(d => d[data_map.state] == data_map.select);
     } 

    var height_data = d3.rollup(data, v => d3.sum(v, d => d[data_map.y]), d => d[data_map.x])

    data = data.filter(d => d[data_map.section] !== null);

    var petal_data = d3.rollup(data, v => d3.mean(v, d => d[data_map.time]), d => d[data_map.x], d => d[data_map.section], d => d[data_map.content])

    // console.log(petal_data)
    var sections = ["Support","Explore","Affirm"]

    ////////////////////////////////////
    ///////////////draw/////////////////
    ////////////////////////////////////
    tickLabels.forEach(guide => {

        var guide_group = svg.append('g').attr('class','guide').attr('id',guide)
       
        guide_group
        .append("line")
        .attr('id','stem-'+guide)
        .attr('y1',yScale(height_data.get(guide)))
        .attr('y2',yScale(0))
        .attr('x1',xScale(axisScale(guide)))
        .attr('x2',xScale(axisScale(guide)))
        .attr('stroke','#2A353C')
        .style("stroke-dasharray", ("3, 3"));

        // console.log(petal_data.get(guide))
        sections.forEach(section => {
            // console.log(petal_data.get(guide).get(section))
            var section_group = guide_group.append('g').attr('class','section').attr('id',section+'-'+guide)

            var section_data = petal_data.get(guide).get(section)

            var petal = "M65.4039 68.1416C39.8542 80.0385 14.9126 35.798 7.37112 25.2399C-0.170365 14.6818 -0.656252 4.26608 1.83786 1.75831C4.33197 -0.74946 8.62714 -0.642957 16.7314 4.32482C24.8357 9.2926 93.8178 54.9109 65.4039 68.1416Z"

            var content_it = section_data.keys()
            var x_group = xScale(axisScale(guide))
            var y_group = (yScale(height_data.get(guide)))
            var x_translate = 0
            var y_translate = 0, shift = 4

            if (section == "Support" & section_data.size == 4) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+x_translate+' '+y_translate+') rotate(0) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate-shift)+' '+y_translate+') rotate(90) scale('+petalScale(time)+')')
    
                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate-shift)+' '+(y_translate-shift)+') rotate(180) scale('+petalScale(time)+')')
    
                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+x_translate+' '+(y_translate-shift)+') rotate(270) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

            } else if (section == "Support" & section_data.size == 3) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate+shift)+' '+(y_translate-shift/2)+') rotate(250) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate+shift)+' '+(y_translate+shift/2)+') rotate(10) scale('+petalScale(time)+')')
    
                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate)+') rotate(130) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

            } else if (section == "Support" & section_data.size == 2) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate)+') rotate(90) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate-shift)+') rotate(180) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

            } else if (section == "Explore" & section_data.size == 3) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate-shift)+' '+(y_translate)+') rotate(120) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)
                console.log(time)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate-shift)+') rotate(240) scale('+petalScale(time)+')')
    
                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate)+') rotate(0) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group+20)+' '+(y_group-(group_dim.height+group_dim.y))+')')

            } else if (section == "Explore" & section_data.size == 2) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate-shift/2)+' '+(y_translate)+') rotate(210) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate+shift/2)+' '+(y_translate)+') rotate(300) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group+10)+' '+(y_group-5)+')')

            } else if (section == "Affirm" & section_data.size == 2) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate)+') rotate(0) scale('+petalScale(time)+')')

                content = content_it.next().value
                time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate-shift)+') rotate(270) scale('+petalScale(time)+')')
    
                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-group_dim.x+5)+' '+(y_group-group_dim.y+15)+')')


            } else if (section == "Affirm" & section_data.size == 1) {

                var content = content_it.next().value
                var time = section_data.get(content)

                section_group
                    .append('path')
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+(x_translate)+' '+(y_translate)+') rotate(10) scale('+petalScale(time)+')')

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-group_dim.x+5)+' '+(y_group-group_dim.y+15)+')')
    
            }

        })
        

    })



})
