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
  libres: function(objParam,callback){
    return this.query(`
      select DependId,
             TradPlanId PlanId,
             TradCicloId CicloId,
             TurnoId,
             TradGradoId GradoId,
             TradOrientacId OrientacionId,
             TradOpcionId OpcionId,
             AsignId MateriaId,
             sum(if(elcCodMovElecId=1,PizGrp1erCiclo+PizGrp2doTeor,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizGrp1erCiclo+PizGrp2doTeor,0)) GrTeorico,
             sum(if(elcCodMovElecId=1,PizGrp2doPractico,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizGrp2doPractico,0)) GrPractico,
             sum(if(elcCodMovElecId=1,PizHrs1erCiclo+PizHrs2doTeor,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizHrs1erCiclo+PizHrs2doTeor,0)) HsTeorico,
             sum(if(elcCodMovElecId=1,PizHrs2doPractico,0)-if(elcCodMovElecId>1 and p.fnccedula>0,PizHrs2doPractico,0)) HsPractico
      from webces.ELCPIZARRON p
      join Personal.TRAD_CURSO_MAT t on p.CursoId=t.CursoId and p.AsignId=t.TradAsignIdElc and if(p.PizGrp2doPractico=0,1,2)=t.TradTipoDictado and p.PizYear=t.TradCurrYear
      where PizYear>=year(curdate())
       and GrupIntId<>90
       and PizDeptoId=?
       and (GrupIntId=? or (? in (9,19) and (GrupIntId=91 or GrupIntId in (9,19) and p.fnccedula>0)))
      group by 1,2,3,4,5,6,7,8
      having GrTeorico+GrPractico>0
    `,
    [objParam.DeptoId,objParam.AsignId,objParam.AsignId],
    callback);
  },
};
