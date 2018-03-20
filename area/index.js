$(function () {
    var areaData = [
        { x: '2012', value: 300 },
        { x: '2013', value: 200 },
        { x: '2014', value: 300 },
        { x: '2015', value: 400 },
        { x: '2016', value: 400 },
        { x: '2017', value: 500 },
    ];

    Morris.Area({
        element: 'areagraph',
        behaveLikeLine: true,
        smooth: true,
        axes: false,
        grid: false,
        data: areaData,
        xkey: 'x',
        ymax: 700,
        ykeys: ['value'],
        labels: ['Y'],
        fillOpacity: 0.8,
        hoverCallback: function (index, options, content, row) {
            onHover(index);
        }
    });

    // creating the background rectangles
    var circles = $('#areagraph svg circle');
    var graphWidth = $('#areagraph svg path')[0].getBoundingClientRect().width;
    var widthPerPoint = (graphWidth / (areaData.length - 1));

    var areagraphParent = circles.parent();
    var areagraphSvg = $('#areagraph svg');
    var backgroundElems = [];
    var textElems = [];
    for (var i = 0; i < circles.length; i++) {
        var circle = circles.eq(i);

        var rectPos = {
            'y': 0,
            'x': (circle.attr('cx') - widthPerPoint / 2),
            'height': areagraphParent.attr('height') - 20,
            'width': widthPerPoint,
        }

        // stroke
        var stroke = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        $(stroke).attr({
            'y': rectPos.y,
            'x': rectPos.x,
            'height': rectPos.height,
            'width': rectPos.width,
            'stroke': '#000',
            'stroke-opacity': 0.2,
            'fill-opacity': 0,
        });
        areagraphSvg.append(stroke);

        // background rect
        var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        $(bg).attr({
            'y': rectPos.y+1,
            'x': rectPos.x,
            'height': rectPos.height-1,
            'width': rectPos.width,
            'fill': '#FFF',
            'fill-opacity': 0,
        });
        backgroundElems.push(bg);
        areagraphSvg.prepend(bg);

        // text on background
        var txtElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
        $(txtElem).attr({
            'font-family': 'helvetica',
            'font-size': (widthPerPoint / 5),
            'text-anchor': 'middle',
            'x': parseInt(rectPos.x + widthPerPoint / 2),
            'y': 60,
            'fill-opacity': 0,
            'fill': '#303030',
            'font-weight': '200',
        });
        var theText = areaData[i].value;
        var theMSG = document.createTextNode(theText);
        txtElem.appendChild(theMSG);
        textElems.push(txtElem);
        areagraphSvg.append(txtElem);
 
    }

    function onHover(index) {
        if (!backgroundElems) return false;
        var hoverElement = $(backgroundElems).eq(index);

        if (hoverElement.attr('fill-opacity') != 1) {
            hoverElement.attr({'fill-opacity': 1});
            $(textElems).eq(index).attr({'fill-opacity': 1});

            for (var i = 0; i < backgroundElems.length; i++) {
                if (i != index) {
                    $(backgroundElems).eq(i).attr({'fill-opacity': 0});
                    $(textElems).eq(i).attr({'fill-opacity': 0});
                }
            }
        }
    }

});