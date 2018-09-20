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
                        PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, TRANSACTION_ID) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?)` : `INSERT INTO WellProductionSystemsBombeoHidraulico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ, TRANSACTION_ID) VALUES
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