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
}

$(document).ready(actualizaStock);
