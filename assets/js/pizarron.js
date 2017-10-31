function actualizaDropDown(dd,nombres,clave,attrNombre){
  // Busco los valores en uso en stock para la columna col
  var seen = Array();
  for (var i = 0; i < stock.length; i++) {
    if (typeof stock[i][clave] !== 'undefined' && typeof seen[stock[i][clave]] === 'undefined') {
      var item = nombres.find(function(e){return e[clave]==stock[i][clave]});
      seen[stock[i][clave]] = item[attrNombre];
    }
  }
  // Armo las opciones del dropdown
  var html = "";
  for (var key in seen) {
    html += '<li><a href="#" dd="'+dd+'" data="'+key+'">'+seen[key]+'</a></li>';
  }
  // Actualizo el dropdown
  $("ul.dropdown-menu[dd="+dd+"]").html( html );
};

function actualizaStock(){
  var html;
  for (var i = 0; i < stock.length; i++) {
    html += "<tr><td>"+dependencias.find(function(e){return e.DependId==stock[i].DependId}).DependDesc+
            "</td><td>"+planes.find(function(e){return e.PlanId==stock[i].PlanId}).PlanAbrev+
            "</td><td>"+ciclos.find(function(e){return e.CicloId==stock[i].CicloId}).CicloAbrev+
            "</td><td>"+grados.find(function(e){return e.GradoId==stock[i].GradoId}).GradoAbrev+
            "</td><td>"+stock[i].OrientacionId+
            "</td><td>"+stock[i].OpcionId+
            "</td><td>"+stock[i].MateriaNombre+
            "</td><td>"+stock[i].Grupos+
            "</td></tr>";
  }
  $('#stock > tbody').html(html);
  //actualizaDropDown("dependencia",dependencias,"DependId","DependDesc");
  actualizaDropDown("plan",planes,"PlanId","PlanAbrev");
  actualizaDropDown("ciclo",ciclos,"CicloId","CicloAbrev");
  actualizaDropDown("grado",grados,"GradoId","GradoAbrev");
  //actualizaDropDown("materia",materias,"MateriaId","MateriaNombre");
};
$(document).ready(actualizaStock);

$(document).ready(function() {
  // inicialización de los dropdown-menu
  $("ul.dropdown-menu").each(function(index,obj){
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
  });
});
