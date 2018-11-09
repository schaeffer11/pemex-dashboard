import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)

export const create = function(req, res, next){
    let {
        activo,
        asignacion,
        fechaRevision,
        disenaYConstruye,
        disenaYConstruyeObs,
        analisisNodal,
        analisisNodalObs,
        ajusteDiario,
        ajusteDiarioObs,
        frequenciaAforo,
        frequenciaAforoObs,
        cuentaPVT,
        cuentaPVTObs,
        cuentaEstadosMecanico,
        cuentaEstadosMecanicoObs,
        softwareModelPozoObs,
        caracterizacionFluidos,
        caracterizacionFluidosObs,
        frequenciaFluidosObs,
        caracterizacionPEMEX,
        caracterizacionPEMEXObs,
        viscosidadAceite,
        viscosidadAceiteObs,
        indiceColoidal,
        indiceColoidalObs,
        densidadEmulsion,
        densidadEmulsionObs,
        estabilidadElectrica,
        estabilidadElectricaObs,
        analisisStriffDavis,
        analisisStriffDavisObs,
        problemasDepositosOrganicos,
        problemasDepositosOrganicosObs,
        problemasInorganicas,
        problemasInorganicasObs,
        problemasMovilidad,
        problemasMovilidadObs,
        identificadoProblemas,
        identificadoProblemasObs,
        procedimientoRemocion,
        procedimientoRemocionObs,
        calibraciones,
        limpiezaAparejo,
        estimulacionMatricial,
        fracturamientoAcidos,
        fracturamientoApuntalados,
        refracturas,
        procesosInhibicion,
        mejoradoresFlujo,
        controlAgua,
        controlGas,
        controlArena,
        realizaDisenoEstimulacion,
        realizaDisenoEstimulacionObs,
        softwareEstimulacionObs,
        efectuaEvaluacion,
        efectuaEvaluacionObs,
        supervisaPruebas,
        supervisaPruebasObs,
        supervisorObs,
        validaPropuestasObs,
        baseDisenos,
        baseDisenosObs,
        cuentaMatriz,
        cuentaMatrizObs,
        criterioOptimaTratamiento,
        evaluacionPostratamiento,
        evaluacionPostratamientoObs,
        promedioEfectividad,
        costoPromedioEstimulacion,
        gastoMinimoEstimulacion,
        gastoPromedioEstimulacion,
        disenaControlAgua,
        disenaControlAguaObs,
        disenaControlArena,
        disenaControlArenaObs,
        monitoreoPozo,
        monitoreoPozoObs,
        frequenciaMonitoreo,
        operacionMayorFrequencia,
        baseUsuario,
        programaTomaInformacion,
        programaTomaInformacionObs,
        sensoresPresionFondo,
        sensoresPresionFondoObs,
        numeroOperacionesMes,
        registrosFondoCerrado,
        registrosFondoFluyente,
        registrosProduccion,
        aforos,
        personalTomaInformacion,
        personalTomaInformacionObs
    } = req.body

    connection.query(`INSERT INTO Diagnosticos (ID, ACTIVO_ID, ASIGNACION, FECHA_REVISION, DISENA_Y_CONSTRUYE, DISENA_Y_CONSTRUYE_OBS, ANALYSIS_NODAL, ANALYSIS_NODAL_OBS, AJUSTE_DIARIO, AJUSTE_DIARIO_OBS,FREQUENCIA_AFORO, FREQUENCIA_AFORO_OBS, CUENTA_PVT, CUENTA_PVT_OBS, CUENTA_ESTADOS_MECANICO, CUENTA_ESTADOS_MECANICO_OBS, SOFTWARE_MODEL_POZO_OBS, CARACTERIZACION_FLUIDOS,CARACTERIZACION_FLUIDOS_OBS,FREQUENCIA_FLUIDOS_OBS,CARACTERIZACION_PEMEX,CARACTERIZACION_PEMEX_OBS,VISCOSIDAD_ACEITE,VISCOSIDAD_ACEITE_OBS,INDICE_COLOIDAL,INDICE_COLOIDAL_OBS,DENSIDAD_EMULSION,DENSIDAD_EMULSION_OBS,ESTABILIDAD_ELECTRICA,ESTABILIDAD_ELECTRICA_OBS,ANALISIS_STRIFFDAVIS,ANALISIS_STRIFFDAVIS_OBS,PROBLEMAS_DEPOSITOS_ORGANICOS,PROBLEMAS_DEPOSITOS_ORGANICOS_OBS,PROBLEMAS_INORGANICAS,PROBLEMAS_INORGANICAS_OBS,PROBLEMAS_MOVILIDAD,PROBLEMAS_MOVILIDAD_OBS,IDENTIFICADO_PROBLEMAS,IDENTIFICADO_PROBLEMAS_OBS,PROCEDIMIENTO_REMOCION,PROCEDIMIENTO_REMOCION_OBS,CALIBRACIONES,LIMPIEZA_APAREJO,ESTIMULACION_MATRICIAL,FRACTURAMIENTO_ACIDOS,FRACTURAMIENTO_APUNTALADOS,REFRACTURAS,PROCESOS_INHIBICION,MEJORADORES_FLUJO,CONTROL_AGUA,CONTROL_GAS,CONTROL_ARENA,REALIZA_DISENO_ESTIMULACION,REALIZA_DISENO_ESTIMULACION_OBS,SOFTWARE_ESTIMULACION_OBS,EFECTUA_EVALUACION,EFECTUA_EVALUACION_OBS,SUPERVISA_PRUEBAS,SUPERVISA_PRUEBAS_OBS,SUPERVISOR_OBS,VALIDA_PROPUESTAS_OBS,BASE_DISENOS,BASE_DISENOS_OBS,CUENTA_MATRIZ,CUENTA_MATRIZ_OBS,CRITERIO_OPTIMA_TRATAMIENTO,EVALUACION_POSTRATAMIENTO,EVALUACION_POSTRATAMIENTO_OBS,PROMEDIO_EFECTIVIDAD,COSTO_PROMEDIO_ESTIMULACION,GASTO_MINIMO_ESTIMULACION,GASTO_PROMEDIO_ESTIMULACION,DISENA_CONTROL_AGUA,DISENA_CONTROL_AGUA_OBS,DISENA_CONTROL_ARENA,DISENA_CONTROL_ARENA_OBS,MONITOREO_POZO,MONITOREO_POZO_OBS,FREQUENCIA_MONITOREO,OPERACION_MAYOR_FREQUENCIA,BASE_USUARIO,PROGRAMA_TOMA_INFORMACION,PROGRAMA_TOMA_INFORMACION_OBS,SENSORES_PRESION_FONDO,SENSORES_PRESION_FONDO_OBS,NUMERO_OPERACIONES_MES, REGISTROS_FONDO_CERRADO,REGISTROS_FONDO_FLUYENTE,REGISTROS_PRODUCCION,AFOROS,PERSONAL_TOMA_INFORMACION,PERSONAL_TOMA_INFORMACION_OBS) VALUES (null, ?, ?, ?, b?, ?, b?, ?, b?,?,b?,?,b?,?,b?,?,?,b?,?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,b?,?,?,?,?,?,?,?,?,?,?,?,?,b?,?,?,b?,?,b?,?,?,?,b?,?,b?,?,?,b?,?,?,?,?,?,b?,?,b?,?,b?,?,?,?,?,b?,?,b?,?,?,?,?,?,?,b?,?)`,
        [ activo,
            asignacion,
            fechaRevision,
            disenaYConstruye,
            disenaYConstruyeObs,
            analisisNodal,
            analisisNodalObs,
            ajusteDiario,
            ajusteDiarioObs,
            frequenciaAforo,
            frequenciaAforoObs,
            cuentaPVT,
            cuentaPVTObs,
            cuentaEstadosMecanico,
            cuentaEstadosMecanicoObs,
            softwareModelPozoObs,
            caracterizacionFluidos,
            caracterizacionFluidosObs,
            frequenciaFluidosObs,
            caracterizacionPEMEX,
            caracterizacionPEMEXObs,
            viscosidadAceite,
            viscosidadAceiteObs,
            indiceColoidal,
            indiceColoidalObs,
            densidadEmulsion,
            densidadEmulsionObs,
            estabilidadElectrica,
            estabilidadElectricaObs,
            analisisStriffDavis,
            analisisStriffDavisObs,
            problemasDepositosOrganicos,
            problemasDepositosOrganicosObs,
            problemasInorganicas,
            problemasInorganicasObs,
            problemasMovilidad,
            problemasMovilidadObs,
            identificadoProblemas,
            identificadoProblemasObs,
            procedimientoRemocion,
            procedimientoRemocionObs,
            calibraciones,
            limpiezaAparejo,
            estimulacionMatricial,
            fracturamientoAcidos,
            fracturamientoApuntalados,
            refracturas,
            procesosInhibicion,
            mejoradoresFlujo,
            controlAgua,
            controlGas,
            controlArena,
            realizaDisenoEstimulacion,
            realizaDisenoEstimulacionObs,
            softwareEstimulacionObs,
            efectuaEvaluacion,
            efectuaEvaluacionObs,
            supervisaPruebas,
            supervisaPruebasObs,
            supervisorObs,
            validaPropuestasObs,
            baseDisenos,
            baseDisenosObs,
            cuentaMatriz,
            cuentaMatrizObs,
            criterioOptimaTratamiento,
            evaluacionPostratamiento,
            evaluacionPostratamientoObs,
            promedioEfectividad,
            costoPromedioEstimulacion,
            gastoMinimoEstimulacion,
            gastoPromedioEstimulacion,
            disenaControlAgua,
            disenaControlAguaObs,
            disenaControlArena,
            disenaControlArenaObs,
            monitoreoPozo,
            monitoreoPozoObs,
            frequenciaMonitoreo,
            operacionMayorFrequencia,
            baseUsuario,
            programaTomaInformacion,
            programaTomaInformacionObs,
            sensoresPresionFondo,
            sensoresPresionFondoObs,
            numeroOperacionesMes,
            registrosFondoCerrado,
            registrosFondoFluyente,
            registrosProduccion,
            aforos,
            personalTomaInformacion,
            personalTomaInformacionObs
        ], (err, results) => {
            console.log('diagnosticos err', err)
            console.log('diagnosticos', results)
            if (err) {
                res.json({ success: false})
            }
            else {
                res.json({ success: true})
            }
        })
}

