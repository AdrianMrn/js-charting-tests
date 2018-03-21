$(function () {
  var barData = [
    { x: '2011', value: 100 },
    { x: '2012', value: 200 },
    { x: '2013', value: 300 },
    { x: '2014', value: 400 },
    { x: '2015', value: 500 },
    { x: '2016', value: 400 },
    { x: '2017', value: 200 },
  ];

  var highestNum = 0;
  for (i in barData) {
    if (barData[i].value > highestNum) { highestNum = barData[i].value }
  }

  var mBar = Morris.Bar({
    element: 'bargraph',
    axes: false,
    grid: false,
    data: barData,
    xkey: 'x',
    ymax: (highestNum*1.5),
    ykeys: ['value'],
    labels: ['Y'],
    barColors: ['#573F92'],
    barSizeRatio: 0.99,
    barOpacity: 1,
    /* resize: true, */
    hoverCallback: function (index, options, content, row) {
      onHover(index);
      return false;
    }
  });

  // creating all the extra svg elements
  var bargraphSvg = $('#bargraph svg');
  bargraphSvg.attr({height:322});
  var rects = $("#bargraph svg rect");
  bargraphSvg.append(rects.get().reverse()); /* reversing the order of the rectangles so the shadow shows correctly */
  var clones = rects.clone();
  var bargraphParent = rects.parent();
  var textElems = [];

  // shadow https://www.w3schools.com/graphics/svg_feoffset.asp
  var shadowDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var shadowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  var shadowFeOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
  var shadowFeGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
  var shadowFeBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
  shadowFilter.appendChild(shadowFeOffset);
  shadowFilter.appendChild(shadowFeGaussianBlur);
  shadowFilter.appendChild(shadowFeBlend);
  shadowDefs.appendChild(shadowFilter);
  $(shadowFilter).attr({
    'id': 'svgBarShadowFilter',
    'x': 0,
    'y': '-50%',
    'width': '200%',
    'height': '200%',
  });
  $(shadowFeOffset).attr({
    'result': 'offOut',
    'in': 'SourceAlpha',
    'dx': 0,
    'dy': 0,
  });
  $(shadowFeGaussianBlur).attr({
    'result': 'blurOut',
    'in': 'offOut',
  });
  shadowFeGaussianBlur.setAttribute("stdDeviation", "50"); /* cannot use jquery .attr() with uppercase attributes */
  $(shadowFeBlend).attr({
    'in': 'SourceGraphic',
    'in2': 'blurOut',
    'mode': 'normal',
  });
  bargraphSvg.prepend(shadowDefs);

  for (var i = 0; i < clones.length; i++) {
    var clone = clones.eq(i);

    // fill opacity of "parent" element
    rects.eq(i).attr({
      'fill-opacity': 1,
      'style': '-webkit-tap-highlight-color: rgba(0, 0, 0, 0)',
    });

    // stroke
    var stroke = clone.clone();
    $(stroke).attr({
      'y': 0,
      'height': bargraphParent.attr('height'),
      'stroke': '#000',
      'stroke-opacity': 0.2,
      'fill-opacity': 0,
      'stroke-width': 1,
      'style': '',
    });
    bargraphSvg.append(stroke);

    // white-ish background
    clone.attr({
      'y': bargraphParent.attr('height'), // on hover this will be set to 0
      'height': bargraphParent.attr('height'),
      'fill': '#F4F4F4',
      'fill-opacity': 0,
      'style': '',
    });
    clone.insertBefore(rects.eq(i));

    // text
    var txtElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var parentWidth = parseInt(clone.attr('width'));
    $(txtElem).attr({
      'x': (parseInt(clone.attr('x')) + parentWidth / 2),
      'y': 60,
      'font-family': 'Open Sans',
      'font-size': (parentWidth / 3),
      'text-anchor': 'middle',
      'font-weight': '300',
      'fill-opacity': 0,
      'style': 'transform: translateY(150%)'
    });
    var theText = barData[i].value;
    var theMSG = document.createTextNode(theText);
    txtElem.appendChild(theMSG);
    textElems.push(txtElem);
    /* bargraphSvg.append(txtElem); */
    $(txtElem).insertBefore(rects.eq(i));

  }

  function onHover(index) {
    if (!clones) return false;
    var hoverElement = clones.eq(index);

    if (hoverElement.attr('fill-opacity') != 1) {
      $(textElems).eq(index).attr({ 'style': 'transform: translateY(0%)' }); // text
      $(textElems).eq(index).attr({ 'fill-opacity': 1 }); // text
      hoverElement.attr({ 'fill-opacity': 1 }); // white background
      hoverElement.attr({ 'filter': 'url(#svgBarShadowFilter)' }); // shadow
      hoverElement.attr({ 'y': '0' }); // shadow
      rects.eq(index).attr({'fill':'#745EAB'}); // rectangle color

      // make all other rectangles invisible again
      for (var i = 0; i < clones.length; i++) {
        if (i != index) {
          $(textElems).eq(i).attr({ 'style': 'transform: translateY(100%)' }); // text
          $(textElems).eq(i).attr({ 'fill-opacity': 0 }); // text
          clones.eq(i).attr({ 'fill-opacity': 0 }); // white background
          clones.eq(i).attr({ 'y': bargraphParent.attr('height') }); // shadow
          rects.eq(i).attr({ 'filter': '' }); // shadow
          rects.eq(i).attr({'fill':'#573F92'}); // rectangle color
        }
      }
    }
  }

  /* $("svg rect").on('click', function () {
    var label = $(".morris-hover.morris-default-style").html();
  }); */
});
