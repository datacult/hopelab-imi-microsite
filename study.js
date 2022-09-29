'use strict'

let study = ((data, data_map = {topic:'Topic', left:'Left', right:'Right', min:'Min', max:'Max'}, selector = '#study-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    if (window.outerWidth > 900){
    
    // margins for SVG
    var margin = {
        left: 20,
        right: 20,
        top: 0,
        bottom: 10
    }

    var scl_range = [0,1], line_height = '8%'

    // responsive width & height
    var svgWidth = 500
    var svgHeight = (svgWidth / 1.9)
    } else {
       // margins for SVG
    var margin = {
        left: 40,
        right: 40,
        top: 180,
        bottom: 250
    } 

    var scl_range = [0,.65], line_height = '4%'

    // responsive width & height
    var svgWidth = 400
    var svgHeight = svgWidth/0.65//(svgWidth*1.4)
    }
    

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".study-svg").remove();

    const svg = body.append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'study-svg')
        .append('g')
        .attr('id','study-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    ////////////////////////////////////
    //////////scroll observers//////////
    ////////////////////////////////////
    let stp = 1;
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: [.75]
      };
        
        const cope = document.querySelector('#cope');

        const copeObserver = new IntersectionObserver(handleCope, options);
    
        function handleCope(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 1
                update()
            }
        };
    
        copeObserver.observe(cope);

        const use = document.querySelector('#use');

        const useObserver = new IntersectionObserver(handleUse, options);
    
        function handleUse(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 2
                update()
            }
        };

        useObserver.observe(use);

        const race = document.querySelector('#race');

        const raceObserver = new IntersectionObserver(handleRace, options);
    
        function handleRace(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 3
                update()
            }
        };

        raceObserver.observe(race);

        const gender = document.querySelector('#gender');

        const genderObserver = new IntersectionObserver(handleGender, options);
    
        function handleGender(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 4
                update()
            }
        };

        genderObserver.observe(gender);


    ////////////////////////////////////
    ////////////////draw////////////////
    ////////////////////////////////////

        svg.append('path')
            .attr('class','shape')
            .attr('id','left')
            .attr('d','M149.896 3.89856C107.555 -3.1948 69.1736 -3.02933 36.9835 25.3325C5.82038 52.7895 -2.64193 68.6471 0.671441 110.01C4.71535 160.493 40.6229 183.203 88.6686 199.451C139.048 216.488 185.554 215.608 221.46 176.429C256.266 138.45 262.115 91.8259 239.748 45.4436C221.081 6.73254 192.336 11.0086 149.896 3.89856Z')
            .attr('fill','#7638FB')

        svg.append('path')
            .attr('class','shape')
            .attr('id','right')
            .attr('d','M149.896 3.89856C107.555 -3.1948 69.1736 -3.02933 36.9835 25.3325C5.82038 52.7895 -2.64193 68.6471 0.671441 110.01C4.71535 160.493 40.6229 183.203 88.6686 199.451C139.048 216.488 185.554 215.608 221.46 176.429C256.266 138.45 262.115 91.8259 239.748 45.4436C221.081 6.73254 192.336 11.0086 149.896 3.89856Z')
            .attr('fill','#D9D9D9')

        const topicScale = d3.scaleLinear();
        var left_loc, right_loc, left_scl, right_scl;

        update_shape(data[0],'#7638FB')

    //text
    var font_size = 20, x_text = width/2;

    let study1 =  svg.append('text')
        .attr('class','step1')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',font_size)
        .attr('font-size',font_size)
        .style('opacity',1)
        

    study1
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('The ')
        .append('tspan')
        .text('imi users')
        .attr('font-weight',800)
        .attr('fill','#7638FB')
        .append('tspan')
        .text(' saw a ')
        .attr('font-weight',400)
        .attr('fill','black')
        .append('tspan')
        .text('significant')
        .attr('id','hover-star')
        .attr('font-weight',800)
        .append('tspan')
        .text('*')

    study1
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('increase')
        .attr('font-weight',800)
        .append('tspan')
        .text(' in certain coping skills')
        .attr('font-weight',400)

    var hover_size = document.getElementById('hover-star').getBBox();

    let hover_text =  svg.append('text')
        .attr('class','sig-hover')
        .attr('id','sig-text')
        .attr('x',hover_size.x+60)
        .attr('y',hover_size.y-25)
        .attr('font-size',9)
        .attr('display',1)

    hover_text
        .append('tspan')
        .attr('class','tspan')
        .attr('x',hover_size.x+60)
        .text('Instrumental Support: d=0.24, b=0.29, P=.005')

    hover_text
        .append('tspan')
        .attr('class','tspan')
        .attr('x',hover_size.x+60)
        .attr('dy','4%')
        .text('Positive Reframing: d=0.27, b=0.22, P=.02')
    
    hover_text
        .append('tspan')
        .attr('class','tspan')
        .attr('x',hover_size.x+60)
        .attr('dy','4%')
        .text('Planning: d=0.26, b=0.23, P=.02')

        var hover_box = document.getElementById('sig-text').getBBox(), padding = 5;

        console.log(hover_box)

        svg.append('rect')
            .attr('class','sig-hover')
            .attr('id','sig-rect')
            .attr('x',hover_box.x-padding)
            .attr('y',hover_box.y-padding)
            .attr('height',hover_box.height+padding*2)
            .attr('width',hover_box.width+padding*2)
            .attr('fill','#F6F6FA')
            .attr('rx',10)
            .attr('display','none');

        document.getElementById('study-group').insertBefore(document.getElementById('sig-rect'), document.getElementById('sig-text'));
        
        hover_text
        .attr('display','none')

    

    let study2 =  svg.append('text')
        .attr('class','step2')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',font_size)
        .attr('font-size',font_size)
        .style('opacity',0)

    study2
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('The median time spent on the site')

    study2
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('by ')
        .append('tspan')
        .text('imi users')
        .attr('font-weight',800)
        .attr('fill','#7638FB')
        .append('tspan')
        .text(' was ')
        .attr('font-weight',400)
        .attr('fill','black')
        .append('tspan')
        .text('4.7 times longer')
        .attr('font-weight',800)
    
    study2
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('than the resource list users')

    let study3 =  svg.append('text')
        .attr('class','step3')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',font_size)
        .attr('font-size',font_size)
        .style('opacity',0)

    study3
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('78%')
        .attr('font-weight',800)
        .append('tspan')
        .text(' of participants identified as')
        .attr('font-weight',400)
        

    study3
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('racial or ethnic minorities')

    let study4 =  svg.append('text')
        .attr('class','step4')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',font_size)
        .attr('font-size',font_size)
        .style('opacity',0)

    study4
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('60%')
        .attr('font-weight',800)
        .append('tspan')
        .text(' of participants identified as')
        .attr('font-weight',400)

    study4
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text(' transgender, gender non-conforming, ')

    study4
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('or gender non-binary')

    var hover_rect = svg.append('rect')
        .attr('class','p-rect')
        .attr('id','hover-rect')
        .attr('x',hover_size.x)
        .attr('y',hover_size.y)
        .attr('height',hover_size.height)
        .attr('width',hover_size.width)
        .attr('opacity',0)
        .attr('display',1)
        .on("mouseover", function() {
            d3.selectAll('.sig-hover').attr('display',1)
        }).on("mouseout", function() {
            d3.selectAll('.sig-hover').attr('display','none')
        });

    function update_shape(topic, color){

            topicScale
                .domain([topic[data_map.min],topic[data_map.max]])
                .range(scl_range)

            left_loc = document.getElementById('left').getBBox();
            right_loc = document.getElementById('right').getBBox();
            left_scl = topicScale(topic[data_map.left]);
            right_scl = topicScale(topic[data_map.right]);

            svg.selectAll('#left')
                .attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(170-left_loc.height*left_scl/2)+') scale('+left_scl+')')
                .attr('fill',color)

            svg.selectAll('#right')
                .attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(170-right_loc.height*right_scl/2)+') scale('+right_scl+')')
                .attr('fill','#D9D9D9')
    }

    //scroll update function
    function update(val){

        // if (val) step = val.target.value;

        if (stp == 1) {

            update_shape(data[0],'#7638FB')

            study1.style('opacity',1)
            hover_rect.attr('display',1)
            study2.style('opacity',0)
            study3.style('opacity',0)
            study4.style('opacity',0)

        } else if (stp == 2){

            update_shape(data[1],'#7638FB')
            
            study1.style('opacity',0)
            hover_rect.attr('display',"none")
            study2.style('opacity',1)
            study3.style('opacity',0)
            study4.style('opacity',0)

        } else if (stp == 3){

            update_shape(data[2],'#52E0BE')

            study1.style('opacity',0)
            hover_rect.attr('display',"none")
            study2.style('opacity',0)
            study3.style('opacity',1)
            study4.style('opacity',0)

        } else {

            update_shape(data[3],'#52E0BE')

            study1.style('opacity',0)
            hover_rect.attr('display',"none")
            study2.style('opacity',0)
            study3.style('opacity',0)
            study4.style('opacity',1)
        }

        

    }
    

    
})
