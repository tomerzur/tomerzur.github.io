// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/texas.json").then(function (data) {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a line chart given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let lcYearPoverty = linechart()
      .x(d => d.year)
      .xLabel("YEAR")
      .y(d => d.poverty)
      .yLabel("POVERTY RATE")
      .yLabelOffset(40)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#linechart", data);

    // Create a scatterplot given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let spUnemployMurder = scatterplot()
      .x(d => d.unemployment)
      .xLabel("UNEMPLOYMENT RATE")
      .y(d => d.murder)
      .yLabel("MURDER RATE IN STATE PER 100000")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    let table = d3.select("table");
    //table.selectionDispatcher(d3.dispatch(dispatchString));

    let tableRows = d3.selectAll("tr");

    let body = d3.select("body");

    body.on("click", function(d){
      d3.select(this)
          .style("background-color", "transparent");
      tableRows.style("background-color", "transparent");
      tableRows.classed("mouseover", false)
    });

    tableRows.on("mouseover", function(d){
      d3.select(this)
          .style("background-color", "orange");
      d3.select(this).classed("mouseover", true)
      spUnemployMurder.updateSelection();
      lcYearPoverty.updateSelection();
    });

/*    for (let tableRow in tableRows) {
      tableRow.on("mouseover", function(d){
        d3.select(this)
            .style("background-color", "orange");
      }).on("mouseout", function(d){
        d3.select(this)
            .style("background-color", "transparent");
      });
    }*/


    // When the line chart selection is updated via brushing, 
    // tell the scatterplot to update it's selection (linking)
    lcYearPoverty.selectionDispatcher().on(dispatchString, spUnemployMurder.updateSelection);

    // When the scatterplot selection is updated via brushing, 
    // tell the line chart to update it's selection (linking)
    spUnemployMurder.selectionDispatcher().on(dispatchString, lcYearPoverty.updateSelection);

    //table.selectionDispatcher().on(dispatchString, lcYearPoverty.updateSelection);
  });

  /*let table = table();*/

})());