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
        top: 10,
        bottom: 10
    }

    // responsive width & height
    var svgWidth = 600//parseInt(d3.select(selector).style('width'), 10)
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
    d3.select(".study-svg").remove();

    const svg = body.append('svg')
        // .attr('height', svgHeight)
        // .attr('width', svgWidth)
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
    //////////////scales////////////////
    ////////////////////////////////////

    // const partnerColorScale = d3.scaleOrdinal()
    //     .domain(["Youth Center","Science Advisor","Community Partner"])
    //     .range(["#B1F1E2","#FFE599","#FBC28D"])

    //shapes
    // data.forEach(topic => {

        // const topicScale = d3.scaleLinear()
        //                 .domain([topic[data_map.min],topic[data_map.max]])
        //                 .range([0,200])

        svg.append('path')
            .attr('id','left')
            .attr('d','M149.896 3.89856C107.555 -3.1948 69.1736 -3.02933 36.9835 25.3325C5.82038 52.7895 -2.64193 68.6471 0.671441 110.01C4.71535 160.493 40.6229 183.203 88.6686 199.451C139.048 216.488 185.554 215.608 221.46 176.429C256.266 138.45 262.115 91.8259 239.748 45.4436C221.081 6.73254 192.336 11.0086 149.896 3.89856Z')
            // .attr('x',width/3)
            // .attr('y',200)
            // .attr('r',topicScale(topic[data_map.left]))
            .attr('fill','#7638FB')

        svg.append('path')
            .attr('id','right')
            .attr('d','M149.896 3.89856C107.555 -3.1948 69.1736 -3.02933 36.9835 25.3325C5.82038 52.7895 -2.64193 68.6471 0.671441 110.01C4.71535 160.493 40.6229 183.203 88.6686 199.451C139.048 216.488 185.554 215.608 221.46 176.429C256.266 138.45 262.115 91.8259 239.748 45.4436C221.081 6.73254 192.336 11.0086 149.896 3.89856Z')
            // .attr('x',width*2/3)
            // .attr('y',200)
            // .attr('transform','scale('+topicScale(topic[data_map.right])+')')
            .attr('fill','#D9D9D9')

        var topic = data[0]

        const topicScale = d3.scaleLinear()
                    .domain([topic[data_map.min],topic[data_map.max]])
                    .range([0,1])

        
        var left_loc = document.getElementById('left').getBBox();
        var right_loc = document.getElementById('right').getBBox();
        var left_scl = topicScale(topic[data_map.left]);
        var right_scl = topicScale(topic[data_map.right]);

        svg.selectAll('#left').attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(200-left_loc.height*left_scl/2)+') scale('+left_scl+')')
        svg.selectAll('#right').attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(200-right_loc.height*right_scl/2)+') scale('+right_scl+')')

        
    // });

    //text
    var font_size = 20, x_text = width/2, line_height = '8%';

    let study1 =  svg.append('text')
        .attr('class','step1')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',50)
        .attr('font-size',font_size)
        .style('opacity',1)

    study1
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('The ')
        .append('tspan')
        .text('imi users')
        .attr('font-weight',700)
        .attr('fill','#7638FB')
        .append('tspan')
        .text(' saw a ')
        .attr('font-weight',400)
        .attr('fill','black')
        .append('tspan')
        .text('significant')
        .attr('font-weight',700)

    study1
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('increase in certain coping skills')

    let study2 =  svg.append('text')
        .attr('class','step2')
        .attr('text-anchor','middle')
        .attr('x',x_text)
        .attr('y',50)
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
        .attr('font-weight',700)
        .attr('fill','#7638FB')
        .append('tspan')
        .text(' was 4.7 times longer')
        .attr('font-weight',400)
        .attr('fill','black')
    
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
        .attr('y',50)
        .attr('font-size',font_size)
        .style('opacity',0)

    study3
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('78% of participants identified as')

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
        .attr('y',50)
        .attr('font-size',font_size)
        .style('opacity',0)

    study4
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .text('60% of participants identified as transgender, ')

    study4
        .append('tspan')
        .attr('class','tspan')
        .attr('x',x_text)
        .attr('dy',line_height)
        .text('gender non-conforming, or gender non-binary')

    //scroll update function
    function update(val){

        // if (val) step = val.target.value;

        if (stp == 1) {

            topic = data[0]

            topicScale
                .domain([topic[data_map.min],topic[data_map.max]])
                .range([0,1])
                // .range([0,10])

            
            left_loc = document.getElementById('left').getBBox();
            right_loc = document.getElementById('right').getBBox();
            left_scl = topicScale(topic[data_map.left]);
            right_scl = topicScale(topic[data_map.right]);

            svg.selectAll('#left').attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(200-left_loc.height*left_scl/2)+') scale('+left_scl+')')
                .attr('fill','#7638FB')
            svg.selectAll('#right').attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(200-right_loc.height*right_scl/2)+') scale('+right_scl+')')
                .attr('fill','#D9D9D9')

            study1.style('opacity',1)
            study2.style('opacity',0)
            study3.style('opacity',0)
            study4.style('opacity',0)

            // svg.selectAll('.Coping').style('opacity',0)

        } else if (stp == 2){

            topic = data[1]

            topicScale
                .domain([topic[data_map.min],topic[data_map.max]])
                .range([0,1])

            left_loc = document.getElementById('left').getBBox();
            right_loc = document.getElementById('right').getBBox();
            left_scl = topicScale(topic[data_map.left]);
            right_scl = topicScale(topic[data_map.right]);

            svg.selectAll('#left').attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(200-left_loc.height*left_scl/2)+') scale('+left_scl+')')
                .attr('fill','#7638FB')
            svg.selectAll('#right').attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(200-right_loc.height*right_scl/2)+') scale('+right_scl+')')
                .attr('fill','#D9D9D9')
            
            study1.style('opacity',0)
            study2.style('opacity',1)
            study3.style('opacity',0)
            study4.style('opacity',0)

        } else if (stp == 3){

            topic = data[2]

            topicScale
                .domain([topic[data_map.min],topic[data_map.max]])
                .range([0,1])

            left_loc = document.getElementById('left').getBBox();
            right_loc = document.getElementById('right').getBBox();
            left_scl = topicScale(topic[data_map.left]);
            right_scl = topicScale(topic[data_map.right]);

            svg.selectAll('#left').attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(200-left_loc.height*left_scl/2)+') scale('+left_scl+')')
                .attr('fill','#52E0BE')
            svg.selectAll('#right').attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(200-right_loc.height*right_scl/2)+') scale('+right_scl+')')
                .attr('fill','#D9D9D9')

            study1.style('opacity',0)
            study2.style('opacity',0)
            study3.style('opacity',1)
            study4.style('opacity',0)

        } else {

            topic = data[3]

            topicScale
                .domain([topic[data_map.min],topic[data_map.max]])
                .range([0,1])

            left_loc = document.getElementById('left').getBBox();
            right_loc = document.getElementById('right').getBBox();
            left_scl = topicScale(topic[data_map.left]);
            right_scl = topicScale(topic[data_map.right]);

            svg.selectAll('#left').attr('transform','translate('+(width*2/3-left_loc.width*left_scl/2)+' '+(200-left_loc.height*left_scl/2)+') scale('+left_scl+')')
                .attr('fill','#52E0BE')
            svg.selectAll('#right').attr('transform','translate('+(width/3-right_loc.width*right_scl/2)+' '+(200-right_loc.height*right_scl/2)+') scale('+right_scl+')')
                .attr('fill','#D9D9D9')

            study1.style('opacity',0)
            study2.style('opacity',0)
            study3.style('opacity',0)
            study4.style('opacity',1)
        }

        

    }
    

    
})
