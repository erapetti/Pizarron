function actualizaDropDown(dd,nombres,clave,attrNombre){
  // Busco los valores en uso en stock para la columna col
  var seen = Array();
  $('#stock > tbody > tr:visible').each(function(){
    if ($(this).attr(dd)) {
      var id = $(this).attr(dd);
      var obj = nombres.find(function(n){return n[clave] == id});
      if (obj) {
        seen[$(this).attr(dd)] = obj[attrNombre];
      }
    }
  });
  /*
  for (var i = 0; i < stock.length; i++) {
    if (typeof stock[i][clave] !== 'undefined' && typeof seen[stock[i][clave]] === 'undefined') {
      var filterout=false;
      for (var filtro in Array("plan","ciclo","grado")) {
        var val = $('#dd-'+filtro).val();
        if (typeof val !== 'undefined' && stock[i][filtro])
        // incluyo la opción entre los encontrados
        var item = nombres.find(function(e){return e[clave]==stock[i][clave]});
        seen[stock[i][clave]] = item[attrNombre];
      }
    }
  }
  */
  // Armo las opciones del dropdown
  var html = '<li><a href="#" dd="'+dd+'" data="">'+(nombres.find(function(n){return n[clave] == ""}))[attrNombre]+'</a></li><li class="divider"></li>';
  for (var key in seen) {
    html += '<li><a href="#" dd="'+dd+'" data="'+key+'">'+seen[key]+'</a></li>';
  }
  // Actualizo el dropdown
  $("ul.dropdown-menu[dd="+dd+"]").html( html );
};

function buscar(id,nombres,clave,valor) {
  var elem = nombres.find(function(e){return e[clave]==id});
  return (elem ? elem[valor] : "");
};

function actualizaStock(){
  var html;
  for (var i = 0; i < stock.length; i++) {
    html += "<tr plan="+stock[i].PlanId+
              " ciclo="+stock[i].CicloId+
              " grado="+stock[i].GradoId+
              " orientacion="+stock[i].OrientacionId+
              " opcion="+stock[i].OpcionId+
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
  //actualizaDropDown("dependencia",dependencias,"DependId","DependDesc");
  actualizaDropDown("plan",planes,"PlanId","PlanAbrev");
  actualizaDropDown("ciclo",ciclos,"CicloId","CicloAbrev");
  actualizaDropDown("grado",grados,"GradoId","GradoAbrev");
  actualizaDropDown("orientacion",orientaciones,"OrientacionId","OrientacionAbrev");
  actualizaDropDown("opcion",opciones,"OpcionId","OpcionAbrev");
  //actualizaDropDown("materia",materias,"MateriaId","MateriaNombre");
};
$(document).ready(actualizaStock);

$(document).ready(function() {
  // formularios con autosubmit
  $("form[autosubmit=1] input").change(function(event) {
    $(this).parents('form').get(0).submit();
  });

  // inicialización de los dropdown-menu
  $("ul.dropdown-menu").each(function(index,obj) {
    var campo = $(this).attr('dd');
    var val = $('#dd-'+campo).val();
    if (typeof val !== 'undefined' && val!=="") {
      var texto = $("ul.dropdown-menu[dd="+campo+"] li a[data='"+val+"']").text();
      // actualizo etiqueta del botón
      $('#btn-dd-'+campo).html( texto + ' <span class="caret"></span>');
    }
  });

  // función para actualizar los dropdown-menu cuando el usuario selecciona una opción
  $("ul.dropdown-menu li a").click(function(event) {
    event.preventDefault();
    // actualizo input
    $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') );
    // actualizo etiqueta del botón
    $('#btn-dd-'+$(this).attr('dd')).html( $(this).text() + ' <span class="caret"></span>');

    if ($(this).parents('form[autosubmit=1]').length) {
      // disaparo change en los inputs
      $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') ).change();
    } else {
      // actualizo las líneas del stock que se muestran
      if ($(this).attr('data') === "") {
        $('#stock > tbody > tr').show();
      } else {
        $('#stock > tbody > tr').hide();
        $('#stock > tbody > tr['+$(this).attr('dd')+'='+$(this).attr('data')+']').show();
      }
    }
  });
});
