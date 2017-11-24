function actualizaDropDownFilter(dd,nombres,clave,attrNombre){
  // Busco los valores en uso en stock para la columna col
  var cant = Array();
  $('#stock > tbody > tr:visible').each(function(){
    var id = $(this).attr(dd);
    if (id) {
      cant[id] = parseInt($(this).attr("grupos"))+(typeof cant[id] === "undefined" ? 0 : cant[id]);
    }
  });
  // Armo las opciones del dropdown
  var html = '<li><a href="#" dd="'+dd+'" data="">'+(nombres.find(function(n){return n[clave] == ""}))[attrNombre]+'</a></li><li class="divider"></li>';
  for (var id in cant) {
    var obj = nombres.find(function(n){return n[clave] == id});
    if (obj) {
      html += '<li><a href="#" dd="'+dd+'" data="'+id+'">'+obj[attrNombre]+' ('+cant[id]+')</a></li>';
    }
  }
  // Actualizo el dropdown
  $("ul.dropdown-menu[dd="+dd+"]").html( html );
  // función para actualizar los dropdown-menu cuando el usuario selecciona una opción
  $("ul.dropdown-menu[dd="+dd+"] li a").click(clickDropDownFilter);
};

function actualizaDropDownsFilter(){
  actualizaDropDownFilter("dependencia",dependencias,"DependId","DependDesc");
  actualizaDropDownFilter("plan",planes,"PlanId","PlanAbrev");
  actualizaDropDownFilter("ciclo",ciclos,"CicloId","CicloAbrev");
  actualizaDropDownFilter("turno",turnos,"TurnoId","TurnoDesc");
  actualizaDropDownFilter("grado",grados,"GradoId","GradoAbrev");
  actualizaDropDownFilter("orientacion",orientaciones,"OrientacionId","OrientacionDesc");
  actualizaDropDownFilter("opcion",opciones,"OpcionId","OpcionDesc");
  actualizaDropDownFilter("materia",materias,"MateriaId","MateriaNombre");
};

function clickDropDown(event) {
  // actualizo input
  $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') );
  // actualizo etiqueta del botón
  $('#btn-dd-'+$(this).attr('dd')).html( $(this).text() + ' <span class="caret"></span>');

  if ($(this).parents('form[autosubmit=1]').length) {
    // disaparo change en los inputs
    $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') ).change();
  }
};

// función para actualizar los dropdown-menu de tipo filtro cuando el usuario selecciona una opción
function clickDropDownFilter(event) {
  var elem = $(this);
  // actualizo input
  $('#dd-'+elem.attr('dd')).val( elem.attr('data') );
  // actualizo etiqueta del botón
  var nombre = $('#btn-dd-'+elem.attr('dd')).html().replace(/(: .*)? <span.*/,'');
  var valor = "";
  if (elem.attr('data') != "") {
    valor = ': '+elem.text().replace(/ \(.*\)/,'');
    $('#btn-dd-'+elem.attr('dd')).addClass("light");
  } else {
    $('#btn-dd-'+elem.attr('dd')).removeClass("light");
  }
  $('#btn-dd-'+elem.attr('dd')).html( nombre+ valor+ ' <span class="caret"></span>');

  // actualizo las líneas del stock que se muestran
  if (elem.attr('data') === "") {
    filtroStock();
  } else {
    // aplico el filtro
    $('#stock > tbody > tr:not(['+elem.attr('dd')+'='+elem.attr('data')+'])').filter(':visible').hide();
  }
  actualizaDropDownsFilter();
};

function filtroStock() {
  // muestro todas las opciones
  $('#stock > tbody > tr').show();
  // recorro los filtros
  $('input[type=hidden]').each(function(){
    var id = $(this).attr('id');
    if (id.match(/^dd-/) && $(this).val() !== "") {
      if ($(this).parents('form').length == 0) {
        // es un filtro que tiene valor asignado
        $('#stock > tbody > tr:not(['+$(this).attr('name')+'='+$(this).val()+'])').hide();
      }
    }
  });
};

function buscar(id,nombres,clave,valor,deft) {
  var elem = nombres.find(function(e){return e[clave]==id});
  return (elem && elem[valor] != null ? elem[valor] : (deft ? deft : ""));
};

