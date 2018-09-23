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
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL_ANO, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, TIPO_DE_FLUIDO, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      QO, QG, RGA, FW, NP, GP, WP, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2, TRANSACTION_ID) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO FieldsData (
      FIELD_FORMACION_ID, SUBDIRECCION, ACTIVO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL_ANO, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, TIPO_DE_FLUIDO, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      QO, QG, RGA, FW, NP, GP, WP, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2, TRANSACTION_ID) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    loadSave: `SELECT * FROM _FieldsDataSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM FieldsData WHERE TRANSACTION_ID = ?`
}

const INSERT_WELL_QUERY = {
    save: `INSERT INTO _WellsDataSave (
        WELL_FORMACION_ID, SUBDIRECCION, ACTIVO,
        FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO,
        ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD,
        PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO,
        PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT,
        APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SISTEMA, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO WellsData (
        WELL_FORMACION_ID, SUBDIRECCION, ACTIVO,
        FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO,
        ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD,
        PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO,
        PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT,
        APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SISTEMA, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`,
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
        INTERVAL_ID, WELL_FORMACION_ID, INTERVALO, CIMA_MD, BASE_MD, CIMA_MV, BASE_MV,
        V_ARC, POROSITY, SW, DENS, RESIS, PERMEABILIDAD, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellLayers (
        INTERVAL_ID, WELL_FORMACION_ID, INTERVALO, CIMA_MD, BASE_MD, CIMA_MV, BASE_MV,
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
        VOLUMEN_INTERVALO_BASE, VOLUMEN_DE_ESPACIO_ANULA, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        DENSIDAD_20, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`,
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
        FIELD_FORMACION_ID, FECHA, QO, NP, PWS, PR, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO FieldHistoricalPressure (
        FIELD_FORMACION_ID, FECHA, QO, NP, PWS, PR, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _FieldHistoricalPressureSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM FieldHistoricalPressure WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_PRESSURE_QUERY = {
    save: `INSERT INTO _WellHistoricalPressureSave (
        WELL_FORMACION_ID, FECHA, QO, NP, PWS, PR, TRANSACTION_ID) VALUES
        ?`,
    submit: `INSERT INTO WellHistoricalPressure (
        WELL_FORMACION_ID, FECHA, QO, NP, PWS, PR, TRANSACTION_ID) VALUES
        ?`,
    loadSave: `SELECT * FROM _WellHistoricalPressureSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellHistoricalPressure WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_AFOROS_QUERY = {
    save: `INSERT INTO _WellAforosSave (
        WELL_FORMACION_ID, FECHA, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO WellAforos (
        WELL_FORMACION_ID, FECHA, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH, TRANSACTION_ID) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?)`,     
    loadSave: `SELECT * FROM _WellAforosSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM WellAforos WHERE TRANSACTION_ID = ?`    
}

const INSERT_WELL_PRODUCCION_QUERY = {
    save: `INSERT INTO _WellHistoricalProduccionSave (
        WELL_FORMACION_ID, Fecha, Dias, QO, QW, QG_CAL, QGL, NP, WP, GP, GI, RGA, FW_FRACTION, POZOS_PROD_ACTIVOS, TRANSACTION_ID)
        VALUES 
        ?`,
    submit: `INSERT INTO WellHistoricalProduccion (
        WELL_FORMACION_ID, Fecha, Dias, QO, QW, QG_CAL, QGL, NP, WP, GP, GI, RGA, FW_FRACTION, POZOS_PROD_ACTIVOS, TRANSACTION_ID)
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
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO, CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, VOLUMEN_DEL_SISTEMA_ACIDO_LIMPIEZA, VOLUMEN_DEL_SISTEMA_NO_ACIDO_LIMPIEZA, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, NUMERO_DE_ETAPAS, VOLUMEN_DEL_SISTEMA_ACIDO, VOLUMEN_DEL_SISTEMA_NO_ACIDO, VOLUMEN_DE_DIVERGENTE, VOLUMEN_DE_N2,
        CALIDAD_DE_ESPUMA, VOLUMEN_DE_PRECOLCHON_N2, VOLUMEN_DE_DESPLAZAMIENTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesEstimulacions (
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO, CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, VOLUMEN_DEL_SISTEMA_ACIDO_LIMPIEZA, VOLUMEN_DEL_SISTEMA_NO_ACIDO_LIMPIEZA, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, NUMERO_DE_ETAPAS, VOLUMEN_DEL_SISTEMA_ACIDO, VOLUMEN_DEL_SISTEMA_NO_ACIDO, VOLUMEN_DE_DIVERGENTE, VOLUMEN_DE_N2,
        CALIDAD_DE_ESPUMA, VOLUMEN_DE_PRECOLCHON_N2, VOLUMEN_DE_DESPLAZAMIENTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?)`,     
    loadSave: `SELECT * FROM _IntervencionesEstimulacionsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesEstimulacions WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_ACIDO_QUERY = {
    save: `INSERT INTO _IntervencionesAcidoSave (
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_GEL_LINEAL, MODULO_YOUNG_ARENA,
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
         ?, ?, ?, ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesAcido (
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_GEL_LINEAL, MODULO_YOUNG_ARENA,
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
         ?, ?, ?, ?, ?, ?)`,     
    loadSave: `SELECT * FROM _IntervencionesAcidoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesAcido WHERE TRANSACTION_ID = ?`    
}

const INSERT_INTERVENTION_APUNTALADO_QUERY = {
    save: `INSERT INTO _IntervencionesApuntaladoSave (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_DE_APUNTALANTE, VOLUMEN_DE_GEL_DE_FRACTURA, VOLUMEN_DESPLAZAMIENTO,
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
         ?, ?, ?, ?)`,
    submit: `INSERT INTO IntervencionesApuntalado (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_DE_APUNTALANTE, VOLUMEN_DE_GEL_DE_FRACTURA, VOLUMEN_DESPLAZAMIENTO,
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
         ?, ?, ?, ?)`,     
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
    loadSave: `SELECT * FROM _IntervencionesLabTestsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesLabTests WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_ESTIMULACION_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaEstimulacionSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesCedulaEstimulacion (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesCedulaEstimulacionSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaEstimulacion WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_ACIDO_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaAcidoSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesCedulaAcido (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesCedulaAcidoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaAcido WHERE TRANSACTION_ID = ?`    
}

const INSERT_CEDULA_APUNTALADO_QUERY = {
    save: `INSERT INTO _IntervencionesCedulaApuntaladoSave (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`   ,
    submit: `INSERT INTO IntervencionesCedulaApuntalado (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, TRANSACTION_ID) VALUES ?`        ,
    loadSave: `SELECT * FROM _IntervencionesCedulaApuntaladoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesCedulaApuntalado WHERE TRANSACTION_ID = ?`    
}

const INSERT_LAB_RESULTS_QUERY = {
    save: `INSERT INTO _IntervencionesLabResultsSave (
        RESULT_ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, SISTEMA, 
        TIEMPO_DE_ROMPIMIENTO, INTERFASE, SOLIDOS_DESPUES_DE_FILTRAR, RESULTADO, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabResults (
        RESULT_ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, SISTEMA, 
        TIEMPO_DE_ROMPIMIENTO, INTERFASE, SOLIDOS_DESPUES_DE_FILTRAR, RESULTADO, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesLabResultsSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesLabResults WHERE TRANSACTION_ID = ?`    
}

const INSERT_LAB_ACIDO_QUERY = {
    save: `INSERT INTO _IntervencionesLabTestsAcidoSave (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, SISTEMA_ACIDO_SOLUBILIDAD, PESO_MUESTRA_INICIAL, 
        PESO_MUESTRA_FINAL, SOLUBILIDAD, SISTEMA_ACIDO_GRABADO_DE_NUCLEOS, NUCLEO_DE_FORMACION, 
        GRABADO, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, TIEMPO_DE_RETICULACION, 
        PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTestsAcido (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, SISTEMA_ACIDO_SOLUBILIDAD, PESO_MUESTRA_INICIAL, 
        PESO_MUESTRA_FINAL, SOLUBILIDAD, SISTEMA_ACIDO_GRABADO_DE_NUCLEOS, NUCLEO_DE_FORMACION, 
        GRABADO, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, TIEMPO_DE_RETICULACION, 
        PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesLabTestsAcidoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesLabTestsAcido WHERE TRANSACTION_ID = ?`    
}

const INSERT_LAB_APUNTALADO_QUERY = {
    save: `INSERT INTO _IntervencionesLabTestsApuntaladoSave (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, 
        TIEMPO_DE_RETICULACION, PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL, TAMANO_DEL_APUNTALANTE, 
        GRAVEDAD_ESPECIFICA, ESFERICIDAD, REDONDEO, TURBIDEZ, RESISTENCIA, 
        PRUEBA_DE_SOLUBILIDAD_CON_ACIDO, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesLabTestsApuntalado (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, 
        TIEMPO_DE_RETICULACION, PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL, TAMANO_DEL_APUNTALANTE, 
        GRAVEDAD_ESPECIFICA, ESFERICIDAD, REDONDEO, TURBIDEZ, RESISTENCIA, 
        PRUEBA_DE_SOLUBILIDAD_CON_ACIDO, TRANSACTION_ID) VALUES ?`,
    loadSave: `SELECT * FROM _IntervencionesLabTestsApuntaladoSave WHERE TRANSACTION_ID = ?`,
    loadTransaction: `SELECT * FROM IntervencionesLabTestsApuntalado WHERE TRANSACTION_ID = ?`    
}

const INSERT_COSTS_QUERY = {
    save: `INSERT INTO _IntervencionesEstimatedCostsSave (
        COST_ID, INTERVENTION_ID, ITEM, COMPANY, COST, TRANSACTION_ID) VALUES ?`,
    submit: `INSERT INTO IntervencionesEstimatedCosts (
        COST_ID, INTERVENTION_ID, ITEM, COMPANY, COST, TRANSACTION_ID) VALUES ?`,
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
        TRANSACTION_ID, USER_ID, WELL_FORMACION_ID, TIPO_DE_INTERVENCIONES) VALUES
        (?, ?, ?, ?)`,
    submit: `INSERT INTO Transactions (
        TRANSACTION_ID, USER_ID, FIELD_FORMACION_ID, WELL_FORMACION_ID) VALUES
        (?, ?, ?, ?)`, 
}


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
        console.log(err)
        console.log(results)
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
    console.log('queirying well afroso', action)
    console.log(INSERT_WELL_AFOROS_QUERY[action])
  connection.query(INSERT_WELL_AFOROS_QUERY[action], [transID], (err, results) => {
    console.log('i didi it', err)
    console.log(results)
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
export const getLabResults = async (transID, action, cb) => {
    connection.query(INSERT_LAB_RESULTS_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getLabAcido = async (transID, action, cb) => {
    connection.query(INSERT_LAB_ACIDO_QUERY[action], [transID], (err, results) => {
        cb(results)
    })
}
export const getLabApuntalado = async (transID, action, cb) => {
    connection.query(INSERT_LAB_APUNTALADO_QUERY[action], [transID], (err, results) => {
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


  console.log('inside create', action)

  const finalObj = {}
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


  let { subdireccion, activo, campo, pozo, formacion } = finalObj.fichaTecnicaDelPozoHighLevel

  let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field } = finalObj.fichaTecnicaDelCampo

  let { intervaloProductor, espesorBruto, espesorNeto, caliza,
    dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha,
    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, historialIntervencionesData } = finalObj.fichaTecnicaDelPozo
  
  let { layerData, mudLossData } = finalObj.evaluacionPetrofisica

  let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
    tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase,
    diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
    volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular } = finalObj.mecanicoYAparejoDeProduccion

  let {pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
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

  let { presionDataCampo, presionDataPozo } = finalObj.historicoDePresion

  let { salinidad, qw, estrangulado, tsep, rga, ptp, psep, ttp, qg, tbaj, ph, pbaj, ql, tiempo, fecha, qo, produccionData } = finalObj.historicoDeProduccion

  let wellLogFile = finalObj.evaluacionPetrofisica.imgName
  let wellBoreFile = finalObj.mecanicoYAparejoDeProduccion.imgName
  let sistemasArtificialesFile = finalObj.sistemasArtificialesDeProduccion.imgName

  let labResultsFile
  let simResultsFile
  let incProdFile



  let { objetivo, alcances, tipoDeIntervenciones } = finalObj.objetivoYAlcancesIntervencion

  let { pruebasDeLaboratorioData } = finalObj.pruebasDeLaboratorio


  if (tipoDeIntervenciones === 'estimulacion') {
      //Propuesta Estimulaction
      var { intervalo, longitudDeIntervalo, volAparejo,
        capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = finalObj.propuestaEstimulacion

      //Simulacion Resultados Estimulacion
      var { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas,
        volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma,
        volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano } = finalObj.resultadosSimulacionEstimulacion

      //EstIncProd
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncEstim } = finalObj.estIncProduccionEstimulacion

      //Est Cost
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes,
        estCostDeN2, estCostHCL } = finalObj.estCostEstimulacion

      var { cedulaData } = finalObj.propuestaEstimulacion

      labResultsFile = finalObj.resultadosSimulacionEstimulacion.imgName
      incProdFile = finalObj.estIncProduccionEstimulacion.imgName
      simResultsFile = finalObj.resultadosSimulacionEstimulacion.imgName
  }
  else if (tipoDeIntervenciones === 'acido') {
      //Propuesta De Fracturamiento Acido
      var { intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = finalObj.propuestaAcido

      //Resultados De La Simulacion
      var { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = finalObj.resultadosSimulacionAcido

      //Estimacion Del Incremento De Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncAcido } = finalObj.estIncProduccionAcido

       //Estimacion De Costos
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo,
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac,
        estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante  } = finalObj.estCostAcido
 
      var { cedulaData } = finalObj.propuestaAcido

      labResultsFile = finalObj.resultadosSimulacionAcido.imgName
      incProdFile = finalObj.estIncProduccionAcido.imgName
      simResultsFile = finalObj.resultadosSimulacionAcido.imgName
  }

  else if (tipoDeIntervenciones === 'apuntalado') {
      //Propuesta De Fracturamiento Apuntalado
      var { intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante,
        volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = finalObj.propuestaApuntalado

      //Resultados de simulacion Apuntalado
      var { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
        fcd, presionNeta, eficienciaDeFluidoDeFractura  } = finalObj.resultadosSimulacionApuntalado


      //Est Inc Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncApuntalado } = finalObj.estIncProduccionApuntalado


      //Est Cost Apuntalado
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo,
        estCostDeSistemaNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac,
        estCostBacheNeutralizador, estCostProtectorDeArbol } = finalObj.estCostApuntalado

      var { cedulaData } = finalObj.propuestaApuntalado

      labResultsFile = finalObj.resultadosSimulacionApuntalado.imgName
      incProdFile = finalObj.estIncProduccionApuntalado.imgName
      simResultsFile = finalObj.resultadosSimulacionApuntalado.imgName
  }



  // write to db
  console.log('pozo', pozo)
  console.log('campo', campo)
  
  let fieldFormacionID = campo
  let wellFormacionID = pozo
  let interventionID = Math.floor(Math.random() * 1000000000)
  let inputInterventionID
  let intervalID
  let zoneID

  connection.beginTransaction(function(err) {
    if (err) { throw err; }

    connection.query((action === 'save' ? INSERT_FIELDS_QUERY.save : INSERT_FIELDS_QUERY.submit), [
    fieldFormacionID, subdireccion, activo, formacion,
    descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field, transactionID], (err, results) => {
      console.log('field', err)
      console.log('field', results)

      connection.query((action === 'save' ? INSERT_WELL_QUERY.save : INSERT_WELL_QUERY.submit), [
      wellFormacionID, subdireccion, activo,
      formacion, intervaloProductor, espesorBruto, espesorNeto, caliza,
      dolomia, arcilla, porosidad, permeabilidad, sw,
      caa, cga, tipoDePozo, pwsFecha, pwfFecha,
      deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador,
      profSensorPYT, tipoDeSistemo, transactionID ], (err, results) => {
        console.log('well', err)
        console.log('well', results)

        let values = []

        historialIntervencionesData.forEach(i => {
          inputInterventionID = Math.floor(Math.random() * 1000000000)
          values.push([wellFormacionID, inputInterventionID, i.fecha, i.intervenciones, transactionID])
        })

        connection.query((action === 'save' ? INSERT_HIST_INTERVENCIONES_QUERY.save : INSERT_HIST_INTERVENCIONES_QUERY.submit), [values], (err, results) => {
          console.log('user input intervention', err)
          console.log('user input intervention', results)

          values = []

          layerData.forEach(i => {
            intervalID = Math.floor(Math.random() * 1000000000)
            values.push([intervalID, wellFormacionID, i.interval, i.cimaMD, i.baseMD,
              i.cimaMV, i.baseMV, i.vArc, i.porosity, i.sw, i.dens, i.resis, i.perm, transactionID])
          })

          connection.query((action === 'save' ? INSERT_LAYER_QUERY.save : INSERT_LAYER_QUERY.submit), [values], (err, results) => {
            console.log('layers', err)
            console.log('layers', results)

            values = []

            mudLossData.forEach(i => {
              zoneID = Math.floor(Math.random() * 1000000000)
              values.push([zoneID, wellFormacionID, i.cimaMD, i.baseMD, i.lodoPerdido, i.densidad, transactionID])
            })

            connection.query((action === 'save' ? INSERT_MUD_LOSS_QUERY.save : INSERT_MUD_LOSS_QUERY.submit), [values], (err, results) => {
              console.log('mud loss', err)
              console.log('mud loss', results)


              connection.query((action === 'save' ? INSERT_MECANICO_QUERY.save : INSERT_MECANICO_QUERY.submit), [
                wellFormacionID, tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
                tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase,
                diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
                volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular, transactionID
              ], (err, results) => {
                console.log('mecanico', err)
                console.log('mecanico', results)

                connection.query((action === 'save' ? INSERT_ANALISIS_AGUA_QUERY.save : INSERT_ANALISIS_AGUA_QUERY.submit), [
                    wellFormacionID, pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
                    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
                    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
                    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
                    densidadAt20, transactionID 
                ], (err, results) => {
                  console.log('agua', err)
                  console.log('agua', results)

                  let query = 'SELECT(1) FROM WellProductionSystemsEmboloViajero'

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

                    values = []

                    presionDataCampo.forEach(i => {
                      values.push([fieldFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr, transactionID])
                    })

                    connection.query((action === 'save' ? INSERT_FIELD_PRESSURE_QUERY.save : INSERT_FIELD_PRESSURE_QUERY.submit), [values], (err, results) => {
                      console.log('field pressure', err)
                      console.log('field pressure', results)

                      values = []

                      console.log(presionDataPozo)

                      presionDataPozo.forEach(i => {
                        values.push([wellFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr, transactionID])
                      })

                      connection.query((action === 'save' ? INSERT_WELL_PRESSURE_QUERY.save : INSERT_WELL_PRESSURE_QUERY.submit), [values], (err, results) => {
                        console.log('well pressure', err)
                        console.log('well pressure', results)

                        connection.query((action === 'save' ? INSERT_WELL_AFOROS_QUERY.save : INSERT_WELL_AFOROS_QUERY.submit), [
                        wellFormacionID, fecha, estrangulado, ptp, ttp, pbaj, tbaj, psep, tsep,
                        ql, qo, qg, qw, rga, salinidad, ph, transactionID], (err, results) => {
                          console.log('well aforos', err)
                          console.log('well aforos', results)

                          values = []
                          produccionData.forEach(i => {
                            values.push([wellFormacionID, i.fecha, i.dias, i.qo, i.qw, i.qg, i.qgl, i.np, i.wp, i.gp, i.gi, i.rga, i.fw, i.pozosProdActivos, transactionID])
                          })

                          connection.query((action === 'save' ? INSERT_WELL_PRODUCCION_QUERY.save : INSERT_WELL_PRODUCCION_QUERY.submit), [values], (err, results) => {
                            console.log('well prod', err)
                            console.log('well prod', results)

                            values = [
                              [wellFormacionID, 'Well Log', wellLogFile, transactionID],
                              [wellFormacionID, 'Well Bore Diagram', wellBoreFile, transactionID],
                              [wellFormacionID, 'Sistemas Artificiales', sistemasArtificialesFile, transactionID]
                            ]

                            connection.query((action === 'save' ? INSERT_WELL_IMAGE_QUERY.save : INSERT_WELL_IMAGE_QUERY.submit), [values], (err, results) => {
                              console.log('well img', err)
                              console.log('well img', results)

                              connection.query((action === 'save' ? INSERT_INTERVENTION_BASE_QUERY.save : INSERT_INTERVENTION_BASE_QUERY.submit), [
                                interventionID, wellFormacionID, objetivo, alcances, tipoDeIntervenciones, transactionID
                              ], (err, results) => {
                                console.log('intervention base', err)
                                console.log('intervention base', results)


                                query = tipoDeIntervenciones === 'estimulacion' ? (action === 'save' ? INSERT_INTERVENTION_ESIMULACION_QUERY.save : INSERT_INTERVENTION_ESIMULACION_QUERY.submit) : tipoDeIntervenciones === 'acido' ? (action === 'save' ? INSERT_INTERVENTION_ACIDO_QUERY.save : INSERT_INTERVENTION_ACIDO_QUERY.submit) : (action === 'save' ? INSERT_INTERVENTION_APUNTALADO_QUERY.save : INSERT_INTERVENTION_APUNTALADO_QUERY.submit)

                                values = tipoDeIntervenciones === 'estimulacion' ? [
                                    interventionID, wellFormacionID, intervalo, longitudDeIntervalo, volAparejo,
                                    capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                                    volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido,
                                    volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas,
                                    volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma,
                                    volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano,
                                    estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                    estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                    estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                    estIncGastoCompromisoQg, obervacionesEstIncEstim, transactionID
                                  ]

                                  : tipoDeIntervenciones === 'acido' ? [
                                      interventionID, wellFormacionID, intervalo,
                                      longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
                                      volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal,
                                      moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, 
                                      longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
                                      conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                      estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                      estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                      estIncGastoCompromisoQg, obervacionesEstIncAcido, transactionID
                                    ] : [
                                      interventionID, wellFormacionID, intervalo,
                                      longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante,
                                      volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido,
                                      moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos,
                                      longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
                                      fcd, presionNeta, eficienciaDeFluidoDeFractura,
                                      estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                      estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                      estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                      estIncGastoCompromisoQg, obervacionesEstIncApuntalado, transactionID
                                    ]


                                connection.query(query, values, (err, results) => {
                                  console.log('intervention', err)
                                  console.log('intervention', results)

                                  values = []

                                  const labResultValues = []
                                  const labExtraValues = []

                                  console.log(pruebasDeLaboratorioData)
                                  if (pruebasDeLaboratorioData && pruebasDeLaboratorioData[0].sistemasTable && pruebasDeLaboratorioData[0].sistemasTable.length > 0) {
                                    pruebasDeLaboratorioData.forEach(i => {
                                    const labID = Math.floor(Math.random() * 1000000000)
                                    values.push([labID, interventionID, wellFormacionID, i.type, i.fechaMuestreo, i.fechaPrueba, i.compania, i.superviso, i.obervaciones, transactionID])
                                    if (i.sistemasTable) {
                                        i.sistemasTable.forEach(i => {
                                          let resultID = Math.floor(Math.random() * 1000000000)
                                          labResultValues.push([resultID, labID, interventionID, wellFormacionID, i.sistem, i.tiempoRompimiento, i.interfase, i.solidosFiltrar, i.resultado, transactionID])
                                        })
                                    }
                                    let newRow = [labID, interventionID, wellFormacionID, i.contenidoDeAceite, i.contenidoDeAgua, i.contenidoDeEmulsion, i.contenidoDeSolidos, i.tipoDeSolidos, i.densidadDelAceite, i.densidadDelAgua, i.densidadDeLaEmulsion, i.contenidoDeAsfaltenos, i.contenidoDeParafinas, i.contenidoDeResinas, i.indiceDeEstabilidadDelColoidal, i.indiceDeEstabilidadDelAgua, i.pH, i.salinidad, i.viscosidadDelAceite, transactionID]
                                    if (tipoDeIntervenciones === 'acido') {
                                      newRow = newRow.slice(0, -1)
                                      newRow = newRow.concat([i.sistemAcido, i.pesoMuestraInicial, i.pesoMuestraFinal, i.solubilidad, i.sistemAcidoGrabado, i.nucleoDeFormacion, i.grabado, i.tipoDeGelLineal, i.viscosidadDelGelLineal, i.tiempoDeReticulacion, i.pHGelLineal, i.tiempoDeRompedorDelGel, transactionID])
                                      labExtraValues.push(newRow)
                                    }
                                    else if (tipoDeIntervenciones === 'apuntalado') {
                                      newRow = newRow.slice(0, -1)
                                      newRow = newRow.concat([i.tipoDeGelLineal, i.viscosidadDelGelLineal, i.tiempoDeReticulacion, i.pHGelLineal, i.tiempoDeRompedorDelGel, i.tamanoDelApuntalante, i.gravedadEspecifica, i.esfericidad, i.redondeo, i.turbidez, i.psi, i.pruebaDeSolubilidadConAcida, transactionID])
                                      labExtraValues.push(newRow)
                                    }
                                  })
                                  
                                  }
                                  else {
                                    INSERT_LAB_TEST_QUERY.save = `SELECT(1) FROM Users LIMIT 1`
                                    INSERT_LAB_RESULTS_QUERY.save = `SELECT(1) FROM Users LIMIT 1`
                                  }

                                  connection.query((action === 'save' ? INSERT_LAB_TEST_QUERY.save : INSERT_LAB_TEST_QUERY.submit), [values], (err, results) => {
                                    console.log('lab tests', err)
                                    console.log('lab tests', results)

                                    query = tipoDeIntervenciones === 'estimulacion' ? (action === 'save' ? INSERT_CEDULA_ESTIMULACION_QUERY.save : INSERT_CEDULA_ESTIMULACION_QUERY.submit) : tipoDeIntervenciones === 'acido' ? (action === 'save' ? INSERT_CEDULA_ACIDO_QUERY.save : INSERT_CEDULA_ACIDO_QUERY.submit) : (action === 'save' ? INSERT_CEDULA_APUNTALADO_QUERY.save : INSERT_CEDULA_APUNTALADO_QUERY.submit)

                                    values = []

                                    if (tipoDeIntervenciones === 'estimulacion') {
                                      if (cedulaData) {
                                        cedulaData.forEach(i => {
                                          let cedulaID = Math.floor(Math.random() * 1000000000)
                                          values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, transactionID])
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
                                          values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.tipoDeApuntalante, i.concentraciDeApuntalante, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, transactionID])
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

                                      connection.query((action === 'save' ? INSERT_LAB_RESULTS_QUERY.save : INSERT_LAB_RESULTS_QUERY.submit), [labResultValues], (err, results) => {
                                        console.log('lab results', err)
                                        console.log('lab results', results)

                                        query =  tipoDeIntervenciones === 'estimulacion' ? `select(1) FROM Users LIMIT 1` : tipoDeIntervenciones === 'acido' ? (action === 'save' ? INSERT_LAB_ACIDO_QUERY.save : INSERT_LAB_ACIDO_QUERY.submit) : (action === 'save' ? INSERT_LAB_APUNTALADO_QUERY.save : INSERT_LAB_APUNTALADO_QUERY.submit)
                                        
                                        connection.query(query, [labExtraValues], (err, results) => {
                                          console.log('lab extras', err)
                                          console.log('lab extras', results)


                                          values = []
                                          if (tipoDeIntervenciones === 'estimulacion') {
                                            Object.keys(finalObj.estCostEstimulacion).forEach(key => {
                                              if (key !== 'checked') {
                                                let obj = finalObj.estCostEstimulacion[key]
                                                let costID = Math.floor(Math.random() * 1000000000)
                                                values.push([costID, interventionID, key, obj.company, obj.cost, transactionID])
                                              }
                                            })
                                          }
                                          else if (tipoDeIntervenciones === 'acido') {
                                            Object.keys(finalObj.estCostAcido).forEach(key => {
                                              if (key !== 'checked') {
                                                let obj = finalObj.estCostAcido[key]
                                                let costID = Math.floor(Math.random() * 1000000000)
                                                values.push([costID, interventionID, key, obj.company, obj.cost, transactionID])
                                              }
                                            })
                                          }
                                          else if (tipoDeIntervenciones === 'apuntalado') {
                                            Object.keys(finalObj.estCostApuntalado).forEach(key => {
                                              if (key !== 'checked') {
                                                let obj = finalObj.estCostApuntalado[key]
                                                let costID = Math.floor(Math.random() * 1000000000)
                                                values.push([costID, interventionID, key, obj.company, obj.cost, transactionID])
                                              }
                                        
                                            })
                                          }

                                          connection.query((action === 'save' ? INSERT_COSTS_QUERY.save : INSERT_COSTS_QUERY.submit), [values], (err, results) => {
                                            console.log('costs', err)
                                            console.log('costs', results)

                                            values = [
                                              [interventionID, 'Lab Results', labResultsFile, transactionID],
                                              [interventionID, 'Est Inc Prod', incProdFile, transactionID],
                                              [interventionID, 'Simulation Results', simResultsFile, transactionID]
                                            ]

                                            connection.query((action === 'save' ? INSERT_INTERVENTION_IMAGE_QUERY.save : INSERT_INTERVENTION_IMAGE_QUERY.submit), [values], (err, results) => {
                                              console.log('intervention img', err)
                                              console.log('intervention img', results)

                                              values = action === 'save' ? [transactionID, userID, wellFormacionID, tipoDeIntervenciones] : [transactionID, userID, fieldFormacionID, wellFormacionID]
                                              connection.query((action === 'save' ? INSERT_TRANSACTION.save : INSERT_TRANSACTION.submit), values, (err, results) => {
                                                console.log('transaction', err)
                                                console.log('transaction', results)

                                                connection.commit(function(err) {
                                                    if (err) {
                                                      cb(err)
                                                      return connection.rollback(function() {
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
}