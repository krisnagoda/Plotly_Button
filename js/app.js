function init() {
    
    // select the dropdown element
    var selector = d3.select("#selDataset");
    
    // populate the dropdown with subject id from the list of sample names
      d3.json("data/samples.json").then((data) => {
        var subjectIds = data.names;
        subjectIds.forEach((id) => {
          selector
          .append("option")
          .text(id)
          .property("value", id);
        });
      
      // use the first subject ID from the names to build initial plots
      const firstSubject = subjectIds[0];
      updateCharts(firstSubject);
      updateMetadata(firstSubject);
    });
  }
  
  function updateMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    
  // data for gauge chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        marker: {size: 28, color:'850000'},
        value: result.wfreq,
        title: 'Belly Button Washing Frequency (weekly)',
        titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "#00008B" },
          bar: { color: "#ffffff" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "#808080",
          steps: [
            {range: [0, 2], color: "#8A8AFF" },
            {range: [2, 4], color: "#5C5CFF" },
            {range: [4, 6], color: "#2E2EFF" },
            {range: [6, 8], color: "#0000FF" },
            {range: [8, 10], color: "#0000A3" }
          ],
        }

      }
    ];
    
    // layout for gauge chart  
    var layout = {
      width: 500,
       height: 400,
       margin: { t: 1, r: 50, l: 50, b: 50 },
       line: {
       color: '600000'
       },
       paper_bgcolor: "#ffffff",
       font: { color: "#4b4b4b", family: "Serif" }
     };
  
    
    Plotly.newPlot("gauge", data, layout);

    });
  }
  
  // use `Object.entries` to add each key and value pair to the metaPanel
  // tags for each key-value in the metadata.
    function updateCharts(sample) {    
    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   
    
    // bubble chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Electric"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout); 
    
    // bar chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  
  function optionChanged(newSample) {
    
    // fetch new data each time a new sample is selected
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  
  // initialize dashboard
  init();