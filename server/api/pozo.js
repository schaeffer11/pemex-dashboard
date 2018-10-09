import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';



const INSERT_FIELDS_QUERY = {
    save: `INSERT INTO _FieldsDataSave (
      FIELD_FORMACION_ID, SUBDIRECCION, ACTIVO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL, P_INICIAL_ANO, P_ACTUAL, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, TIPO_DE_FLUIDO, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      QO, QG, RGA, FW, NP, GP, WP, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2, TRANSACTION_ID, HAS_ERRORS) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO FieldsData (
      FIELD_FORMACION_ID, SUBDIRECCION, ACTIVO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL, P_INICIAL_ANO, P_ACTUAL, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, TIPO_DE_FLUIDO, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      QO, QG, RGA, FW, NP, GP, WP, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2, TRANSACTION_ID) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    loadSave: `SELECT * FROM _FieldsDataSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM FieldsData WHERE TRANSACTION_ID = ?`
}

const INSERT_HIST_INTERVENCIONES_NEW_QUERY = {
    save: `INSERT INTO _WellHistorialIntervencionesSave (
    ) VALUES ?`,
    submit: `INSERT INTO WellHistorialIntervenciones (
    ) VALUES ?`,
    loadSaveEstimulacion: `SELECT * FROM _WellHistorialIntervencionesSave WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'estimulacion'`,
    loadSaveAcido: `SELECT * FROM _WellHistorialIntervencionesSave WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'acido'`,
    loadSaveApuntalado: `SELECT * FROM _WellHistorialIntervencionesSave WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'apuntalado'`,
    loadTransactionEstimulacion: `SELECT * FROM WellHistorialIntervenciones WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'estimulacion'`,
    loadTransactionAcido: `SELECT * FROM WellHistorialIntervenciones WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'acido'`,
    loadTransactionApuntalado: `SELECT * FROM WellHistorialIntervenciones WHERE TRANSACTION_ID = ? AND TIPO_DE_INTERVENCIONES = 'apuntalado'`,
}

const INSERT_WELL_QUERY = {
    save: `INSERT INTO _WellsDataSave (
        WELL_FORMACION_ID, SUBDIRECCION, ACTIVO,
        FORMACION,
        CALIZA, DOLOMIA, ARCILLA, POROSIDAD,
        PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO,
        PWS, PWS_FECHA, PWF, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT,
        APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SISTEMA, TRANSACTION_ID, HAS_ERRORS) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO WellsData (
        WELL_FORMACION_ID, SUBDIRECCION, ACTIVO,
        FORMACION,
        CALIZA, DOLOMIA, ARCILLA, POROSIDAD,
        PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO,
        PWS, PWS_FECHA, PWF, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT,
        APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SISTEMA, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?)`,
    loadSave: `SELECT * FROM _WellsDataSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellsData WHERE TRANSACTION_ID = ?`    
}

const INSERT_HIST_INTERVENCIONES_QUERY = {
    save: `INSERT INTO _WellUserInputInterventionsSave (
        WELL_FORMACION_ID, INPUT_INTERVENTION_ID, DATE, DESCRIPTION, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellUserInputInterventions (
        WELL_FORMACION_ID, INPUT_INTERVENTION_ID, DATE, DESCRIPTION, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellUserInputInterventionsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellUserInputInterventions WHERE TRANSACTION_ID = ?`    
}

const INSERT_LAYER_QUERY = {
    save: `INSERT INTO _WellLayersSave (
        INTERVAL_ID, WELL_FORMACION_ID, INTERVALO, CIMA_MD, BASE_MD, ESPESOR_BRUTO, ESPESOR_NETO,
        V_ARC, POROSITY, SW, DENS, RESIS, PERMEABILIDAD, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellLayers (
        INTERVAL_ID, WELL_FORMACION_ID, INTERVALO, CIMA_MD, BASE_MD, ESPESOR_BRUTO, ESPESOR_NETO,
        V_ARC, POROSITY, SW, DENS, RESIS, PERMEABILIDAD, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellLayersSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellLayers WHERE TRANSACTION_ID = ?`    
}

const INSERT_MUD_LOSS_QUERY = {
    save: `INSERT INTO _WellZonesSave (
        ZONE_ID, WELL_FORMACION_ID, CIMA_MD, BASE_MD, LODO_PERDIDO, DENSIDAD, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellZones (
        ZONE_ID, WELL_FORMACION_ID, CIMA_MD, BASE_MD, LODO_PERDIDO, DENSIDAD, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellZonesSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellZones WHERE TRANSACTION_ID = ?`    
}

const INSERT_MECANICO_QUERY = {
    save: `INSERT INTO _WellMecanicoSave (
        WELL_FORMACION_ID, TIPO_DE_TERMINACION, H_INTERVALO_PRODUCTOR, EMPACADOR,
        PRESION_DIF_EMPACADOR, SENSOR_PYT, TIP_DE_LINER, DIAMETRO_DE_LINER, TIPO_DE_PISTOLAS,
        DENSIDAD_DE_DISPAROS_MECANICO_DUPL, FASE, DIAMETRO_DE_ORIFICIO, PENETRACION,
        TRATAMIENTO_POR, VOLUMEN_APAREJO_DE_PRODUCCION, VOLUMEN_INTERVALO_CIMA, 
        VOLUMEN_INTERVALO_BASE, VOLUMEN_DE_ESPACIO_ANULA, TRANSACTION_ID, HAS_ERRORS) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO WellMecanico (
        WELL_FORMACION_ID, TIPO_DE_TERMINACION, H_INTERVALO_PRODUCTOR, EMPACADOR,
        PRESION_DIF_EMPACADOR, SENSOR_PYT, TIP_DE_LINER, DIAMETRO_DE_LINER, TIPO_DE_PISTOLAS,
        DENSIDAD_DE_DISPAROS_MECANICO_DUPL, FASE, DIAMETRO_DE_ORIFICIO, PENETRACION,
        TRATAMIENTO_POR, VOLUMEN_APAREJO_DE_PRODUCCION, VOLUMEN_INTERVALO_CIMA, 
        VOLUMEN_INTERVALO_BASE, VOLUMEN_DE_ESPACIO_ANULA, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?)`,     
    loadSave: `SELECT * FROM _WellMecanicoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellMecanico WHERE TRANSACTION_ID = ?`    
}

const INSERT_ANALISIS_AGUA_QUERY = {
    save: `INSERT INTO _WellAnalisisDelAguaSave (
        WELL_FORMACION_ID, PH, TEMPERATURA_DE_CONDUCTIVIDAD, RESISTIVIDAD, SALINIDAD_CON_CONDUCTIMETRO, SOLIDOS_DISUELTOS_TOTALES,
        DUREZA_TOTAL_COMO_CaCO3, DUREZA_DE_CALCIO_COMO_CaCO3, DUREZA_DE_MAGNESIO_COMO_CaCO3, ALCALINIDAD_TOTAL_COMO_CaCO3, 
        ALCALINIDAD_A_LA_FENOLFTALEINA_COMO_CaCO3,
        SALINIDAD_COMO_NaCL, SODIO, CALCIO, MAGNESIO, FIERRO,
        CLORUROS, BICARBONATOS, SULFATOS, CARBONATOS, DENSIDAD_15,
        DENSIDAD_20, TRANSACTION_ID, HAS_ERRORS, WATER_ANALYSIS_BOOL) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO WellAnalisisDelAgua (
        WELL_FORMACION_ID, PH, TEMPERATURA_DE_CONDUCTIVIDAD, RESISTIVIDAD, SALINIDAD_CON_CONDUCTIMETRO, SOLIDOS_DISUELTOS_TOTALES,
        DUREZA_TOTAL_COMO_CaCO3, DUREZA_DE_CALCIO_COMO_CaCO3, DUREZA_DE_MAGNESIO_COMO_CaCO3, ALCALINIDAD_TOTAL_COMO_CaCO3, 
        ALCALINIDAD_A_LA_FENOLFTALEINA_COMO_CaCO3,
        SALINIDAD_COMO_NaCL, SODIO, CALCIO, MAGNESIO, FIERRO,
        CLORUROS, BICARBONATOS, SULFATOS, CARBONATOS, DENSIDAD_15,
        DENSIDAD_20, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`,     
    loadSave: `SELECT * FROM _WellAnalisisDelAguaSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellAnalisisDelAgua WHERE TRANSACTION_ID = ?`    
}

const INSERT_EMBOLO_VIAJERO_QUERY = {
    save: `INSERT INTO _ProductionSystemsEmboloViajeroSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsEmboloViajero (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ,?, ?,?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsEmboloViajeroSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsEmboloViajero WHERE TRANSACTION_ID = ?`    
}

const INSERT_BOMBEO_NEUMATICO_QUERY = {
    save: `INSERT INTO _ProductionSystemsBombeoNeumaticoSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                ORIFICIO, VOLUMEN_DE_GAS_INYECTADO, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsBombeoNeumatico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                ORIFICIO, VOLUMEN_DE_GAS_INYECTADO, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ,?, ?,?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsBombeoNeumaticoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsBombeoNeumatico WHERE TRANSACTION_ID = ?`    
}

const INSERT_BOMBEO_HIDRAULICO_QUERY = {
    save: `INSERT INTO _ProductionSystemsBombeoHidraulicoSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsBombeoHidraulico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ,?, ?,?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsBombeoHidraulicoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsBombeoHidraulico WHERE TRANSACTION_ID = ?`    
}

const INSERT_BOMBEO_CAVIDADES_QUERY = {
    save: `INSERT INTO _ProductionSystemsBombeoCavidadesProgresivasSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsBombeoCavidadesProgresivas (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ,?, ?,?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsBombeoCavidadesProgresivasSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsBombeoCavidadesProgresivas WHERE TRANSACTION_ID = ?`    
}

const INSERT_BOMBEO_ELECTROCENTRIFUGO_QUERY = {
    save: `INSERT INTO _ProductionSystemsBombeoElectrocentrifugoSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsBombeoElectrocentrifugo (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ,?, ?,?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsBombeoElectrocentrifugoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsBombeoElectrocentrifugo WHERE TRANSACTION_ID = ?`    
}

const INSERT_BOMBEO_MECANICO_QUERY = {
    save: `INSERT INTO _ProductionSystemsBombeoMecanicoSave (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO, TRANSACTION_ID) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO ProductionSystemsBombeoMecanico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO, TRANSACTION_ID) VALUES
                (1, 1, ,1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    loadSave: `SELECT * FROM _WellProductionSystemsBombeoMecanicoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellProductionSystemsBombeoMecanico WHERE TRANSACTION_ID = ?`


}

const INSERT_FIELD_PRESSURE_QUERY = {
    save: `INSERT INTO _FieldHistoricalPressureSave (
        FIELD_FORMACION_ID, FECHA, PWS, PRESSURE_DEPTH, TRANSACTION_ID, HAS_ERRORS) VALUES
        ?`,
    submit: `INSERT INTO FieldHistoricalPressure (
        FIELD_FORMACION_ID, FECHA, PWS, PRESSURE_DEPTH, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _FieldHistoricalPressureSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM FieldHistoricalPressure WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_PRESSURE_QUERY = {
    save: `INSERT INTO _WellHistoricalPressureSave (
        WELL_FORMACION_ID, FECHA, PWS, PWF, PRESSURE_DEPTH, TRANSACTION_ID, HAS_ERRORS) VALUES
        ?`,
    submit: `INSERT INTO WellHistoricalPressure (
        WELL_FORMACION_ID, FECHA, PWS, PWF, PRESSURE_DEPTH, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellHistoricalPressureSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellHistoricalPressure WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_AFOROS_QUERY = {
    save: `INSERT INTO _WellAforosSave (
        WELL_FORMACION_ID, FECHA, TIEMPO, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH, TRANSACTION_ID) VALUES 
        ?`,
    submit: `INSERT INTO WellAforos (
        WELL_FORMACION_ID, FECHA, TIEMPO, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH, TRANSACTION_ID) VALUES 
        ?`,     
    loadSave: `SELECT * FROM _WellAforosSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellAforos WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_PRODUCCION_QUERY = {
    save: `INSERT INTO _WellHistoricalProduccionSave (
        WELL_FORMACION_ID, Fecha, Dias, QO, QW, QG, QGI, QO_VOLUME, QW_VOLUME, QG_VOLUME, QGI_VOLUME, NP, WP, GP, GI, RGA, FW_FRACTION, TRANSACTION_ID)
        VALUES 
        ?`,
    submit: `INSERT INTO WellHistoricalProduccion (
        WELL_FORMACION_ID, Fecha, Dias, QO, QW, QG, QGI, QO_VOLUME, QW_VOLUME, QG_VOLUME, QGI_VOLUME, NP, WP, GP, GI, RGA, FW_FRACTION, TRANSACTION_ID)
        VALUES 
        ?`,
    loadSave: `SELECT * FROM _WellHistoricalProduccionSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellHistoricalProduccion WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_IMAGE_QUERY = {
    save: `INSERT INTO _WellImagesSave (
        WELL_FORMACION_ID, IMAGE_NAME, IMG_URL, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellImages (
        WELL_FORMACION_ID, IMAGE_NAME, IMG_URL, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellImagesSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellImages WHERE TRANSACTION_ID = ?`
}

const INSERT_INTERVENTION_BASE_QUERY = {
    save: `INSERT INTO _IntervencionesSave (
      INTERVENCIONES_ID, WELL_FORMACION_ID, OBJETIVO, ALCANCES, TIPO_DE_INTERVENCIONES, TRANSACTION_ID)
      VALUES (?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO Intervenciones (
      INTERVENCIONES_ID, WELL_FORMACION_ID, OBJETIVO, ALCANCES, TIPO_DE_INTERVENCIONES, TRANSACTION_ID)
      VALUES (?, ?, ?, ?, ?, ?)`,
    loadSave: `SELECT * FROM _IntervencionesSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM Intervenciones WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_ESIMULACION_QUERY = {
    save: `INSERT INTO _IntervencionesEstimulacionsSave (
        INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ESTIMULACION,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID, HAS_ERRORS_EST_INC) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesEstimulacions (
        INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ESTIMULACION,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?)`,     
    loadSave: `SELECT * FROM _IntervencionesEstimulacionsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesEstimulacions WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_ACIDO_QUERY = {
    save: `INSERT INTO _IntervencionesAcidoSave (
        INTERVENTION_ID, WELL_FORMACION_ID,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_TOTAL, LONGITUD_EFECTIVA_GRABADA,
        ALTURA_GRABADA, ANCHO_PROMEDIO, CONCENTRACION_DEL_ACIDO, CONDUCTIVIDAD, FCD, PRESION_NETA,
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA, EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID, HAS_ERRORS_EST_INC) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesAcido (
        INTERVENTION_ID, WELL_FORMACION_ID,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_TOTAL, LONGITUD_EFECTIVA_GRABADA,
        ALTURA_GRABADA, ANCHO_PROMEDIO, CONCENTRACION_DEL_ACIDO, CONDUCTIVIDAD, FCD, PRESION_NETA,
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA, EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`,     
    loadSave: `SELECT * FROM _IntervencionesAcidoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesAcido WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_APUNTALADO_QUERY = {
    save: `INSERT INTO _IntervencionesApuntaladoSave (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_APUNTALADA, ALTURA_TOTAL_DE_FRACTURA, ANCHO_PROMEDIO,
        CONCENTRACION_AREAL, CONDUCTIVIDAD, FCD, PRESION_NETA, EFICIENCIA_DE_FLUIDO_DE_FRACTURA,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID, HAS_ERRORS_EST_INC) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesApuntalado (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_APUNTALADA, ALTURA_TOTAL_DE_FRACTURA, ANCHO_PROMEDIO,
        CONCENTRACION_AREAL, CONDUCTIVIDAD, FCD, PRESION_NETA, EFICIENCIA_DE_FLUIDO_DE_FRACTURA,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?)`,     
    loadSave: `SELECT * FROM _IntervencionesApuntaladoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesApuntalado WHERE TRANSACTION_ID = ?`    
}

const INSERT_LAB_TEST_QUERY = {
    save: `INSERT INTO _IntervencionesLabTestsSave (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ANALISIS, FECHA_DE_MUESTREO, FECHA_DE_PRUEBA, COMPANIA, PERSONAL_DE_PEMEX_QUE_SUPERVISO, OBSERVACIONES, TRANSACTION_ID)
        VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTests (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ANALISIS, FECHA_DE_MUESTREO, FECHA_DE_PRUEBA, COMPANIA, PERSONAL_DE_PEMEX_QUE_SUPERVISO, OBSERVACIONES, TRANSACTION_ID)
        VALUES ?`,
    loadSave: `SELECT 
            IL.LAB_ID, IL.TIPO_DE_ANALISIS, IL.FECHA_DE_MUESTREO, IL.FECHA_DE_PRUEBA, IL.COMPANIA, IL.PERSONAL_DE_PEMEX_QUE_SUPERVISO, IL.OBSERVACIONES,
            CF.PORENTAJE_DE_ACEITE, CF.PORENTAJE_DE_AGUA, CF.PORENTAJE_DE_EMULSION, CF.PORENTAJE_DE_SOLIDOS, CF.PORENTAJE_DE_ASFALTENOS, CF.PORENTAJE_DE_PARAFINAS,
            CF.PORENTAJE_DE_RESINAS_ASFALTICAS, CF.PORENTAJE_DE_CONTENIDO_DE_SOLIDOS, CF.DENSIDAD_DEL_ACEITE, CF.DENSIDAD_DEL_AGUA, CF.DENSIDAD_DE_LA_EMULSION,
            CF.VISCOSIDAD_DEL_ACEITE, CF.VISCOSIDAD_DE_LA_EMULSION, CF.PH_DEL_AGUA, CF.SALINIDAD_DEL_AGUA, CF.SALINIDAD_DEL_ACEITE,
            PC.DISENO, PC.SISTEMA, PC.ACEITE_DEL_POZO, PC.TIEMPO_DE_ROMPIMIENTO, PC.SEPARACION_DE_FASES, PC.SOLIDOS, PC.CONDICION,
            PG.SISTEMA_ACIDO, PG.TIEMPO_DE_CONTACTO, PG.GRABADO,
            PS.TIPO_DE_MUESTRA, PS.PESO_DE_LA_MUESTRA, PS.TIPO_DE_SISTEMA_QUIMICO, PS.PESO_FINAL_DE_LA_MUESTRA, PS.SOLUBILIDAD,
            PGF.HIDRATACION, PGF.TIEMPO_DE_ACTIVACION_DEL_GEL, PGF.DETERMINACION_DE_PH, PGF.TIEMPO_DE_ROMPIMIENTO as TIEMPO_DE_ROMPIMIENTO_GEL,
            PGF.DOSIFICATION_DE_QUEBRADORES, PGF.VISCOSIDAD_DEL_GEL_DE_FRACTURA, 
            PPA.ESFERICIDAD, PPA.REDONDEZ, PPA.RESISTENCIA_A_LA_COMPRESION, PPA.MALLA, PPA.AGLUTINAMIENTO, PPA.TURBIDEZ, PPA.SOLUBILIDAD as SOLUBILIDAD_APUNTALANTE
        FROM _IntervencionesLabTestsSave IL 
        LEFT JOIN _IntervencionesLabTestsCaracterizacionFisicoSave CF ON IL.LAB_ID = CF.LAB_ID 
        LEFT JOIN _IntervencionesLabTestsPruebasDeCompatibilidadSave PC ON IL.LAB_ID = PC.LAB_ID 
        LEFT JOIN _IntervencionesLabTestsPruebasDeGrabadoSave PG ON IL.LAB_ID = PG.LAB_ID
        LEFT JOIN _IntervencionesLabTestsPruebasDeSolubilidadSave PS ON IL.LAB_ID = PS.LAB_ID
        LEFT JOIN _IntervencionesLabTestsPruebasGelDeFracturaSave PGF ON IL.LAB_ID = PGF.LAB_ID
        LEFT JOIN _IntervencionesLabTestsPruebasParaApuntalanteSave PPA ON IL.LAB_ID = PPA.LAB_ID
        WHERE IL.TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesLabTests WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_ESTIMULACION_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaEstimulacionSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesCedulaEstimulacion (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesCedulaEstimulacionSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaEstimulacion WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_ACIDO_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaAcidoSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesCedulaAcido (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesCedulaAcidoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaAcido WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_APUNTALADO_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaApuntaladoSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`   ,
    submit: `INSERT INTO IntervencionesCedulaApuntalado (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, TRANSACTION_ID) VALUES ?`        ,
    loadSave: `SELECT * FROM _IntervencionesCedulaApuntaladoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaApuntalado WHERE TRANSACTION_ID = ?`    
}


const INSERT_COSTS_QUERY = {
    save: `INSERT INTO _IntervencionesEstimatedCostsSave (
        COST_ID, INTERVENTION_ID, ITEM, UNIT, COMPANY, COST_MNX, COST_DLS, MNXtoDLS, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesEstimatedCosts (
        COST_ID, INTERVENTION_ID, ITEM, UNIT, COMPANY, COST_MNX, COST_DLS, MNXtoDLS, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesEstimatedCostsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesEstimatedCosts WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_IMAGE_QUERY = {
    save: `INSERT INTO _IntervencionesImagesSave (
        INTERVENTION_ID, IMAGE_NAME, IMG_URL, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO IntervencionesImages (
        INTERVENTION_ID, IMAGE_NAME, IMG_URL, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _IntervencionesImagesSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesImages WHERE TRANSACTION_ID = ?`    
}

const INSERT_TRANSACTION = {
    save: `INSERT INTO SavedInputs (
        TRANSACTION_ID, USER_ID, WELL_FORMACION_ID, TIPO_DE_INTERVENCIONES, SAVE_NAME) VALUES
        (?, ?, ?, ?, ?)`,
    submit: `INSERT INTO Transactions (
        TRANSACTION_ID, USER_ID, FIELD_FORMACION_ID, WELL_FORMACION_ID) VALUES
        (?, ?, ?, ?)`, 
}


const INSERT_LAB_TEST_CARACTERIZACION_FISICO = {
    save: `INSERT INTO _IntervencionesLabTestsCaracterizacionFisicoSave (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, PORENTAJE_DE_ACEITE, PORENTAJE_DE_AGUA, 
        PORENTAJE_DE_EMULSION, PORENTAJE_DE_SOLIDOS, PORENTAJE_DE_ASFALTENOS, PORENTAJE_DE_PARAFINAS, 
        PORENTAJE_DE_RESINAS_ASFALTICAS, PORENTAJE_DE_CONTENIDO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, VISCOSIDAD_DEL_ACEITE, VISCOSIDAD_DE_LA_EMULSION, 
        PH_DEL_AGUA, SALINIDAD_DEL_AGUA, SALINIDAD_DEL_ACEITE, TRANSACTION_ID
    ) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTestsCaracterizacionFisico (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, PORENTAJE_DE_ACEITE, PORENTAJE_DE_AGUA, 
        PORENTAJE_DE_EMULSION, PORENTAJE_DE_SOLIDOS, PORENTAJE_DE_ASFALTENOS, PORENTAJE_DE_PARAFINAS, 
        PORENTAJE_DE_RESINAS_ASFALTICAS, PORENTAJE_DE_CONTENIDO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, VISCOSIDAD_DEL_ACEITE, VISCOSIDAD_DE_LA_EMULSION, 
        PH_DEL_AGUA, SALINIDAD_DEL_AGUA, SALINIDAD_DEL_ACEITE, TRANSACTION_ID
    ) VALUES ?`,
}

const INSERT_LAB_TEST_PRUEBAS_DE_SOLUBILIDAD = {
    save: `INSERT INTO _IntervencionesLabTestsPruebasDeSolubilidadSave (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_MUESTRA, PESO_DE_LA_MUESTRA, TIPO_DE_SISTEMA_QUIMICO, 
    PESO_FINAL_DE_LA_MUESTRA, SOLUBILIDAD, TRANSACTION_ID) VALUES 
    ?`,
    submit: `INSERT INTO IntervencionesLabTestsPruebasDeSolubilidad (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_MUESTRA, PESO_DE_LA_MUESTRA, TIPO_DE_SISTEMA_QUIMICO, 
    PESO_FINAL_DE_LA_MUESTRA, SOLUBILIDAD, TRANSACTION_ID) VALUES 
    ?`
}



const INSERT_LAB_TEST_PRUEBAS_DE_COMPATIBILIDAD = {
    save: `INSERT INTO _IntervencionesLabTestsPruebasDeCompatibilidadSave (
    ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, DISENO, SISTEMA, 
    ACEITE_DEL_POZO, TIEMPO_DE_ROMPIMIENTO, SEPARACION_DE_FASES, SOLIDOS, CONDICion, 
    TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTestsPruebasDeCompatibilidad (
    ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, DISENO, SISTEMA, 
    ACEITE_DEL_POZO, TIEMPO_DE_ROMPIMIENTO, SEPARACION_DE_FASES, SOLIDOS, CONDICion, 
    TRANSACTION_ID) VALUES ?`,
}

const INSERT_LAB_TEST_PRUEBAS_PARA_APUNTALANTE = {
    save: `INSERT INTO _IntervencionesLabTestsPruebasParaApuntalanteSave (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, ESFERICIDAD, REDONDEZ, 
    RESISTENCIA_A_LA_COMPRESION, MALLA, AGLUTINAMIENTO, TURBIDEZ, SOLUBILIDAD, 
    TRANSACTION_ID) VALUES 
    ?`,
    submit: `INSERT INTO IntervencionesLabTestsPruebasParaApuntalante (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, ESFERICIDAD, REDONDEZ, 
    RESISTENCIA_A_LA_COMPRESION, MALLA, AGLUTINAMIENTO, TURBIDEZ, SOLUBILIDAD, 
    TRANSACTION_ID) VALUES 
    ?`,
}

const INSERT_LAB_TEST_PRUEBAS_GEL_DE_FRACTURA = {
    save: `INSERT INTO _IntervencionesLabTestsPruebasGelDeFracturaSave (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, HIDRATACION, TIEMPO_DE_ACTIVACION_DEL_GEL, 
    DETERMINACION_DE_PH, TIEMPO_DE_ROMPIMIENTO, DOSIFICATION_DE_QUEBRADORES, VISCOSIDAD_DEL_GEL_DE_FRACTURA, TRANSACTION_ID) VALUES 
    ?`,
    submit: `INSERT INTO IntervencionesLabTestsPruebasGelDeFractura (
    LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, HIDRATACION, TIEMPO_DE_ACTIVACION_DEL_GEL, 
    DETERMINACION_DE_PH, TIEMPO_DE_ROMPIMIENTO, DOSIFICATION_DE_QUEBRADORES, VISCOSIDAD_DEL_GEL_DE_FRACTURA, TRANSACTION_ID) VALUES 
    ?`,
}

const INSERT_LAB_TEST_PRUEBAS_DE_GRABADO = {
    save: `INSERT INTO _IntervencionesLabTestsPruebasDeGrabadoSave (
    ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, SISTEMA_ACIDO, TIEMPO_DE_CONTACTO, GRABADO, TRANSACTION_ID
    ) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTestsPruebasDeGrabado (
    ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, SISTEMA_ACIDO, TIEMPO_DE_CONTACTO, GRABADO, TRANSACTION_ID
    ) VALUES ?`,
}


const DUMMY_QUERY = 'SELECT(1) FROM Users LIMIT 1'

export const getFields = async (transID, action, cb) => {
  connection.query(INSERT_FIELDS_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getWell = async (transID, action, cb) => {
  connection.query(INSERT_WELL_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getHistIntervencionesNew = async (transID, action, cb) => {
  connection.query(INSERT_HIST_INTERVENCIONES_NEW_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getHistIntervenciones = async (transID, action, cb) => {
  connection.query(INSERT_HIST_INTERVENCIONES_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}


export const getLayer = async (transID, action, cb) => {
  connection.query(INSERT_LAYER_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getMudLoss = async (transID, action, cb) => {
  connection.query(INSERT_MUD_LOSS_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getMecanico = async (transID, action, cb) => {
  connection.query(INSERT_MECANICO_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getAnalisisAgua = async (transID, action, cb) => {
  connection.query(INSERT_ANALISIS_AGUA_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}


export const getEmboloViajero = async (transID, action, cb) => {
    connection.query(INSERT_EMBOLO_VIAJERO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}

export const getBombeoNeumatico = async (transID, action, cb) => {
    connection.query(INSERT_BOMBEO_NEUMATICO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getBombeoHidraulico = async (transID, action, cb) => {
    connection.query(INSERT_BOMBEO_HIDRAULICO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getBombeoCavidades = async (transID, action, cb) => {
    connection.query(INSERT_BOMBEO_CAVIDADES_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getBombeoElectrocentrifugo = async (transID, action, cb) => {
    connection.query(INSERT_BOMBEO_ELECTROCENTRIFUGO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getBombeoMecanico = async (transID, action, cb) => {
    connection.query(INSERT_BOMBEO_MECANICO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}


export const getFieldPressure = async (transID, action, cb) => {
  connection.query(INSERT_FIELD_PRESSURE_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getWellPressure = async (transID, action, cb) => {
  connection.query(INSERT_WELL_PRESSURE_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getWellAforos = async (transID, action, cb) => {
  connection.query(INSERT_WELL_AFOROS_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getWellProduccion = async (transID, action, cb) => {
  connection.query(INSERT_WELL_PRODUCCION_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getWellImages = async (transID, action, cb) => {
  connection.query(INSERT_WELL_IMAGE_QUERY[action], [transID], (err, results) => {
    cb(results)
   })
}

export const getInterventionBase = async (transID, action, cb) => {
    connection.query(INSERT_INTERVENTION_BASE_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getInterventionEsimulacion = async (transID, action, cb) => {
    connection.query(INSERT_INTERVENTION_ESIMULACION_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getInterventionAcido = async (transID, action, cb) => {
    connection.query(INSERT_INTERVENTION_ACIDO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getInterventionApuntalado = async (transID, action, cb) => {
    connection.query(INSERT_INTERVENTION_APUNTALADO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getLabTest = async (transID, action, cb) => {
    connection.query(INSERT_LAB_TEST_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getCedulaEstimulacion = async (transID, action, cb) => {
    connection.query(INSERT_CEDULA_ESTIMULACION_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getCedulaAcido = async (transID, action, cb) => {
    connection.query(INSERT_CEDULA_ACIDO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getCedulaApuntalado = async (transID, action, cb) => {
    connection.query(INSERT_CEDULA_APUNTALADO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}

export const getCosts = async (transID, action, cb) => {
    connection.query(INSERT_COSTS_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getInterventionImage = async (transID, action, cb) => {
    connection.query(INSERT_INTERVENTION_IMAGE_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}



export const create = async (body, action, cb) => {
  let transactionID = Math.floor(Math.random() * 1000000000)
 // console.log('what are we here?', body)
  const allKeys = Object.keys(body)
  // const { pozo } = JSON.parse(body.fichaTecnicaDelPozoHighLevel)
  // console.log('pzo', pozo)
  console.log('herererer')

  const finalObj = {}
  console.log(allKeys)

  for(let k of allKeys) {

    const innerObj = JSON.parse(body[k])
    const innerKeys = Object.keys(innerObj)
    // look for immediate images
    if (innerObj.img) {
      innerObj.imgName = [transactionID, k].join('.')
      console.log('found image', k, innerObj.imgName)

      const buf = Buffer.from(innerObj.img, 'base64')
      const t = await addObject(buf, innerObj.imgName).catch(reason => console.log(reason))
      innerObj.img = t
      console.log('uploaded img', t, k)
    }

    for (let iKey of innerKeys) {
      const property = innerObj[iKey]
      if (Array.isArray(property)) {
        for (let j of property) {
          if (j.img) {
            const buf = Buffer.from(j.img, 'base64')
            const t = await addObject(buf, j.imgName).catch(reason => console.log(reason))
            j.img = t
            console.log('uploaded img', k, t)
          }
        }
      }
    }
    finalObj[k] = innerObj
  }


  let userID = finalObj.user.id

  let saveName = finalObj.saveName


  let { subdireccion, activo, campo, pozo, formacion } = finalObj.fichaTecnicaDelPozoHighLevel

  let { historicoEstimulacionData, historicoAcidoData, historicoApuntaladoData } = finalObj.historialDeIntervenciones

  let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialField, pInicialAnoField, pActualField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field } = finalObj.fichaTecnicaDelCampo

  let { caliza,
    dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pws, pwsFecha, pwf, pwfFecha,
    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, historialIntervencionesData } = finalObj.fichaTecnicaDelPozo
  
  let { layerData, mudLossData } = finalObj.evaluacionPetrofisica

  let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
    tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase,
    diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
    volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular } = finalObj.mecanicoYAparejoDeProduccion

  let {waterAnalysisBool, pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
    densidadAt20 } = finalObj.analisisDelAgua

  let { tipoDeSistemo, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV,
    presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN,
    volumenDeGasInyectadoBN, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH,
    fluidoMotrizBH, equipoSuperficialBH, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
    hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, profundidadDelMotorBE,
    diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE,
    longitudDeCableBE, rmpBE, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
    tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
    nivelDinamico, nivelEstatico } = finalObj.sistemasArtificialesDeProduccion

  let { pressureDepthPozo, pressureDepthCampo, presionDataCampo, presionDataPozo } = finalObj.historicoDePresion

  let { produccionData } = finalObj.historicoDeProduccion

  let { aforosData } = finalObj.historicoDeAforos

  let wellLogFile = finalObj.evaluacionPetrofisica.imgName
  let wellBoreFile = finalObj.mecanicoYAparejoDeProduccion.imgName
  let sistemasArtificialesFile = finalObj.sistemasArtificialesDeProduccion.imgName

  let labResultsFile
  let simResultsFile
  let incProdFile



  let { objetivo, alcances, tipoDeIntervenciones } = finalObj.objetivoYAlcancesIntervencion

  let { pruebasDeLaboratorioData } = finalObj.pruebasDeLaboratorio

  let { estimacionCostosData } = finalObj.estCost

  if (tipoDeIntervenciones === 'estimulacion') {
      //Propuesta Estimulaction
      var { tipoDeColocacion, tiempoDeContacto, tipoDeEstimulacion, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = finalObj.propuestaEstimulacion

      //Simulacion Resultados Estimulacion
      var { penetracionRadial, longitudDeAgujeroDeGusano } = finalObj.resultadosSimulacionEstimulacion

      //EstIncProd
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncEstim } = finalObj.estIncProduccionEstimulacion

      var { cedulaData, propuestaCompany } = finalObj.propuestaEstimulacion

      labResultsFile = finalObj.resultadosSimulacionEstimulacion.imgName
      incProdFile = finalObj.estIncProduccionEstimulacion.imgName
      simResultsFile = finalObj.resultadosSimulacionEstimulacion.imgName
  }
  else if (tipoDeIntervenciones === 'acido') {
      //Propuesta De Fracturamiento Acido
      var { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = finalObj.propuestaAcido

      //Resultados De La Simulacion
      var { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = finalObj.resultadosSimulacionAcido

      //Estimacion Del Incremento De Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncAcido } = finalObj.estIncProduccionAcido

      var { cedulaData, propuestaCompany } = finalObj.propuestaAcido

      labResultsFile = finalObj.resultadosSimulacionAcido.imgName
      incProdFile = finalObj.estIncProduccionAcido.imgName
      simResultsFile = finalObj.resultadosSimulacionAcido.imgName
  }

  else if (tipoDeIntervenciones === 'apuntalado') {
      //Propuesta De Fracturamiento Apuntalado
      var { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = finalObj.propuestaApuntalado

      //Resultados de simulacion Apuntalado
      var { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
        fcd, presionNeta, eficienciaDeFluidoDeFractura  } = finalObj.resultadosSimulacionApuntalado


      //Est Inc Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncApuntalado } = finalObj.estIncProduccionApuntalado

      var { cedulaData, propuestaCompany } = finalObj.propuestaApuntalado

      labResultsFile = finalObj.resultadosSimulacionApuntalado.imgName
      incProdFile = finalObj.estIncProduccionApuntalado.imgName
      simResultsFile = finalObj.resultadosSimulacionApuntalado.imgName
  }

  // write to db
  
  let fieldFormacionID = campo
  let wellFormacionID = pozo
  let interventionID = Math.floor(Math.random() * 1000000000)
  let inputInterventionID
  let intervalID
  let zoneID

  connection.beginTransaction(function(err) {
    if (err) { throw err; }

    let values = [
    fieldFormacionID, subdireccion, activo, formacion,
    descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialField, pInicialAnoField, pActualField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field, transactionID]

    if (action === 'save') {
        values.push(finalObj.fichaTecnicaDelCampo.hasErrors === true ? 1 : 0)
    }

    const errors = []
    connection.query((action === 'save' ? INSERT_FIELDS_QUERY.save : INSERT_FIELDS_QUERY.submit), values, (err, results) => {
      console.log('field', err)
      console.log('field', results)
      if (err) {
        return connection.rollback(function() {
          console.log('rolling back!!! 1')
          cb(err)
        })
      }

      values = [wellFormacionID, subdireccion, activo,
      formacion, caliza,
      dolomia, arcilla, porosidad, permeabilidad, sw,
      caa, cga, tipoDePozo, pws, pwsFecha, pwf, pwfFecha,
      deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador,
      profSensorPYT, tipoDeSistemo, transactionID]

      if (action === 'save') {
        values.push(finalObj.fichaTecnicaDelPozo.hasErrors === true ? 1 : 0)
      }

      connection.query((action === 'save' ? INSERT_WELL_QUERY.save : INSERT_WELL_QUERY.submit), values, (err, results) => {
        if (err) {
            return connection.rollback(function() {
              console.log('rolling back!!! 2')
              cb(err)
            })
        }
        console.log('well', err)
        console.log('well', results)
        values = []

        historialIntervencionesData.forEach(i => {
          inputInterventionID = Math.floor(Math.random() * 1000000000)
          values.push([wellFormacionID, inputInterventionID, i.fecha, i.intervenciones, transactionID])
        })

        connection.query((action === 'save' ? INSERT_HIST_INTERVENCIONES_QUERY.save : INSERT_HIST_INTERVENCIONES_QUERY.submit), [values], (err, results) => {
          if (err) {
            return connection.rollback(function() {
              console.log('rolling back!!! 2')
              cb(err)
            })
          }
          console.log('user input intervention', err)
          console.log('user input intervention', results)

          values = []

          layerData.forEach(i => {
            intervalID = Math.floor(Math.random() * 1000000000)
            values.push([intervalID, wellFormacionID, i.interval, i.cimaMD, i.baseMD,
              i.espesorBruto, i.espesorNeto, i.vArc, i.porosity, i.sw, i.dens, i.resis, i.perm, transactionID])
          })

          connection.query((action === 'save' ? INSERT_LAYER_QUERY.save : INSERT_LAYER_QUERY.submit), [values], (err, results) => {
            console.log('layers', err)
            console.log('layers', results)
            if (err) {
              return connection.rollback(function() {
                console.log('rolling back!!! 2')
                cb(err)
              })
            }
            values = []

            mudLossData.forEach(i => {
              zoneID = Math.floor(Math.random() * 1000000000)
              values.push([zoneID, wellFormacionID, i.cimaMD, i.baseMD, i.lodoPerdido, i.densidad, transactionID])
            })

            connection.query((action === 'save' ? INSERT_MUD_LOSS_QUERY.save : INSERT_MUD_LOSS_QUERY.submit), [values], (err, results) => {
              console.log('mud loss', err)
              console.log('mud loss', results)
              if (err) {
                return connection.rollback(function() {
                  console.log('rolling back!!! 2')
                  cb(err)
                })
              }

              values = [wellFormacionID, tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
                tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase,
                diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
                volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular, transactionID]

              if (action === 'save') {
                values.push(finalObj.mecanicoYAparejoDeProduccion.hasErrors === true ? 1 : 0)
              }

              connection.query((action === 'save' ? INSERT_MECANICO_QUERY.save : INSERT_MECANICO_QUERY.submit), values, (err, results) => {
                if (err) {
                  return connection.rollback(function() {
                    console.log('rolling back!!! 2')
                    cb(err)
                  })
                }
                console.log('mecanico', err)
                console.log('mecanico', results)

                values = [wellFormacionID, pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
                    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
                    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
                    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
                    densidadAt20, transactionID ]

                if (action === 'save') {
                  values.push(finalObj.analisisDelAgua.hasErrors === true ? 1 : 0)
                  values.push(waterAnalysisBool)
                }
                let query

                query = action === 'save' ? INSERT_ANALISIS_AGUA_QUERY.save : (waterAnalysisBool === false ? DUMMY_QUERY  : INSERT_ANALISIS_AGUA_QUERY.submit)
                connection.query(query, values, (err, results) => {
                  if (err) {
                    return connection.rollback(function() {
                      console.log('rolling back!!! 2')
                      cb(err)
                    })
                  }
                  console.log('agua', err)
                  console.log('agua', results)

                  query = 'SELECT(1) FROM Users LIMIT 1'

                  switch(tipoDeSistemo) {
                    case 'emboloViajero':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsEmboloViajeroSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsEmboloViajero (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV, transactionID]
                      break
                    case 'bombeoNeumatico':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsBombeoNeumaticoSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                        ORIFICIO, VOLUMEN_DE_GAS_INYECTADO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoNeumatico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                        ORIFICIO, VOLUMEN_DE_GAS_INYECTADO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN,
                        profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN, transactionID]
                      break
                    case 'bombeoHidraulico':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsBombeoHidraulicoSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, EQUIPO_SUPERFICIAL, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoHidraulico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, EQUIPO_SUPERFICIAL, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH,
                        tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH, transactionID]
                      break
                    case 'bombeoCavidadesProgresivas':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsBombeoCavidadesProgresivasSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                        TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoCavidadesProgresivas (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                        TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
                        hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, transactionID]
                      break
                    case 'bombeoElectrocentrifugo':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsBombeoElectrocentrifugoSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                        TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoElectrocentrifugo (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                        TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE,
                        amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE, transactionID]
                      break
                    case 'bombeoMecanico':
                      query = action === 'save' ? `INSERT INTO _WellProductionSystemsBombeoMecanicoSave (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                        PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoMecanico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                        PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                        values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
                          tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
                          nivelDinamico, nivelEstatico, transactionID]
                    break;
                  }


                  connection.query(query, values, (err, results) => {
                    console.log('sistemas', err)
                    console.log('sistemas', results)
                    if (err) {
                      return connection.rollback(function() {
                        console.log('rolling back!!! 2')
                        cb(err)
                      })
                    }

                    values = []

                    presionDataPozo.forEach(i => {
                      let newRow = [wellFormacionID, i.fecha, i.Pws, pressureDepthCampo, transactionID]
                      if (action === 'save') {
                        newRow.push(finalObj.historicoDePresion.hasErrorsCampo === true ? 1 : 0)
                      }
                      values.push(newRow)
                    })

                    connection.query((action === 'save' ? INSERT_FIELD_PRESSURE_QUERY.save : INSERT_FIELD_PRESSURE_QUERY.submit), [values], (err, results) => {
                      console.log('field pressure', err)
                      console.log('field pressure', results)
                      if (err) {
                        return connection.rollback(function() {
                          console.log('rolling back!!! 2')
                          cb(err)
                        })
                      }

                      values = []

                      presionDataPozo.forEach(i => {
                        let newRow = [wellFormacionID, i.fecha, i.Pws, i.Pwf, pressureDepthPozo, transactionID]
                        if (action === 'save') {
                          newRow.push(finalObj.historicoDePresion.hasErrorsPozo === true ? 1 : 0)
                        }
                        values.push(newRow)
                      })

                      connection.query((action === 'save' ? INSERT_WELL_PRESSURE_QUERY.save : INSERT_WELL_PRESSURE_QUERY.submit), [values], (err, results) => {
                        console.log('well pressure', err)
                        console.log('well pressure', results)
                        if (err) {
                          return connection.rollback(function() {
                            console.log('rolling back!!! 2')
                            cb(err)
                          })
                        }

                        values = []
                        aforosData.forEach(i => {
                            values.push([wellFormacionID, i.fecha, i.tiempo, i.estrangulador, i.ptp, i.ttp, i.pbaj, i.tbaj, i.psep, i.tsep, i.ql, i.qo, i.qg, i.qw, i.rga, i.salinidad, i.ph, transactionID])
                        })
                        connection.query((action === 'save' ? INSERT_WELL_AFOROS_QUERY.save : INSERT_WELL_AFOROS_QUERY.submit), [values], (err, results) => {
                          console.log('well aforos', err)
                          console.log('well aforos', results)
                          if (err) {
                            return connection.rollback(function() {
                              console.log('rolling back!!! 2')
                              cb(err)
                            })
                          }

                          values = []
                          produccionData.forEach(i => {
                            values.push([wellFormacionID, i.fecha, i.dias, i.qo, i.qw, i.qg, i.qgi, i.qo_vol, i.qw_vol, i.qg_vol, i.qgi_vol, i.np, i.wp, i.gp, i.gi, i.rga, i.fw, transactionID])
                          })

                          connection.query((action === 'save' ? INSERT_WELL_PRODUCCION_QUERY.save : INSERT_WELL_PRODUCCION_QUERY.submit), [values], (err, results) => {
                            console.log('well prod', err)
                            console.log('well prod', results)
                            if (err) {
                              return connection.rollback(function() {
                                console.log('rolling back!!! 2')
                                cb(err)
                              })
                            }

                            values = [
                              [wellFormacionID, 'Well Log', wellLogFile, transactionID],
                              [wellFormacionID, 'Well Bore Diagram', wellBoreFile, transactionID],
                              [wellFormacionID, 'Sistemas Artificiales', sistemasArtificialesFile, transactionID]
                            ]

                            connection.query((action === 'save' ? INSERT_WELL_IMAGE_QUERY.save : INSERT_WELL_IMAGE_QUERY.submit), [values], (err, results) => {
                              console.log('well img', err)
                              console.log('well img', results)
                              if (err) {
                                return connection.rollback(function() {
                                  console.log('rolling back!!! 2')
                                  cb(err)
                                })
                              }

                              connection.query((action === 'save' ? INSERT_INTERVENTION_BASE_QUERY.save : INSERT_INTERVENTION_BASE_QUERY.submit), [
                                interventionID, wellFormacionID, objetivo, alcances, tipoDeIntervenciones, transactionID
                              ], (err, results) => {
                                console.log('intervention base', err)
                                console.log('intervention base', results)
                                if (err) {
                                  return connection.rollback(function() {
                                    console.log('rolling back!!! 2')
                                    cb(err)
                                  })
                                }



                                query = tipoDeIntervenciones === 'estimulacion' ? (action === 'save' ? INSERT_INTERVENTION_ESIMULACION_QUERY.save : INSERT_INTERVENTION_ESIMULACION_QUERY.submit) : tipoDeIntervenciones === 'acido' ? (action === 'save' ? INSERT_INTERVENTION_ACIDO_QUERY.save : INSERT_INTERVENTION_ACIDO_QUERY.submit) : (action === 'save' ? INSERT_INTERVENTION_APUNTALADO_QUERY.save : INSERT_INTERVENTION_APUNTALADO_QUERY.submit)

                                if (tipoDeIntervenciones === 'estimulacion') {
                                  values = [
                                    interventionID, wellFormacionID, tipoDeEstimulacion, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                                    volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido,
                                    tipoDeColocacion, tiempoDeContacto, penetracionRadial, longitudDeAgujeroDeGusano,
                                    estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                    estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                    estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                    estIncGastoCompromisoQg, obervacionesEstIncEstim, transactionID
                                  ]

                                  if (action === 'save') {
                                    values.push(finalObj.estIncProduccionEstimulacion.hasErrors === true ? 1 : 0)
                                  }

                                }
                                else if (tipoDeIntervenciones === 'acido'){ 
                                  values = [
                                    interventionID, wellFormacionID, 
                                    volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                                  volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, 
                                  moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, 
                                    longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
                                    conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                    estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                    estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                    estIncGastoCompromisoQg, obervacionesEstIncAcido, transactionID
                                  ]

                                  if (action === 'save') {
                                    values.push(finalObj.estIncProduccionAcido.hasErrors === true ? 1 : 0)
                                  }
                                }
                                else if (tipoDeIntervenciones === 'apuntalado') {
                                  values = [
                                      interventionID, wellFormacionID, 
                                      volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                                        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, 
                                        moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos,
                                      longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
                                      fcd, presionNeta, eficienciaDeFluidoDeFractura,
                                      estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                      estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                      estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                      estIncGastoCompromisoQg, obervacionesEstIncApuntalado, transactionID
                                    ]
                                  
                                  if (action === 'save') {
                                    values.push(finalObj.estIncProduccionApuntalado.hasErrors === true ? 1 : 0)
                                  }    
                                } 

                                connection.query(query, values, (err, results) => {
                                  console.log('intervention', err)
                                  console.log('intervention', results)
                                  if (err) {
                                    // TODO: READD!!!
                                    // return connection.rollback(function() {
                                    //   console.log('rolling back!!! 2')
                                    //   cb(err)
                                    // })
                                  }

                                  values = []
                                  const labResultValues = []

                                  console.log(pruebasDeLaboratorioData)
                                  if (pruebasDeLaboratorioData && pruebasDeLaboratorioData[0]) {
                                    pruebasDeLaboratorioData.forEach(i => {
                                    const labID = Math.floor(Math.random() * 1000000000)
                                    i.labID = labID
                                    values.push([labID, interventionID, wellFormacionID, i.type, i.fechaMuestreo, i.fechaPrueba, i.compania, i.superviso, i.obervaciones, transactionID])
                                  })
                                  
                                  }
                                  else {
                                    INSERT_LAB_TEST_QUERY.save = `SELECT(1) FROM Users LIMIT 1`
                                  }

                                  connection.query((action === 'save' ? INSERT_LAB_TEST_QUERY.save : INSERT_LAB_TEST_QUERY.submit), [values], (err, results) => {
                                    console.log('lab tests', err)
                                    console.log('lab tests', results)
                                    if (err) {
                                      // TODO: READD!!!
                                      // return connection.rollback(function() {
                                      //   console.log('rolling back!!! 2')
                                      //   cb(err)
                                      // })
                                    }

                                    query = tipoDeIntervenciones === 'estimulacion' ? (action === 'save' ? INSERT_CEDULA_ESTIMULACION_QUERY.save : INSERT_CEDULA_ESTIMULACION_QUERY.submit) : tipoDeIntervenciones === 'acido' ? (action === 'save' ? INSERT_CEDULA_ACIDO_QUERY.save : INSERT_CEDULA_ACIDO_QUERY.submit) : (action === 'save' ? INSERT_CEDULA_APUNTALADO_QUERY.save : INSERT_CEDULA_APUNTALADO_QUERY.submit)

                                    values = []

                                    if (tipoDeIntervenciones === 'estimulacion') {
                                      if (cedulaData) {
                                        cedulaData.forEach(i => {
                                          let cedulaID = Math.floor(Math.random() * 1000000000)
                                          values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, propuestaCompany, transactionID])
                                        })  
                                      }
                                      else {
                                        if (action === 'save') {
                                          query = 'SELECT(1) FROM Users LIMIT 1'
                                        }
                                      } 
                                    } 
                                    else {
                                      if (cedulaData) {
                                        cedulaData.forEach(i => {
                                          let cedulaID = Math.floor(Math.random() * 1000000000)
                                          values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.tipoDeApuntalante, i.concentraciDeApuntalante, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, propuestaCompany, transactionID])
                                        })   
                                      }
                                      else {
                                        if (action === 'save') {
                                          query = 'SELECT(1) FROM Users LIMIT 1'
                                        }
                                      }

                                    }

                                    connection.query(query, [values], (err, results) => {
                                      console.log('cedula', err)
                                      console.log('cedula', results)
                                      if (err) {
                                        return connection.rollback(function() {
                                          console.log('rolling back!!! 2')
                                          cb(err)
                                        })
                                      }


                                          values = []
                                          estimacionCostosData.forEach(i => {
                                            let costID = Math.floor(Math.random() * 1000000000)
                                            values.push([costID, interventionID, i.item, i.unit, propuestaCompany, i.cost, i.costDLS, i.MNXtoDLS, transactionID])
                                          })

                                          connection.query((action === 'save' ? INSERT_COSTS_QUERY.save : INSERT_COSTS_QUERY.submit), [values], (err, results) => {
                                            console.log('costs', err)
                                            console.log('costs', results)
                                            if (err) {
                                              // TODO: READD!!!
                                              // return connection.rollback(function() {
                                              //   console.log('rolling back!!! 2')
                                              //   cb(err)
                                              // })
                                            }

                                            values = [
                                              [interventionID, 'Lab Results', labResultsFile, transactionID],
                                              [interventionID, 'Est Inc Prod', incProdFile, transactionID],
                                              [interventionID, 'Simulation Results', simResultsFile, transactionID]
                                            ]

                                            connection.query((action === 'save' ? INSERT_INTERVENTION_IMAGE_QUERY.save : INSERT_INTERVENTION_IMAGE_QUERY.submit), [values], (err, results) => {
                                              console.log('intervention img', err)
                                              console.log('intervention img', results)
                                              if (err) {
                                                return connection.rollback(function() {
                                                  console.log('rolling back!!! 2')
                                                  cb(err)
                                                })
                                              }

                                              values = action === 'save' ? [transactionID, userID, wellFormacionID, tipoDeIntervenciones, saveName] : [transactionID, userID, fieldFormacionID, wellFormacionID]
                                              connection.query((action === 'save' ? INSERT_TRANSACTION.save : INSERT_TRANSACTION.submit), values, (err, results) => {
                                                console.log('transaction', err)
                                                console.log('transaction', results)
                                                if (err) {
                                                  return connection.rollback(function() {
                                                    console.log('rolling back!!! 2')
                                                    cb(err)
                                                  })
                                                }


                                                values = []
                                                let caracterizacionFisicoData = pruebasDeLaboratorioData.filter(i => i.type === 'caracterizacionFisico')
                                                
                                                caracterizacionFisicoData.forEach(i => {
                                                  values.push([i.labID, interventionID, wellFormacionID, i.percentAceite, i.percentAgua, i.percentEmulsion,
                                                    i.percentSolidos, i.percentAsfaltenos, i.percentParafinas, i.percentResinasAsfalticas, i.percentContenidoDeSolidos,
                                                    i.densityAceite, i.densityAgua, i.densityEmulsion, i.viscosityAceite, i.viscosityEmulsion,
                                                    i.phDelAgua, i.salinidadDelAgua, i.salinidadDelAceite, transactionID])
                                                })

                                                connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_CARACTERIZACION_FISICO.save : INSERT_LAB_TEST_CARACTERIZACION_FISICO.submit, [values], (err, results) => {
                                                  console.log('lab test caracterizacionFisico', err)
                                                  console.log('lab test caracterizacionFisico', results)
                                                  if (err) {
                                                    return connection.rollback(function() {
                                                      console.log('rolling back!!! 2')
                                                      cb(err)
                                                    })
                                                  }


                                                  values = []
                                                  let pruebasSolubilidadData = pruebasDeLaboratorioData.filter(i => i.type === 'pruebasDeSolubilidad')
                                                
                                                  pruebasSolubilidadData.forEach(i => {
                                                    values.push([i.labID, interventionID, wellFormacionID, i.tipoDeMuestra, i.pesoDeLaMuestra, i.tipoDeSistemaEmpleado,
                                                      i.pesoDeLaMuestraFinal, i.solubilidad, transactionID])
                                                  })

                                                  connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_PRUEBAS_DE_SOLUBILIDAD.save : INSERT_LAB_TEST_PRUEBAS_DE_SOLUBILIDAD.submit, [values], (err, results) => {
                                                    console.log('lab test solubildad', err)
                                                    console.log('lab test solubildad', results)
                                                    if (err) {
                                                      return connection.rollback(function() {
                                                        console.log('rolling back!!! 2')
                                                        cb(err)
                                                      })
                                                    }

                                                    values = []
                                                    let pruebasCompatibilidadData = pruebasDeLaboratorioData.filter(i => i.type === 'pruebasDeCompatibilidad')
                                                  
        
                                                    pruebasCompatibilidadData.forEach(i => {
                                                      if (i.compatabilidadTable) {
                                                        i.compatabilidadTable.forEach(j => {
                                                          let id = Math.floor(Math.random() * 1000000000)
                                                          values.push([id, i.labID, interventionID, wellFormacionID, j.diseno, j.sistema, j.aceiteDelPozo,
                                                            j.tiempoDeRompimiento, j.separacionDeFases, j.solidos, j.condicion, transactionID])
                                                        })
                                                      }
                                                    })

                                                    connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_PRUEBAS_DE_COMPATIBILIDAD.save : INSERT_LAB_TEST_PRUEBAS_DE_COMPATIBILIDAD.submit, [values], (err, results) => {
                                                      console.log('lab test compatibilidad', err)
                                                      console.log('lab test compatibilidad', results)


                                                      if (err) {
                                                        return connection.rollback(function() {
                                                          console.log('rolling back!!! 2')
                                                          cb(err)
                                                        })
                                                      }


                                                      values = []
                                                      let pruebasApuntalanteData = pruebasDeLaboratorioData.filter(i => i.type === 'pruebasParaApuntalante')
                                                    
          
                                                      pruebasApuntalanteData.forEach(i => {
                                                        values.push([i.labID, interventionID, wellFormacionID, i.esfericidad, i.redondez, i.resistenciaCompresion,
                                                          i.malla, i.aglutinamiento, i.turbidez, i.solubilidad, transactionID])
                                                      })

                                                      connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_PRUEBAS_PARA_APUNTALANTE.save : INSERT_LAB_TEST_PRUEBAS_PARA_APUNTALANTE.submit, [values], (err, results) => {
                                                        console.log('lab test apuntalante', err)
                                                        console.log('lab test apuntalante', results)


                                                        if (err) {
                                                          return connection.rollback(function() {
                                                            console.log('rolling back!!! 2')
                                                            cb(err)
                                                          })
                                                        }

                                                        values = []
                                                        let pruebasGelDeFracturaData = pruebasDeLaboratorioData.filter(i => i.type === 'pruebasGelDeFractura')
                                                      
            
                                                        pruebasGelDeFracturaData.forEach(i => {
                                                          values.push([i.labID, interventionID, wellFormacionID, i.hidratacionDelFluido, i.tiempoDeActivacion, i.determinacionDePh,
                                                            i.tiempoDeRompimiento, i.dosificacionDeQuebradors, i.viscosidadDelGelDeFractura, transactionID])
                                                        })

                                                        connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_PRUEBAS_GEL_DE_FRACTURA.save : INSERT_LAB_TEST_PRUEBAS_GEL_DE_FRACTURA.submit, [values], (err, results) => {
                                                          console.log('lab test fractura', err)
                                                          console.log('lab test fractura', results)


                                                          if (err) {
                                                            return connection.rollback(function() {
                                                              console.log('rolling back!!! 2')
                                                              cb(err)
                                                            })
                                                          }

                                                          values = []
                                                          let pruebasGrabadoData = pruebasDeLaboratorioData.filter(i => i.type === 'pruebasDeGrabado')
                                                        
              
                                                          pruebasGrabadoData.forEach(i => {
                                                            if (i.grabadoTable) {
                                                              i.grabadoTable.forEach(j => {
                                                                let id = Math.floor(Math.random() * 1000000000)
                                                                values.push([id, i.labID, interventionID, wellFormacionID, j.sistemaAcido, j.tiempoDeContacto,
                                                                j.grabado, transactionID])
                                                              })
                                                            }
                                                          })

                                                          connection.query(values.length === 0 ? DUMMY_QUERY : action === 'save' ? INSERT_LAB_TEST_PRUEBAS_DE_GRABADO.save : INSERT_LAB_TEST_PRUEBAS_DE_GRABADO.submit, [values], (err, results) => {
                                                            console.log('lab test grabado', err)
                                                            console.log('lab test grabado', results)


                                                            if (err) {
                                                              return connection.rollback(function() {
                                                                console.log('rolling back!!! 2')
                                                                cb(err)
                                                              })
                                                            }

                                                            connection.query(action === 'save' ? DUMMY_QUERY : `UPDATE FieldWellMapping set HAS_DATA = 1 WHERE WELL_FORMACION_ID = ?`, [wellFormacionID], (err, results) => {
                                                               

                                                                values = []

                                                                historicoEstimulacionData.forEach(i => {
                                                                    values.push([wellFormacionID, 'estimulacion', i.fecha, i.tipoDeTratamiento, i.objetivo, i.compania, i.acidoVol, i.acidoNombre, i.solventeVol, i.solventeNombre, i.divergenteVol, i.divergenteNombre, i.totalN2, i.beneficioProgramado, i.beneficioOficial, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, -9999, transactionID ])
                                                                })
                                                                historicoAcidoData.forEach(i => {
                                                                    values.push([wellFormacionID, 'acido', i.fecha, i.tipoDeTratamiento, i.objetivo, i.compania, -9999, -9999, -9999, -9999, -9999, -9999, -9999, i.beneficioProgramado, i.beneficioOficial, i.base, i.cima, i.longitudGravada, i.alturaGravada, i.anchoGravado, i.conductividad, i.fcd, i.presionNeta, i.fluidoFractura, -9999, -9999, -9999, -9999, transactionID])
                                                                })
                                                                historicoApuntaladoData.forEach(i => {
                                                                    values.push([wellFormacionID, 'apuntalado', i.fecha, i.tipoDeTratamiento, i.objetivo, i.compania, -9999, -9999, -9999, -9999, -9999, -9999, -9999, i.beneficioProgramado, i.beneficioOficial, i.base, i.cima, -9999, -9999, -9999, i.conductividad, i.fcd, i.presionNeta, i.fluidoFractura, i.longitudApuntalada, i.alturaTotalDeFractura, i.anchoPromedio, i.concentracionAreal, transactionID])
                                                                })

                                                                values.forEach(i => {
                                                                    console.log(i.length)
                                                                })


                                                                connection.query(action === 'save' ? INSERT_HIST_INTERVENCIONES_NEW_QUERY.save : INSERT_HIST_INTERVENCIONES_NEW_QUERY.submit, [values], (err, results) => {
                                                                    console.log('historial interventions', err)
                                                                    console.log('historial interventions', results)

                                                                    if (err) {
                                                                      return connection.rollback(function() {
                                                                        console.log('rolling back!!! 2')
                                                                        cb(err)
                                                                      })
                                                                    }


                                                                    connection.commit(function(err) {
                                                                        if (err) {
                                                                          cb(err)
                                                                          return connection.rollback(function() {
                                                                            console.log('something went terrible')
                                                                            throw err;
                                                                          });
                                                                        }
                                                                        console.log('success!');
                                                                        var log = 'Post ' + results + ' added';
                                                                        console.log(log)
                                                                        cb(null)
                                                                    })
                                                                })

                                                            })

                                                          })
                                                        })
                                                      })
                                                    })
                                                  })
                                                })
                                              })
                                            })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}