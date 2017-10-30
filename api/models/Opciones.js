/**
 * Opciones.js
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
  tableName: 'OPCION',
  attributes: {
          OpcionId: {
                  type: 'integer',
                  primaryKey: true
          },
          OpcionDesc: 'string',
          OpcionAbrev: 'string',
  }
};
