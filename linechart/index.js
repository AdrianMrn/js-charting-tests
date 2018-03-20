$(function () {
    var i = 0;
    function hoverFunction() {
        i++;
        console.log(i);
        return (i);
    }

    Morris.Line({
        element: 'graph',
        behaveLikeLine: true,
        data: [
            { year: '2011', value: 42000000 },
            { year: '2012', value: 50000000 },
            { year: '2013', value: 32000000 },
            { year: '2014', value: 38000000 },
            { year: '2015', value: 46000000 },
            { year: '2016', value: 55000000 }
        ],
        ymax: 'auto 70000000',
        smooth: false,
        xkey: 'year',
        ykeys: ['value'],
        labels: ['Value'],
        hoverCallback: hoverFunction
    });
});