function fijoAnchoDeCelda() {

  var anchos = Array();
  $('table#stock tbody tr:first-child td').each(function(i){
    anchos[i] = $(this).css("width");
  });
  $('table#stock thead tr:first-child th').each(function(i){
    $(this).css({'width': anchos[i]}); //fijo el ancho en la CSS
  });
  $('table#stock tbody tr').each(function(){
    $(this).find('td').each(function(i){
      $(this).css({'width': anchos[i]}); //fijo el ancho en la CSS
    });
  });
  $('table#stock thead tr').css({'width': $('table#stock tbody tr:first-child').css("width")});
  $('table#stock thead').css({'width': $('table#stock tbody').css("width")});

  //fijo los tamaños de los placeholders
  $('#filtros_placeholder').css({width: $('#filtros').css('width'), height: $('#filtros').css('height')});
};

const REFRESH_INTERVAL = 60*1000; // medido en ms
const CONFIRM_INTERVAL = 30; // medido en REFRESH_INTERVAL

var _csrf = $('#_csrf').val();
var pasada_actualizaStock = 0; // variable global para las confirmaciones
var oldstock; // variable global para encontrar cambios en el stock
function actualizaStock() {
  if (pasada_actualizaStock > CONFIRM_INTERVAL) {
    alert("¿Sigue ud. ahí?");
    pasada_actualizaStock = 0;
  }
  pasada_actualizaStock += 1;
  jQuery.getJSON( "stock", {_csrf:_csrf,departamento:departamento,asignatura:asignatura}, function(data){
    if (typeof data !== 'undefined') {
      oldstock = stock;
      stock = data;
      muestraStock();
      if( $('#scroll-breakpoint').offset().top < $(window).scrollTop() ) {
        $('#stock thead').addClass('affix');
        $('#stock thead').css({'top': $('#filtros').css('height')});
      }
    }
  });
  setTimeout(actualizaStock,REFRESH_INTERVAL);
};
if ($('#contenido-resultado').length) {
  setTimeout(actualizaStock,REFRESH_INTERVAL);
}

function muestraStock() {
  if (typeof stock === 'undefined' || typeof stock[0] === 'undefined') {
    $('#stock').html("");
    return;
  }

  var columns = Array('Liceo','Plan','Ciclo','Turno','Grupo','Materia');
  if (asignatura==2 || asignatura==9 || asignatura==19) {
    columns.push('Grupos<br/>Teórico','Grupos<br/>Práctico');
  } else {
    columns.push('Grupos');
  }
  var thead= "<tr>";
  columns.forEach(function(valor){
    thead += "<th>"+valor+"</th>";
  });
  thead += "</tr>";

  var lastDependId = stock[0].DependId;
  var tbody = "";
  for (var i = 0; i < stock.length; i++) {
    var dependdesc = buscar(stock[i].DependId, dependencias,"DependId","DependDesc");
    var dependNom = buscar(stock[i].DependId, dependencias,"DependId","DependNom",undefined);
    var GrTeorico = parseInt(stock[i].GrTeorico != null ? stock[i].GrTeorico : 0);
    var GrPractico = parseInt(stock[i].GrPractico != null ? stock[i].GrPractico : 0);
    var HsTeorico = parseInt(stock[i].HsTeorico != null ? stock[i].HsTeorico : 0);
    var HsPractico = parseInt(stock[i].HsPractico != null ? stock[i].HsPractico : 0);
    tbody += "<tr dependencia="+stock[i].DependId+
              " plan="+stock[i].PlanId+
              " ciclo="+stock[i].CicloId+
              " turno="+stock[i].TurnoId+
              " grado="+stock[i].GradoId+
              " orientacion="+stock[i].OrientacionId+
              " opcion="+stock[i].OpcionId+
              " materia="+stock[i].MateriaId+
              " grupos="+(GrTeorico+GrPractico)+
              (lastDependId != stock[i].DependId ?
                 " class='cambio-top'" : ""
               ) +
              (i+1<stock.length && stock[i].DependId != stock[i+1].DependId ?
                " class='cambio-bottom'" : ""
              ) +
              ">"+
              "<td>"+(dependNom ?
                        "<a data-toggle='popover' data-content='Nombre: "+dependNom+"'>"+dependdesc+"</a>" : dependdesc
              )+
              "</td><td>"+buscar(stock[i].PlanId, planes,"PlanId","PlanAbrev")+
              "</td><td>"+buscar(stock[i].CicloId, ciclos,"CicloId","CicloAbrev")+
              "</td><td>"+buscar(stock[i].TurnoId, turnos,"TurnoId","TurnoDesc")+
              "</td><td>"+(stock[i].GradoId != null ?
                            buscar(stock[i].GradoId, grados,"GradoId","GradoAbrev")+
                            (stock[i].OpcionId == null || stock[i].OpcionId == 1 ?
                              " "+buscar(stock[i].OrientacionId, orientaciones,"OrientacionId","OrientacionAbrev") :
                              " "+buscar(stock[i].OpcionId, opciones,"OpcionId","OpcionAbrev")
                            ) :
                            "")+
              "</td><td>"+buscar(stock[i].MateriaId, materias,"MateriaId","MateriaNombre")+
              "</td><td><a data-toggle='popover' data-content='Horas: "+HsTeorico+"'>"+GrTeorico+"</a>"+
              (asignatura==2 || asignatura==9 || asignatura==19 ?
                "</td><td><a data-toggle='popover' data-content='Horas: "+HsPractico+"'>"+GrPractico+"</a>" : ""
              )+
              "</td></tr>";
    lastDependId = stock[i].DependId;
  }
  $('#stock thead,#stock tbody').remove();
  $('#stock').html("<thead>"+thead+"</thead><tbody>"+tbody+"</tbody>");

  fijoAnchoDeCelda();
  filtroStock();

  // activo popovers
  $('[data-toggle="popover"]').popover();

  actualizaDropDownsFilter();
};
if ($('#contenido-resultado').length) {
  muestraStock();
}

  // submit de formularios con autosubmit
