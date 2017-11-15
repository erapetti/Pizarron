/**
 * PizarronController
 *
 * @description :: Server-side logic for managing Pizarrons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Función auxiliar para calcular un código de hash a partir de un string
// la voy a usar para definir la clave de memcached asociada a una query
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Función que se agrega a todos los modelos para hacer find con parámetro objQuery
// buscando primero en memcached
sails.config.models.cacheFind = function (objQuery,callback) {
 var thisobj = this;
 var memkey = 'piz'+this.tableName+JSON.stringify(objQuery).hashCode();

 sails.memcached.get(memkey, function (err, memresult) {
	 if (err) {
		 return callback(err, undefined);
	 }
	 if (typeof memresult !== 'undefined' && memresult != false) {
		 // cache hit
		 return callback(undefined, memresult);
	 }
	 // cache miss
	 thisobj.find(objQuery).exec(function(err,result){
		 if (err) {
			 return callback(err, undefined);
		 }
		 if (!result) {
			 return callback(new Error("No hay resultados en la consulta de "+thisobj.tableName), undefined);
		 }
		 sails.memcached.set(memkey, result, 84600, function(err){
			 if (err) {
				 return callback(err, undefined);
			 }
			 return callback(undefined, result);
		 });
	 });
 });
};

// función que se agrega a todos los modelos para llamar a la función objFunction
// con parámetro objParm, tomando el resultado primero de memcached
sails.config.models.cacheCall = function (id,objFunction,objParam,callback) {
 var thisobj = this;
 var memkey = 'piz'+this.tableName+id+'/'+JSON.stringify(objParam).hashCode();

 sails.memcached.get(memkey, function (err, memresult) {
	 if (err) {
		 return callback(err, undefined);
	 }
	 if (typeof memresult !== 'undefined' && memresult != false) {
		 // cache hit
		 return callback(undefined, memresult);
	 }
	 // cache miss
	 objFunction(objParam,function(err,result){
		 if (err) {
			 return callback(err, undefined);
		 }
		 if (!result) {
			 return callback(new Error("No hay resultados en la consulta de "+JSON.stringify(objFunction)), undefined);
		 }
		 sails.memcached.set(memkey, result, 84600, function(err){
			 if (err) {
				 return callback(err, undefined);
			 }
			 return callback(undefined, result);
		 });
	 });
 });
};

module.exports = {

	index: function(req,res) {

		var Memcached = require('memcached');
		sails.memcached = new Memcached(sails.config.memcached);

		Departamentos.cacheFind({DeptoId:{'<':20}},function(err,departamentos){
			if (err) {
				return res.serverError(err);
			}
			Asignaturas.cacheCall("webces",Asignaturas.webces,{},function(err,asignaturas){
				if (err) {
					return res.serverError(err);
				}
				res.view({title:"Pizarrón de Elección de Horas",departamentos:departamentos,asignaturas:asignaturas});
			});
		});
	},

	stock: function(req,res) {
		var departamento = parseInt(req.param("departamento"));
		var asignatura = parseInt(req.param("asignatura"));

		Stock.libres(departamento,asignatura,function(err,stock){
      if (err) {
        return res.serverError(err);
      }
			return res.json(stock);
		});
	},

	resultado: function(req,res) {
		var departamento = parseInt(req.param("departamento"));
		var asignatura = parseInt(req.param("asignatura"));

		if (!departamento || !asignatura) {
				return res.serverError(new Error("Parámetros incorrectos"));
		}

		var Memcached = require('memcached');
		sails.memcached = new Memcached(sails.config.memcached);

		Stock.libres(departamento,asignatura,function(err,stock){
			if (err) {
				return res.serverError(err);
			}

			Departamentos.cacheFind({DeptoId:{'<':20}},function(err,departamentos){
				if (err) {
					return res.serverError(err);
				}
				Asignaturas.cacheCall("webces",Asignaturas.webces,{},function(err,asignaturas){
					if (err) {
						return res.serverError(err);
					}
					Dependencias.cacheFind({StatusId:1,or:[{DependTipId:2,DependSubTipId:1},{DependTipId:6},{DependTipId:7}]},function(err,dependencias){
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
						Planes.cacheFind({PlanActivo:1},function(err,planes){
							if (err) {
								return res.serverError(err);
							}
							Ciclos.cacheFind({},function(err,ciclos){
								if (err) {
									return res.serverError(err);
								}
								Turnos.cacheFind({},function(err,turnos){
									if (err) {
										return res.serverError(err);
									}
									Grados.cacheFind({},function(err,grados){
										if (err) {
											return res.serverError(err);
										}
										Orientaciones.cacheFind({},function(err,orientaciones){
											if (err) {
												return res.serverError(err);
											}
											Opciones.cacheFind({},function(err,opciones){
												if (err) {
													return res.serverError(err);
												}
												Materias.cacheCall("webces",Materias.webces,{},function(err,materias){
													if (err) {
														return res.serverError(err);
													}
													res.view({title:"Pizarrón de Elección de Horas",departamentos:departamentos,asignaturas:asignaturas,dependencias:dependencias,planes:planes,ciclos:ciclos,turnos:turnos,grados:grados,orientaciones:orientaciones,opciones:opciones,materias:materias,stock:stock,departamento:departamento,asignatura:asignatura});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	},

};
