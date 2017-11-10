/**
 * Asignaturas.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'Estudiantil',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	migrate: 'safe',
	tableName: 'ASIGNATURAS',
	attributes: {
		AsignId: {
			type: 'integer',
			primaryKey: true
		},
		AsignDesc: 'string',
		TipoEscalafon: 'string',
	},

	webces: function(objParam,callback) {
		return this.query(`
			select GrupintId AsignId,GrupintDesc AsignDesc, 'H' TipoEscalafon
			from webces.ELCGRUPOSINTERES join webces.ELCPIZARRON using (GrupintId)
			where fnccedula=0 and GrupintDHF<>'S' and GrupintFlotante<>'F'
			group by 1,2
			order by GrupintDesc
		`, function(err,result){
			if (err) {
				return callback(err, undefined);
			}
			return callback(undefined, (result===null ? undefined : result));
		});
	},

};