export const get = function(req, res) {
    let id = req.params.id

    connection.query(`SELECT 
      ID, 
      ACTIVO_ID as activo, 
      ASIGNACION as asignacion, 
      FECHA_REVISION as fechaRevision, 
      DISENA_Y_CONSTRUYE as disenaYConstruye, 
      DISENA_Y_CONSTRUYE_OBS as disenaYConstruyeObs, 
      ANALYSIS_NODAL as analisisNodal, 
      ANALYSIS_NODAL_OBS analisisNodalObs, 
      AJUSTE_DIARIO as ajusteDiario, 
      AJUSTE_DIARIO_OBS ajusteDiarioObs,
      FREQUENCIA_AFORO as frequenciaAforo, 
      FREQUENCIA_AFORO_OBS as frequenciaAforoObs, 
      CUENTA_PVT as cuentaPVT, 
      CUENTA_PVT_OBS as cuentaPVTObs, 
      CUENTA_ESTADOS_MECANICO as cuentaEstadosMecanico, 
      CUENTA_ESTADOS_MECANICO_OBS as cuentaEstadosMecanicoObs, 
      SOFTWARE_MODEL_POZO_OBS as softwareModelPozoObs, 
      CARACTERIZACION_FLUIDOS as caracterizacionFluidos,
      CARACTERIZACION_FLUIDOS_OBS as caracterizacionFluidosObs,
      FREQUENCIA_FLUIDOS_OBS as frequenciaFluidosObs,
      CARACTERIZACION_PEMEX as caracterizacionPEMEX,
      CARACTERIZACION_PEMEX_OBS as caracterizacionPEMEXObs,
      VISCOSIDAD_ACEITE as viscosidadAceite,
      VISCOSIDAD_ACEITE_OBS as viscosidadAceiteObs,
      INDICE_COLOIDAL as indiceColoidal,
      INDICE_COLOIDAL_OBS as indiceColoidalObs,
      DENSIDAD_EMULSION as densidadEmulsion,
      DENSIDAD_EMULSION_OBS as densidadEmulsionObs,
      ESTABILIDAD_ELECTRICA as estabilidadElectrica,
      ESTABILIDAD_ELECTRICA_OBS as estabilidadElectricaObs,
      ANALISIS_STRIFFDAVIS as analisisStriffDavis,
      ANALISIS_STRIFFDAVIS_OBS as analisisStriffDavisObs,
      PROBLEMAS_DEPOSITOS_ORGANICOS as problemasDepositosOrganicos,
      PROBLEMAS_DEPOSITOS_ORGANICOS_OBS as problemasDepositosOrganicosObs,
      PROBLEMAS_INORGANICAS as problemasInorganicas,
      PROBLEMAS_INORGANICAS_OBS as problemasInorganicasObs,
      PROBLEMAS_MOVILIDAD as problemasMovilidad,
      PROBLEMAS_MOVILIDAD_OBS as problemasMovilidadObs,
      IDENTIFICADO_PROBLEMAS as identificadoProblemas,
      IDENTIFICADO_PROBLEMAS_OBS as identificadoProblemasObs,
      PROCEDIMIENTO_REMOCION as procedimientoRemocion,
      PROCEDIMIENTO_REMOCION_OBS as procedimientoRemocionObs,
      CALIBRACIONES as calibraciones,
      LIMPIEZA_APAREJO as limpiezaAparejo,
      ESTIMULACION_MATRICIAL as estimulacionMatricial,
      FRACTURAMIENTO_ACIDOS as fracturamientoAcidos,
      FRACTURAMIENTO_APUNTALADOS as fracturamientoApuntalados,
      REFRACTURAS as refracturas,
      PROCESOS_INHIBICION as procesosInhibicion,
      MEJORADORES_FLUJO as mejoradoresFlujo,
      CONTROL_AGUA as controlAgua,
      CONTROL_GAS as controlGas,
      CONTROL_ARENA as controlArena,
      REALIZA_DISENO_ESTIMULACION as realizaDisenoEstimulacion,
      REALIZA_DISENO_ESTIMULACION_OBS as realizaDisenoEstimulacionObs,
      SOFTWARE_ESTIMULACION_OBS as softwareEstimulacionObs,
      EFECTUA_EVALUACION as efectuaEvaluacion,
      EFECTUA_EVALUACION_OBS as efectuaEvaluacionObs,
      SUPERVISA_PRUEBAS as supervisaPruebas,
      SUPERVISA_PRUEBAS_OBS as supervisaPruebasObs,
      SUPERVISOR_OBS as supervisorObs,
      VALIDA_PROPUESTAS_OBS as validaPropuestasObs,
      BASE_DISENOS as baseDisenos,
      BASE_DISENOS_OBS as baseDisenosObs,
      CUENTA_MATRIZ as cuentaMatriz,
      CUENTA_MATRIZ_OBS as cuentaMatrizObs,
      CRITERIO_OPTIMA_TRATAMIENTO as criterioOptimaTratamiento,
      EVALUACION_POSTRATAMIENTO as evaluacionPostratamiento,
      EVALUACION_POSTRATAMIENTO_OBS as evaluacionPostratamientoObs,
      PROMEDIO_EFECTIVIDAD as promedioEfectividad,
      COSTO_PROMEDIO_ESTIMULACION as costoPromedioEstimulacion,
      GASTO_MINIMO_ESTIMULACION as gastoMinimoEstimulacion,
      GASTO_PROMEDIO_ESTIMULACION as gastoPromedioEstimulacion,
      DISENA_CONTROL_AGUA as disenaControlAgua,
      DISENA_CONTROL_AGUA_OBS as disenaControlAguaObs,
      DISENA_CONTROL_ARENA as disenaControlArena,
      DISENA_CONTROL_ARENA_OBS as disenaControlArenaObs,
      MONITOREO_POZO as monitoreoPozo,
      MONITOREO_POZO_OBS as monitoreoPozoObs,
      FREQUENCIA_MONITOREO as frequenciaMonitoreo,
      OPERACION_MAYOR_FREQUENCIA as operacionMayorFrequencia,
      BASE_USUARIO as baseUsuario,
      PROGRAMA_TOMA_INFORMACION as programaTomaInformacion,
      PROGRAMA_TOMA_INFORMACION_OBS as programaTomaInformacionObs,
      SENSORES_PRESION_FONDO as sensoresPresionFondo,
      SENSORES_PRESION_FONDO_OBS as sensoresPresionFondoObs,
      NUMERO_OPERACIONES_MES as numeroOperacionesMes, 
      REGISTROS_FONDO_CERRADO as registrosFondoCerrado,
      REGISTROS_FONDO_FLUYENTE as registrosFondoFluyente,
      REGISTROS_PRODUCCION as registrosProduccion,
      AFOROS as aforos,
      PERSONAL_TOMA_INFORMACION as personalTomaInformacion,
      PERSONAL_TOMA_INFORMACION_OBS as personalTomaInformacionObs
    FROM Diagnosticos 
    WHERE ID = ? `, [id] , (err, results) => {
        res.json(results)
    })
}

export const getAll = function(req, res) {
    connection.query(`SELECT 
        ID, 
        ACTIVO_ID as activo, 
        ASIGNACION as asignacion, 
        FECHA_REVISION as fechaRevision
      FROM Diagnosticos `, (err, results) => {
        res.json(results)
    })
}