$("form[autosubmit=1] input").change(function(event) {
  if ( !!$('#dd-departamento').val() && !!$('#dd-asignatura').val() ) {
    $(this).parents('form').get(0).submit();
  }
});

// inicialización de las etiquetas de los dropdown-menu
$("ul.dropdown-menu").each(function() {
  var campo = $(this).attr('dd');
  var val = $('#dd-'+campo).val();
  if (typeof val !== 'undefined' && val!=="") {
    if ($(this).parents('form').length>0) {
      var texto = $("ul.dropdown-menu[dd="+campo+"] li a[data='"+val+"']").text().replace(/ \(.*\)/,'');
      // actualizo etiqueta del botón
      $('#btn-dd-'+campo).html( texto + ' <span class="caret"></span>');
    } else {
      $('ul.dropdown-menu[dd='+campo+'] li a[dd='+campo+'][data='+val+']').click();
    }
  }
});

// función para actualizar los dropdown-menu cuando el usuario selecciona una opción
$('ul.dropdown-menu[dd=departamento] li a').click(clickDropDown);
$('ul.dropdown-menu[dd=asignatura] li a').click(clickDropDown);

// programo el cambio de posición de los filtros y el encabezado de la tabla
if ($('#contenido-resultado').length) {
  $(window).scroll(function(){
    if (!$('.dropdown.open').length) {
      // no tengo un menú abierto
      if( $('#scroll-breakpoint').offset().top < $(window).scrollTop() ) {
        if (! $('#filtros.affix').length) {
          $('#filtros').addClass('affix');
          $('#stock thead').addClass('affix');
          $('#stock thead').css({'top': $('#filtros').css('height')});
          var header_height = $('#filtros').height() + $('#stock thead').height() + 28;
          if ($(window).scrollTop() < $('#stock tbody tr:first-child:visible').offset().top - header_height) {
            $(window).scrollTop( $('#stock tbody tr:first-child:visible').offset().top - header_height);
          }
        }
      } else {
        if ($('#filtros.affix').length) {
          $('#filtros').removeClass('affix');
          $('#stock thead').removeClass('affix');
          $('#stock thead').removeAttr('style');
        }
      }
    }
  });
}

// saco los créditos de la foto
if ($('a#credits').length) {
  window.setTimeout(function(){
    $('a#credits').fadeOut();
  },10000);
}
