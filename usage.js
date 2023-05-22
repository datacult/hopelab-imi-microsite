// © 2023 Data Culture
// Released under the ISC license.
// https://studio.datacult.com/ 
'use strict'

let usage = ((data, data_map = {x:'page', y:'views', section:'section', name: 'name',content:'content', state:'state', time:'avg_time', select:'All'}, selector = '#usage-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    if (window.outerWidth > 900){
        body.style('width','60%')
    
    // margins for SVG
    var margin = {
        left: 120,
        right: 50,
        top: 200,
        bottom: 130
    }

    // responsive width & height
    var svgWidth = 1400
    var svgHeight = (svgWidth / 1.75)+230

    var y_axis_font = 26, x_axis_font = 34, x_axis_shift = 35, y_axis_shift = 4.45, buffer = .12;
    var petal_range = [.3,7], explore_shift = 20, p_line_height = '3.75%'
    } else {
       // margins for SVG
    var margin = {
        left: 20,
        right: 20,
        top: 10,
        bottom: 200
    } 

    // responsive width & height
    var svgWidth = 500
    var svgHeight = svgWidth/1

    var y_axis_font = 16, x_axis_font = 16, x_axis_shift = 10, y_axis_shift = 4.45, buffer = .17
    var petal_range = [.15,4], explore_shift = 8, p_line_height = '5.75%'
    }
    

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".usage-svg").remove();

    const svg = body.append('svg')
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
        .domain([0,90])

    const yScale = d3.scaleLinear()
        .range([height, 0]); 

    const contentColorScale = d3.scaleOrdinal()
        .domain(["Learn","Resource","Community","Activity"])
        .range(["#F3AA5E","#834EF3","#FFE599","#52E0BE"])

    const petalScale = d3.scaleLinear()
        .range(petal_range)
        .domain([0,950])

    ////////////////////////////////////
    ///////////////axis/////////////////
    ///////////////////////////////////

    //x-axis
    let tickLabels = ['Stress','Queerness','Gender','Stigma'];
    let tickValues = [20,40,60,80]

    const axisScale = d3.scaleOrdinal()
        .domain(tickLabels)
        .range(tickValues)

    const xAxis = d3.axisBottom(xScale).ticks(3).tickValues(tickValues).tickFormat((d,i) => tickLabels[i])

    svg
        .append("g")
        .attr("class", 'axis')
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height+x_axis_shift})`)
        .call(xAxis.tickSize(0));

    svg
        .select('#x-axis .domain')
        .attr('stroke',0);

    svg
        .append("line")
        .attr('id','x-line')
        .attr('y1',height)
        .attr('y2',height)
        .attr('x1',0)
        .attr('x2',width)
        .attr('stroke','#2A353C');

    // y-axis
    const g = svg.append("g");

    //update y-scale
    function draw(max_val){

        if (max_val > 300) {
            var val = Math.ceil(max_val / 100) * 100
        } else if (max_val>200){
            var val = Math.ceil(max_val / 50) * 50
        } else {
            var val = Math.ceil(max_val / 10) * 10
        }

        yScale
            .domain([0,val])

        const yAxis = d3.axisLeft(yScale).tickSize(0).ticks(1).tickValues([val]);

        g
            .attr("class", 'axis')
            .attr("id", "y-axis")
            .attr("transform", 'translate('+y_axis_shift+',0)')
            .transition().duration(1000)
            .call(yAxis);
    
        svg.selectAll('#y-axis .domain')
            .attr('stroke','none');


        svg
            .selectAll('#y-axis')
            .style('font-family','Quicksand')
            .style('text-anchor','middle')
            .style('font-size',y_axis_font)
    } 

    //add arrow to y-axis
    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerWidth", 15)
        .attr("markerHeight", 15)
        .attr("refX", 4.45)
        .attr("refY", 2)
        .attr("orient", 0)
        .attr("markerUnits", "strokeWidth")
        .append("path")
        .attr("d", "M4.76566 1.12179C4.5704 0.926526 4.25382 0.926526 4.05856 1.12179L0.876576 4.30377C0.681313 4.49903 0.681313 4.81561 0.876576 5.01088C1.07184 5.20614 1.38842 5.20614 1.58368 5.01088L4.41211 2.18245L7.24054 5.01088C7.4358 5.20614 7.75238 5.20614 7.94764 5.01088C8.14291 4.81561 8.14291 4.49903 7.94764 4.30377L4.76566 1.12179ZM4.91211 1.97534L4.91211 1.47534L3.91211 1.47534L3.91211 1.97534L4.91211 1.97534Z")
        

    //draw split y-axis w/ label
    svg
        .append("line")
        .attr('id','y-line')
        // .attr('y1',height*(.62))
        .attr('y1',height*(.5+buffer))
        .attr('y2',height)
        .attr('x1',0)
        .attr('x2',0)
        .attr('stroke','#2A353C');

    svg
        .append("line")
        .attr('id','y-line')
        .attr('y1',height*(.5-buffer))
        .attr('y2',20)
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
        .style('font-family','Quicksand')
        .style('font-size',y_axis_font)

    svg
        .selectAll('#x-axis')
        .style('font-family','Quicksand')
        .style('font-size',x_axis_font)
        .attr('font-weight',800)

    
    ////////////////////////////////////
    ///////////////data/////////////////
    ////////////////////////////////////

    var height_data, petal_data, location_data, filtered,labels;

    //filter for location
    function filter_data(loc) {
     if (loc != 'All') {
        location_data = data.filter(d => d[data_map.state] == loc);
     } else {
        location_data = data
     }

    height_data = d3.rollup(location_data, v => d3.sum(v, d => d[data_map.y]), d => d[data_map.x])

    filtered = location_data.filter(d => d[data_map.section] !== null);

    petal_data = d3.rollup(filtered, v => d3.mean(v, d => d[data_map.time]), d => d[data_map.x], d => d[data_map.section], d => d[data_map.content])
    
    labels = d3.group(filtered,d => d[data_map.x],d=>d[data_map.section],d=>d[data_map.name])
    }

    filter_data(data_map.select)
    var sections = ["Support","Explore","Affirm"]

    ////////////////////////////////////
    ///////////////draw/////////////////
    ////////////////////////////////////

    //calculate top of y-axis domain
    var mx = Math.max(...[...height_data.values()])+Math.max(...[...height_data.values()])/5
    draw(mx)

    tickLabels.forEach(guide => {

        var guide_group = svg.append('g').attr('class','guide').attr('id',guide)

        guide_group
            .append("rect")
            .attr('class','stem')
            .attr('id','stem-'+guide)
            .attr('height',yScale(0)-yScale(height_data.get(guide))-3)
            .attr('y',yScale(height_data.get(guide)))
            .attr('x',xScale(axisScale(guide)))
            .attr('rx',1)
            .attr('width',0.01)
            .attr('stroke','#CECDFF')
            .attr('stroke-width',3);

        var x_group = xScale(axisScale(guide))
        var y_group = (yScale(height_data.get(guide)))

        sections.forEach(section => {
            
            var section_group = guide_group.append('g').attr('class','section').attr('id',section+'-'+guide)
                    

            var section_circ = section_group.append('circle').attr('class','section-circle').attr('id',section+'-'+guide+'-circle')
                                .attr('fill','#F6F6FA').attr('opacity',.8).attr('r',0)

            section_group.on("mouseover", function() {
                document.getElementById(guide).insertBefore(document.getElementById('Affirm-'+guide), document.getElementById(section+'-'+guide));
                
                var circ_dim = document.getElementById(section+'-'+guide).getBBox()
                section_circ.attr('r',get_radius(circ_dim.height,circ_dim.width))
                d3.select('#'+section+'-'+guide+'-name').attr('opacity',1)
                d3.select('#'+section+'-'+guide+'-rect').attr('opacity',0.8)
                
            }).on("mouseout", function() {
                document.getElementById(guide).insertBefore(document.getElementById(section+'-'+guide), document.getElementById('Affirm-'+guide));
    
                section_circ.attr('r',0)
                d3.select('#'+section+'-'+guide+'-name').attr('opacity',0)
                d3.select('#'+section+'-'+guide+'-rect').attr('opacity',0)
                
            });

            var section_data = petal_data.get(guide).get(section)

            var petal = "M65.4039 68.1416C39.8542 80.0385 14.9126 35.798 7.37112 25.2399C-0.170365 14.6818 -0.656252 4.26608 1.83786 1.75831C4.33197 -0.74946 8.62714 -0.642957 16.7314 4.32482C24.8357 9.2926 93.8178 54.9109 65.4039 68.1416Z"

            var content_it = section_data.keys()
            var x_translate = 0
            var y_translate = 0, shift = 4

            function draw_petals(content, x, y, rotate) {
                var time = section_data.get(content)
                var zero_scl = (time > 0) ? petalScale(time) : 0

                section_group
                    .append('path')
                    .attr('class','petal')
                    .attr('id',guide+section+content)
                    .attr('d',petal)
                    .attr('fill',contentColorScale(content))
                    .attr('transform','translate('+x+' '+y+') rotate('+rotate+') scale('+zero_scl+')')

            }

            function get_radius(ht,wd){
                return Math.sqrt(ht*ht+wd*wd)/2
            }

            if (section == "Support" & section_data.size == 4) {

                var content = content_it.next().value
                draw_petals(content,x_translate, y_translate,0)

                content = content_it.next().value
                draw_petals(content,x_translate-shift, y_translate,90)

                content = content_it.next().value
                draw_petals(content,x_translate-shift, y_translate-shift,180)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate-shift,270)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Support" & section_data.size == 3) {

                var content = content_it.next().value
                draw_petals(content,x_translate+shift, y_translate-shift/2,250)

                content = content_it.next().value
                draw_petals(content,x_translate+shift, y_translate+shift/2,10)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate,130)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Support" & section_data.size == 2) {

                var content = content_it.next().value
                draw_petals(content,x_translate, y_translate,90)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate-shift,180)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Explore" & section_data.size == 3) {

                var content = content_it.next().value
                draw_petals(content,x_translate-shift, y_translate,120)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate-shift,240)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate,0)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group+explore_shift)+' '+(y_group-(group_dim.height+group_dim.y))+')')

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Explore" & section_data.size == 2) {

                var content = content_it.next().value
                draw_petals(content,x_translate-shift/2, y_translate,210)

                content = content_it.next().value
                draw_petals(content,x_translate+shift/2, y_translate,300)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group+explore_shift)+' '+(y_group-5)+')')

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Affirm" & section_data.size == 2) {

                var content = content_it.next().value
                draw_petals(content,x_translate, y_translate,0)

                content = content_it.next().value
                draw_petals(content,x_translate, y_translate-shift,270)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-group_dim.x+5)+' '+(y_group-group_dim.y+15)+')')


                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            } else if (section == "Affirm" & section_data.size == 1) {

                var content = content_it.next().value
                draw_petals(content,x_translate, y_translate,10)

                var group_dim = document.getElementById(section+'-'+guide).getBBox();

                section_group.attr('transform','translate('+(x_group-group_dim.x+5)+' '+(y_group-group_dim.y+15)+')')
    
                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
            }

        })

        function build_paragraph(text,limit,target_id,text_id,x,font_size,line_height){
            var words = text.split(' ')
            var lines = Math.round(words.length/limit)+1
            var target = d3.select('#'+target_id)
                .append('text')
                .attr('class','p-text')
                .attr('id',text_id)
                .attr('text-anchor','middle')
                .attr('font-family','Quicksand')
                .attr('opacity',0)
                .attr('x',x)
                .attr('y',0)
                .attr('font-size',font_size)

            for (let i = 0; i < lines; i++){

                if (words.length > 0){
                    var line_txt = words.splice(0,limit)
                    
                    if (line_txt.join('').split('').length > (limit*5)){
                        words.unshift(line_txt.pop())
                    } else if (line_txt.join('').split('').length < (limit*5-5)){
                        line_txt.push(words.shift())
                    }

                if (i = 0){
                    target.append('tspan')
                    .attr('class','p-tspan')
                    .attr('x',x)
                    .text(line_txt.join(' '))
                } else {
                    target.append('tspan')
                    .attr('class','p-tspan')
                    .attr('x',x)
                    .attr('dy',line_height)
                    .text(line_txt.join(' '))
                }
                

                }

            }
        }

        
        
        sections.forEach(section => {
            var label = labels.get(guide).get(section).keys()
            if (window.outerWidth > 900){
                var hover_x = x_group
            } else {
                var hover_y = height+50
                var hover_x = width/2
            }

            build_paragraph(label.next().value,4,guide,section+'-'+guide+'-name',hover_x,26,p_line_height)
            
            var rect_size = document.getElementById(section+'-'+guide+'-name').getBBox(), padding = 15;
    
            guide_group.append('rect')
                .attr('class','p-rect')
                .attr('id',section+'-'+guide+'-rect')
                .attr('x',rect_size.x-padding)
                .attr('y',0)
                .attr('height',rect_size.height+padding*2)
                .attr('width',rect_size.width+padding*2)
                .style('fill','#F6F6FA')
                .attr('opacity',0)
                .attr('rx',15);

            if (window.outerWidth > 900){
                var hover_y = y_group - document.getElementById('Explore-'+guide).getBBox().height-(rect_size.height+padding*2)-5
            }

            d3.select('#'+section+'-'+guide+'-name').attr('y',hover_y)
            d3.select('#'+section+'-'+guide+'-rect').attr('y',hover_y-padding/4)

            document.getElementById(guide).insertBefore(document.getElementById(section+'-'+guide+'-rect'), document.getElementById(section+'-'+guide+'-name'));
    
        })
        

    })

    function scale_petals(guide, section, content, section_data){
        var time = section_data.get(content)
        console.log(section_data)
        console.log(guide+' '+section+' '+content+' '+time)
        var scl = (time > 0) ? petalScale(time) : 0

        const svgroot = document.getElementById("usage-group").parentNode;

        // SVGTransformList of the element that has been clicked on
        const tfmList = document.getElementById(guide+section+content).transform.baseVal;

        // Create a separate transform object for each transform
        const scale = svgroot.createSVGTransform();
        scale.setScale(scl,scl);

        tfmList.removeItem(2);
        tfmList.appendItem(scale);
    }




function update(loc) {
    //filter data
    filter_data(loc)


    draw(Math.max(...[...height_data.values()])+Math.max(...[...height_data.values()])/5)
    console.log(loc)
    tickLabels.forEach(guide =>{
        

        var x_group = xScale(axisScale(guide))
        var y_group = (yScale(height_data.get(guide)))

        //rescale petals
        sections.forEach(section =>{
            var section_data = petal_data.get(guide).get(section)

            //pull array of keys
            var content_keys = [ ...section_data.keys() ]
            //loop through keys
            content_keys.forEach(content =>{
                scale_petals(guide,section,content,section_data)
            })
            
            setTimeout(function(){ 
                //resize stems
                svg.select('#stem-'+guide)
                .attr('height',yScale(0)-yScale(height_data.get(guide))-3)
                .attr('y',yScale(height_data.get(guide)))

                //reposition groups
                var group_dim = document.getElementById(section+'-'+guide).getBBox();
                var section_group = d3.select('#'+section+'-'+guide)
                var section_circ = d3.select('#'+section+'-'+guide+'-circle')

                if (section == 'Support'){
                    section_group.attr('transform','translate('+(x_group-(group_dim.width+group_dim.x)-5)+' '+(y_group-group_dim.y+10)+')')
                    
                } else if (section == 'Explore' & ['Stress','Stigma'].includes(guide)){
                    section_group.attr('transform','translate('+(x_group+explore_shift)+' '+(y_group-(group_dim.height+group_dim.y))+')')
                } else if (section == 'Explore' & ['Gender','Queerness'].includes(guide)){
                    section_group.attr('transform','translate('+(x_group+explore_shift/2)+' '+(y_group-(group_dim.height+group_dim.y))+')')
                } else {
                    section_group.attr('transform','translate('+(x_group-group_dim.x+5)+' '+(y_group-group_dim.y+15)+')')
                }

                section_circ.attr('transform','translate('+((group_dim.x+group_dim.width/2))+' '+((group_dim.y+group_dim.height/2))+')')
           
                }, 1000);
        })

    setTimeout(function(){
    sections.forEach(section =>{
        
        var rect_size = document.getElementById(section+'-'+guide+'-name').getBBox(), padding = 15;

        if (window.outerWidth > 900){
            var hover_y = y_group - document.getElementById('Explore-'+guide).getBBox().height-(rect_size.height+padding*2)-30
        } else {
            var hover_y = height+50 
        }

        d3.select("#"+section+'-'+guide+'-name').attr('y',hover_y)

        d3.select("#"+section+'-'+guide+'-rect')
                .attr('y',hover_y-padding/2);
    })
    }, 1000);

    })
}

return {
    update: update,
}

})
