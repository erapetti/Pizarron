/**
 * PizarronController
 *
 * @description :: Server-side logic for managing Pizarrons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req,res) {
		var stock = Array();
		stock[0] = { DependId:1001, PlanId:27, CicloId:2, GradoId:5, OrientacionId:0, OpcionId:36, MateriaNombre:'MATEMÁTICA I', Grupos:'3'};
		stock[1] = { DependId:1001, PlanId:27, CicloId:2, GradoId:5, OrientacionId:0, OpcionId:36, MateriaNombre:'MATEMÁTICA III', Grupos:'2'};

		Dependencias.find({StatusId:1}).exec(function(err,dependencias){
			if (err) {
				return res.serverError(err);
			}
			Planes.find({PlanActivo:1}).exec(function(err,planes){
				if (err) {
					return res.serverError(err);
				}
				Ciclos.find().exec(function(err,ciclos){
					if (err) {
						return res.serverError(err);
					}
					Grados.find().exec(function(err,grados){
						if (err) {
							return res.serverError(err);
						}
						res.view({title:"Pizarrón de Elección de Horas",dependencias:dependencias,planes:planes,ciclos:ciclos,grados:grados,stock:stock});
					});
				});
			});
		});
	}
};
