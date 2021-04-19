// create variables

var samplesJson = "./static/data/samples.json"

var idSelect = d3.select("#selDataset"); //Creates Dropdown
var demoTable = d3.select("#sample-metadata"); //Creates Demo Table
var barChart = d3.select("#bar"); // Creates Bar Chart
var bubbleChart = d3.select("#bubble"); // Creates Bubble Chart

function init() {

  d3.json(samplesJson).then(data => {
    
    data.names.forEach(name => {
      var option = idSelect.append("option");
      option.text(name);
      }); 
      //close this function

   var initId = idSelect.property("value")
   plotCharts(initId); 

  });   
}  

function plotCharts(id) {

  resetHtml(); //Reset HTML so charts don't overlap

  //BUILDING DEMO TABLE
  d3.json(samplesJson).then(data => {
    var individualMetadata = data.metadata.filter(participant => participant.id == id)[0]; //must use square brackets to call the data from the list

    Object.entries(individualMetadata).forEach(([key, value]) => {
      var demolist = demoTable.append("ul")
        .attr("class","list-group");
      var listItem = demolist.append("li")
        .attr("style", "list-style-type: none");
      listItem.text(`${key}: ${value}`);
    });

    //Filtering JSON Data
    var individualSample = data.samples.filter(sample => sample.id == id)[0];
    
    //Trace X Axis
    var sampleValues = []
      sampleValues.push(individualSample.sample_values);
      var top1Ootusamples = sampleValues[0].slice(0, 10).reverse();
    
    //Trace Y Axis
    var otuIDs = []
      otuIDs.push(individualSample.otu_ids);
      var top1OotuIDs = otuIDs[0].slice(0, 10).reverse();

    // Labels
    var otuLabels = []
      otuLabels.push(individualSample.otu_labels);
      var top1OotuLabels = otuLabels[0].slice(0, 10).reverse();
    

    //BAR CHART 
    var barTrace = {
      x: top1Ootusamples,
      y: top1OotuIDs.map(otu => `OTU ${otu}`),
      type: "bar",
      orientation: "h", //Horizontal Bar Chart 
      text: top1OotuLabels //Hover Text 
    }; //Close

    var layout = {
      height: 650,
      width: 450
    }

    var barData = [barTrace];

    Plotly.newPlot("bar",barData, layout);
  
  
    //BUBBLE CHART 

    var bubbleTrace = {
      x: otuIDs[0],
      y: sampleValues[0],
      text: otuLabels[0], //Hover Text
      mode: 'markers',
        marker: {
          size: sampleValues[0], //size of bubbles
          color: otuIDs[0] //color of bubbles
        }
    }; //Close Function

    var layout = {
      xaxis: {
        title: "OTU ID",
        autotick: false,
        dtick: "500"
      },
      showlegend: false,
      height: 600,
      width: 1200
    };

    var bubbleData = [bubbleTrace];

    Plotly.newPlot("bubble",bubbleData, layout);


    //GAUGE COUNTER
    
    var wfreq = individualMetadata.wfreq;

    if (wfreq == null) {
      wfreq = 0;
    }

    // Indicator Trace
    var traceGauge = {
        value: wfreq,
        type: "indicator",
        mode: "gauge",
        gauge: {
            axis: {
                range: [0, 9],
                tickmode: 'linear',
                tickfont: {
                    size: 22
                }
            },
            bar: { color: 'rgba(8,29,88,0)' },
            steps: [
                { range: [0, 1], color: 'rgb(243,244,224)' }, 
                { range: [1, 2], color: 'rgb(238,240,218)' },
                { range: [2, 3], color: 'rgb(228,230,201)' },
                { range: [3, 4], color: 'rgb(238,243,186)' },
                { range: [4, 5], color: 'rgb(220,238,184)' },
                { range: [5, 6], color: 'rgb(192,209,156)' },
                { range: [6, 7], color: 'rgb(169,215,156)' },
                { range: [7, 8], color: 'rgb(144,188,149)' },
                { range: [8, 9], color: 'rgb(108,156,114)' }
            ]
        }
    };

    // Determine Angle
    var angle = (wfreq / 9) * 180; //9 Segments across 180 degrees

   
    var degrees = 180 - angle,
        radius = .75;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Needle Shape
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        cX = String(x),
        cY = String(y),
        pathEnd = ' Z';
    var path = mainPath + cX + " " + cY + pathEnd;

    // Draw Circle
    var needleCenter = {
        x: [0],
        y: [0],
        marker: {
          size: 15,
          color: '850000'
      }
    };

    var dataGauge = [traceGauge, needleCenter];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000',
                width: 7
            }
        }],
        title: {
            text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week`,
            font: {
                size: 20
            },
        },
        height: 500,
        width: 500,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1],
            fixedrange: true
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-0.5, 1.5],
            fixedrange: true
        }
    };

    Plotly.newPlot('gauge', dataGauge, layout);

  }); //Close

} // more closes

function resetHtml() {
  demoTable.html("");
}

function optionChanged(id) {
  plotCharts(id); 
}

init();