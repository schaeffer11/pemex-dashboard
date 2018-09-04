export function validatePozo(
      subdireccion,
      bloque,
      activo,
      campo,
      pozo,
      formacion,
      intervaloProductor,
      espesorBruto,
      espesorNeto,
      caliza,
      dolomia,
      arcilla,
      porosidad,
      permeabilidad,
      sw,
      caa,
      cga,
      tipoDePozo,
      pwsFecha,
      pwfFecha,
      deltaPPerMes,
      tyac,
      pvt,
      aparejoDeProduccion,
      profEmpacador,
      profSensorPYT,
      tipoDeSap,
      moduloYoungArena,
      moduloYoungLutitas,
      relacPoissonArena,
      relacPoissonLutatas,
      gradienteDeFractura,
      densidadDeDisparos,
      diametroDeDisparo,
      descubrimientoField,
      fechaDeExplotacionField,
      numeroDePozosOperandoField,
      pInicialAnoField,
      pActualFechaField,
      dpPerAnoField,
      tyacField,
      prField,
      densidadDelAceiteField,
      pSatField,
      rgaFluidoField,
      salinidadField,
      pvtRepresentativoField,
      litologiaField,
      espesorNetoField,
      porosidadField,
      swField,
      kPromedioField,
      caaField,
      cgaField,
      qoField,
      qgField,
      rgaField,
      fwField,
      npField,
      gpField,
      wpField,
      rraField,
      rrgField,
      rrpceField,
      h2sField,
      co2Field,
      n2Field
 ){
  let errors = [];
  if(!subdireccion.length) {
    errors.push({field:'subdireccion', message:'Subdireccion is a required field'})
  }

  return errors;
  
}
