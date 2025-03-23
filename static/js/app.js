// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata_field = data.metadata;


    // Filter the metadata for the object with the desired sample number
    let result= metadata_field.filter(sampleobj => sampleobj.id == sample)[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    data_keys = Object.keys(result);
    data_values = Object.values(result);
    for (let i = 0; i < data_keys.length; i++)
    {
      panel.append("h6").text(`${data_keys[i].toUpperCase()} : ${data_values[i]}`)
    };

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples ;

    // Filter the samples for the object with the desired sample number
    let sampleData = samples.filter(x => x.id == sample)[0];
    // let sampleData = sample_array[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale : 'Rainbow'
      }
    };

    var data1 = [trace1];

    // Render the Bubble Chart
    var layout1 = {
      title: "Bacteria Cultures Per Sample",
      xaxis : {title: "OTU ID"},
      yaxis : {title: "Number of Bacteria"},
      margin: {
        l: 100,
        r: 50,
        t: 50,
        b: 50
      }

    };


    // Render the Bubble Chart
    Plotly.newPlot('bubble', data1, layout1);

    // Build a Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otu_ID => `OTU ${otu_ID}`).reverse();
    let bar_label = otu_labels.slice(0,10).reverse();
    let sample_value_data = sample_values.slice(0,10).reverse();

    // Build a Bar Chart
    let trace2 = {
      x: sample_value_data,
      y: yticks,
      text: bar_label,
      hovertext: otu_labels,
      // marker: {
      //   color : 'blue'
      // },
      type: "bar",
      orientation: "h"
    };
    
    let data2 = [trace2];

    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis : {title: "Number of Bacteria"},
      margin: {
        l: 100,
        r: 50,
        t: 50,
        b: 50
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", data2, layout2);
 
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names_field = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownID = d3.select("#selDataset");



    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let j=0; j<names_field.length; j++){
      dropdownID.append("option").text(`${names_field[j]}`).attr("value",names_field[j]);
    };

    // Get the first sample from the list
    first_sample = names_field[0];


    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
