/**
 * PizarronController
 *
 * @description :: Server-side logic for managing Pizarrons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req,res) {

		Departamentos.find({DeptoId:{'<':20}}).exec(function(err,departamentos){
			if (err) {
				return res.serverError(err);
			}
			Asignaturas.webces(function(err,asignaturas){
				if (err) {
					return res.serverError(err);
				}
				res.view({title:"Pizarrón de Elección de Horas",departamentos:departamentos,asignaturas:asignaturas});
			});
		});
	},

	_stock: function(departamento,asignatura,callback) {
		var stock = Array();
		stock[0] = { DependId:1001, PlanId:27, CicloId:2, GradoId:5, OrientacionId:0, OpcionId:36, MateriaNombre:'MATEMÁTICA I', Grupos:'3'};
		stock[1] = { DependId:1001, PlanId:27, CicloId:2, GradoId:5, OrientacionId:0, OpcionId:36, MateriaNombre:'MATEMÁTICA III', Grupos:'2'};
		stock[2] = { DependId:1001, PlanId:14, CicloId:1, GradoId:4, OrientacionId:0, OpcionId:0, MateriaNombre:'MATEMÁTICA', Grupos:'1'};
		var err = undefined;

		return callback(err, stock);
	},

	stock: function(req,res) {
		var departamento = parseInt(req.param("departamento"));
		var asignatura = parseInt(req.param("asignatura"));

		Webces.libres(departamento,asignatura,function(err,stock){

			return res.json(err,stock);
		});
	},

	resultado: function(req,res) {
		var departamento = parseInt(req.param("departamento"));
		var asignatura = parseInt(req.param("asignatura"));

		if (!departamento || !asignatura) {
				return res.serverError(new Error("Parámetros incorrectos"));
		}

		Webces.libres(departamento,asignatura,function(err,stock){
			if (err) {
				return res.serverError(err);
			}

			Departamentos.find({DeptoId:{'<':20}}).exec(function(err,departamentos){
				if (err) {
					return res.serverError(err);
				}
				Asignaturas.webces(function(err,asignaturas){
					if (err) {
						return res.serverError(err);
					}
					Dependencias.find({StatusId:1,or:[{DependTipId:2,DependSubTipId:1},{DependTipId:6},{DependTipId:7}]}).exec(function(err,dependencias){
						if (err) {
							return res.serverError(err);
						}
						// tengo problemas con las comillas dobles al pasarlas por JSON.parse
						dependencias.forEach(function(d){
							if (d.DependDesc) {
								d.DependDesc = d.DependDesc.replace(/"/g, "");
							}
							if (d.DependNom) {
								d.DependNom = d.DependNom.replace(/"/g, "");
							}
						});
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
									res.view({title:"Pizarrón de Elección de Horas",departamentos:departamentos,asignaturas:asignaturas,dependencias:dependencias,planes:planes,ciclos:ciclos,grados:grados,stock:stock,departamento:departamento,asignatura:asignatura});
								});
							});
						});
					});
				});
			});
		});
	},

};
