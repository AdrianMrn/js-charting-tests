$(function () {
  var barData = [
    { x: '2011', value: 10000000 },
    { x: '2012', value: 20000000 },
    { x: '2013', value: 30000000 },
    { x: '2014', value: 40000000 },
    { x: '2015', value: 50000000 },
    { x: '2016', value: 40000000 },
    { x: '2017', value: 20000000 },
  ];

  var mBar = Morris.Bar({
    element: 'bargraph',
    axes: true,
    data: barData,
    xkey: 'x',
    ykeys: ['value'],
    labels: ['Y'],
    barColors: ['#00D5BE'],
    barSizeRatio: 0.99,
    barOpacity: 0.8,
    /* resize: true, */ 
    hoverCallback: function (index, options, content, row) {
      onHover(index);
      return false;
    }
  });

  // creating the background rectangles
  var rects = $("#bargraph svg rect");
  var clones = rects.clone();
  var bargraphParent = rects.parent();
  var backgroundBars = [];

  for (var i = 0; i < clones.length; i++) {
    var clone = clones.eq(i);
    
    // text on background
    var txtElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var parentWidth = parseInt(clone.attr('width'));
    $(txtElem).attr({
      'font-family': 'helvetica',
      'font-size': (parentWidth/5),
      'text-anchor': 'middle',
      'x': parseInt(clone.attr('x')) + parentWidth/2,
      'y': 60,
    });
    var theText = barData[i].value;
    var theMSG = document.createTextNode(theText);
    txtElem.appendChild(theMSG);
    //
    
    clone.attr({
      'y': 0,
      'height': bargraphParent.attr('height') - 35,
      'fill': '#E5E5E5',
      'style': '-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0;',
    });
    
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    $(group).attr({
      'style': 'fill-opacity: 0;'
    });
    group.appendChild(clone.get(0));
    group.appendChild(txtElem);

    $(group).insertBefore(rects.eq(0));
  }

  function onHover(index) {
    if (!clones) return false;
    var hoverElement = clones.eq(index);

    if (hoverElement.attr('style').indexOf('fill-opacity: 1') === -1) {
      clones.eq(index).attr({
        'style': '-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 1;',
      });
      clones.eq(index).parent().attr({'style': 'fill-opacity: 1;'});

      for (var i = 0; i < clones.length; i++) {
        if (i != index) {
          clones.eq(i).attr({
            'style': '-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0;',
          });
          clones.eq(i).parent().attr({'style': 'fill-opacity: 0;'});
        } 
      }
    }

  }

  /* $("svg rect").on('click', function () {
    var label = $(".morris-hover.morris-default-style").html();
  }); */
});
