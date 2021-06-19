
//pie
anychart.onDocumentLoad(function () {
    // create an instance of a pie chart
    let chart = anychart.pie();
    // set the data
    chart.data([
        ["Башкортостан Респ", 5],
        ["Ямало-Ненецкий АО", 2],
        ["Самарская обл", 2],
        ["Бурятия", 2],
        ["Другие", 1]
    ]);
    let legend = chart.legend();
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

//bar
let data = [
    ["2020", 22000],
    ["2019", 40000],
    ["2018", 19000],
    ["2017", 12000],
    ["2016", 9300]
];

// create a chart
chart = anychart.bar();

// create a bar series and set the data
let series = chart.bar(data);

chart.title("Рейтинг балов по годам")
chart.barGroupsPadding(0);
// set the container id
chart.container("container-bar");

// initiate drawing the chart
chart.draw();


// area
let dataArea = [
    ["2016", 5732],
    ["2017", 8890],
    ["2018", 13321],
    ["2019", 89001],
    ["2020", 79000]
];

// create a chart
chartArea = anychart.area();

// create an area series and set the data
let seriesArea = chartArea.area(dataArea);

chartArea.title("Топ поступившых по годам");
chartArea.xScale().mode('continuous');
// set the container id
chartArea.container("container-area");

// initiate drawing the chart
chartArea.draw();