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
  //actualizaDropDownFilter("dependencia",dependencias,"DependId","DependDesc");
  actualizaDropDownFilter("plan",planes,"PlanId","PlanAbrev");
  actualizaDropDownFilter("ciclo",ciclos,"CicloId","CicloAbrev");
  actualizaDropDownFilter("grado",grados,"GradoId","GradoAbrev");
  actualizaDropDownFilter("orientacion",orientaciones,"OrientacionId","OrientacionDesc");
  actualizaDropDownFilter("opcion",opciones,"OpcionId","OpcionDesc");
  //actualizaDropDownFilter("materia",materias,"MateriaId","MateriaNombre");
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
  // actualizo input
  $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') );
  // actualizo etiqueta del botón
  var nombre = $('#btn-dd-'+$(this).attr('dd')).html().replace(/(: .*)? <span.*/,'');
  $('#btn-dd-'+$(this).attr('dd')).html( nombre+': '+$(this).text().replace(/ \(.*\)/,'') + ' <span class="caret"></span>');

  // actualizo las líneas del stock que se muestran
  if ($(this).attr('data') === "") {
    filtroStock();
  } else {
    // aplico el filtro
    $('#stock > tbody > tr:not(['+$(this).attr('dd')+'='+$(this).attr('data')+'])').filter(':visible').hide();
  }
  actualizaDropDownsFilter();
};

function filtroStock() {
  // muestro todas las opciones
  $('#stock > tbody > tr').show();
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

function buscar(id,nombres,clave,valor) {
  var elem = nombres.find(function(e){return e[clave]==id});
  return (elem ? elem[valor] : "");
};

function actualizaStock(){
  if (typeof stock === 'undefined') {
    return;
  }
  var html;
  for (var i = 0; i < stock.length; i++) {
    html += "<tr plan="+stock[i].PlanId+
              " ciclo="+stock[i].CicloId+
              " grado="+stock[i].GradoId+
              " orientacion="+stock[i].OrientacionId+
              " opcion="+stock[i].OpcionId+
              " grupos="+(parseInt(stock[i].GrTeorico != null ? stock[i].GrTeorico : 0)+parseInt(stock[i].GrPractico != null ? stock[i].GrPractico : 0))+
              ">"+
                 "<td>"+dependencias.find(function(e){return e.DependId==stock[i].DependId}).DependDesc+
            "</td><td>"+buscar(stock[i].PlanId, planes,"PlanId","PlanAbrev")+
            "</td><td>"+buscar(stock[i].CicloId, ciclos,"CicloId","CicloAbrev")+
            "</td><td>"+(stock[i].GradoId != null ?
                          buscar(stock[i].GradoId, grados,"GradoId","GradoAbrev")+
                          (stock[i].OpcionId == null || stock[i].OpcionId == 1 ?
                            " "+buscar(stock[i].OrientacionId, orientaciones,"OrientacionId","OrientacionAbrev") :
                            " "+buscar(stock[i].OpcionId, opciones,"OpcionId","OpcionAbrev")
                          ) :
                          "")+
            "</td><td>"+(stock[i].MateriaNombre != null ? stock[i].MateriaNombre : "")+
            "</td><td>"+(stock[i].GrTeorico != null ? stock[i].GrTeorico : "")+
            "</td><td>"+(stock[i].GrPractico != null ? stock[i].GrPractico : "")+
            "</td></tr>";
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
