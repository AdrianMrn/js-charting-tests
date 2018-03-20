$(function () {
    Morris.Donut({
        element: 'graph',
        data: [
            { value: 32214416, label: 'Andere watermaatschappijen', formatted: 'at least 70%' },
            { value: 49586931, label: 'Industrie', formatted: 'approx. 15%' },
            { value: 54970140, label: 'Residentieel', formatted: 'approx. 10%' },
        ],
        formatter: function (x, data) { return data.value.toLocaleString() + " m³"; }
    });
});

