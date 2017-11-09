/**
 * Materias.js
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
	tableName: 'MATERIAS',
	attributes: {
		MateriaId: {
			type: 'integer',
			primaryKey: true
		},
		MateriaNombre: 'string',
		MateriaAbrev: 'string',
	},

	webces: function(callback) {
		return this.query(`
			select AsignId MateriaId,AsignDesc MateriaNombre,AsignAbreviat MateriaAbrev
			from webces.ELCASIGNATURAS
		`, function(err,result){
			if (err) {
				return callback(err, undefined);
			}
			return callback(undefined, (result===null ? undefined : result));
		});
	},

};
