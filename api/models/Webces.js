/**
 * Webces.js
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
  attributes: {
    DependId: 'integer',
  },
  libres: function(DeptoId,AsignId,callback){
    return this.query(`
      select DependId,
             TradPlanId PlanId,
             TradCicloId CicloId,
             TradGradoId GradoId,
             TradOrientacId OrientacionId,
             TradOpcionId OpcionId,
             TradMateriaId MateriaId,
             sum(if(elcCodMovElecId=1,PizGrp1erCiclo+PizGrp2doTeor,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizGrp1erCiclo+PizGrp2doTeor,0)) Teorico,
             sum(if(elcCodMovElecId=1,PizGrp2doPractico,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizGrp2doPractico,0)) Practico
      from webces.ELCPIZARRON p
      join Personal.TRAD_CURSO_MAT t on p.CursoId=t.CursoId and p.AsignId=t.TradAsignIdElc and if(p.PizGrp2doPractico=0,1,2)=t.TradTipoDictado and p.PizYear=t.TradCurrYear
      where PizYear=year(curdate())+if(month(curdate())>11,1,0)
       and GrupIntId<>90
       and PizDeptoId=?
       and GrupIntId=?
      group by 1,2,3,4,5,6,7
      having Teorico+Practico>0
    `,
    [DeptoId,AsignId],
    callback);
  },
};
