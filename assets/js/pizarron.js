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
  event.preventDefault();
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
  event.preventDefault();
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

function actualizaStock(){
  if (typeof stock === 'undefined') {
    return;
  }
  var lastDependId = stock[0].DependId;
  var html;
  for (var i = 0; i < stock.length; i++) {
    var dependdesc = buscar(stock[i].DependId, dependencias,"DependId","DependDesc");
    html += "<tr dependencia="+stock[i].DependId+
              " plan="+stock[i].PlanId+
              " ciclo="+stock[i].CicloId+
              " turno="+stock[i].TurnoId+
              " grado="+stock[i].GradoId+
              " orientacion="+stock[i].OrientacionId+
              " opcion="+stock[i].OpcionId+
              " materia="+stock[i].MateriaId+
              " grupos="+(parseInt(stock[i].GrTeorico != null ? stock[i].GrTeorico : 0)+parseInt(stock[i].GrPractico != null ? stock[i].GrPractico : 0))+
              (lastDependId != stock[i].DependId ? " class='cambio'" : "") +
              ">"+
                 "<td>"+dependdesc+
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
            "</td><td>"+(stock[i].GrTeorico != null ? stock[i].GrTeorico : "")+
            "</td><td>"+(stock[i].GrPractico != null ? stock[i].GrPractico : "")+
            "</td></tr>";
    lastDependId = stock[i].DependId;
  }
  $('#stock > tbody').html(html);
  actualizaDropDownsFilter();
};
$(document).ready(actualizaStock);

$(document).ready(function() {
  // formularios con autosubmit
  $("form[autosubmit=1] input").change(function(event) {
    $(this).parents('form').get(0).submit();
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
});

$(document).ready(function(){
  $(window).scroll(function(){
    if (! $('#buscador').visible(true)) {
      $('#filtros').addClass('affix');
    } else {
      $('#filtros').removeClass('affix');
    }
  })
});
