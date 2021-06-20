
//pie
anychart.onDocumentLoad(function () {
    $.get('/getDataPie', (data) => {
        // create an instance of a pie chart
        let chart = anychart.pie();
        // set the data
        chart.data(data);
        let legend = chart.legend();
        chart.tooltip().format("Количество поступивших:{%y}");

        legend.itemsLayout("verticalExpandable");
        legend.position("right");
        // set chart title
        chart.title("Топ поступившых по регионам");
        // set the container element
        chart.container("container-pancake");
        chart.radius("50%");
        chart.innerRadius("30%");
        // initiate chart display
        chart.draw();
    });
});

//bar
$.get('/getDataBar', (data) => {
    // create a chart
    chart = anychart.bar();

    // create a bar series and set the data
    let series = chart.bar(data);

    var tooltip = chart.getSeries(0).tooltip();
    //tooltip.title().text("Привет");
    tooltip.format("Средний бал: {%y}");
    chart.title("Рейтинг балов по годам")
    chart.barGroupsPadding(0);
    // set the container id
    chart.container("container-bar");

    // initiate drawing the chart
    chart.draw();
});

// area
$.get('/getDataArea', (dataArea) => {
    // create a chart
    chartArea = anychart.area();

    // create an area series and set the data
    let seriesArea = chartArea.area(dataArea);
    chartArea.tooltip().format("Количество поступивших:{%y}");
    chartArea.title("Топ поступившых по годам");
    chartArea.xScale().mode('continuous');
    // set the container id
    chartArea.container("container-area");

    // initiate drawing the chart
    chartArea.draw();
});
