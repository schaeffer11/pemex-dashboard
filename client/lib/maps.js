import React from 'react'

//Well Forms
import TecnicaDelPozoHighLevel from '../components/Layout/InputsUI/PozoForms/TecnicaDelPozoHighLevel'
import TecnicaDelPozo from '../components/Layout/InputsUI/PozoForms/TecnicaDelPozo'
import TecnicaDelCampo from '../components/Layout/InputsUI/PozoForms/TecnicaDelCampo'
import SistemasArtificialesDeProduccion from '../components/Layout/InputsUI/PozoForms/SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from '../components/Layout/InputsUI/PozoForms/EvaluacionPetrofisica'
import MecanicoYAparejo from '../components/Layout/InputsUI/PozoForms/MecanicoYAparejo'
import HistoricoDePresionCampo from '../components/Layout/InputsUI/PozoForms/HistoricoDePresionCampo'
import HistoricoDePresionPozo from '../components/Layout/InputsUI/PozoForms/HistoricoDePresionPozo'
import HistoricoDeProduccion from '../components/Layout/InputsUI/PozoForms/HistoricoDeProduccion'
import AnalisisDelAgua from '../components/Layout/InputsUI/PozoForms/AnalisisDelAgua'

//Intervention Forms
import PruebasDeLaboratorio from '../components/Layout/InputsUI/IntervencionesForms/PruebasDeLaboratorio'

import PropuestaDeEstimulacion from '../components/Layout/InputsUI/IntervencionesForms/Estimulacion/PropuestaDeEstimulacion'
import ResultadosDeLaSimulacionEstimulacion from '../components/Layout/InputsUI/IntervencionesForms/Estimulacion/ResultadosDeLaSimulacionEstimulacion'
import EstimacionIncProduccionEstimulacion from '../components/Layout/InputsUI/IntervencionesForms/Estimulacion/EstimacionIncProduccionEstimulacion'
import EstimacionCostosEstimulacion from '../components/Layout/InputsUI/IntervencionesForms/Estimulacion/EstimacionCostosEstimulacion'

import PropuestaDeAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/PropuestaDeAcido'
import PruebasDeLaboratorioAcidoExtra from '../components/Layout/InputsUI/IntervencionesForms/Acido/PruebasDeLaboratorioAcidoExtra'
import ResultadosDeLaSimulacionAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/ResultadosDeLaSimulacionAcido'
import EstimacionIncProduccionAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/EstimacionIncProduccionAcido'
import EstimacionCostosAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/EstimacionCostosAcido'

import PropuestaDeApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/PropuestaDeApuntalado'
import PruebasDeLaboratorioApuntaladoExtra from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/PruebasDeLaboratorioApuntaladoExtra'
import ResultadosDeLaSimulacionApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/EstimacionIncProduccionApuntalado'
import EstimacionCostosApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/EstimacionCostosApuntalado'



export const pagesPozo = {
      tecnicaDelPozoHighLevel: {
        key: 'tecnicaDelPozoHighLevel',
        form: <TecnicaDelPozoHighLevel />,
        title: 'Ficha Tecnica del Pozo'
      },
      tecnicaDelPozo: {
        key: 'tecnicaDelPozo',
        form: <TecnicaDelPozo />,
        title: 'Ficha Tecnica del Pozo'
      },
      tecnicaDelCampo: {
        key: 'tecnicaDelCampo',
        form: <TecnicaDelCampo />,
        title: 'Ficha Tecnica del Campo'
      },
      sistemasArtificialesDeProduccion: {
        key: 'sistemasArtificialesDeProduccion',
        form: <SistemasArtificialesDeProduccion />,
        title: 'Informacion de Sistemas Artificiales de Produccion'
      },
      evaluacionPetrofisica: {
        key: 'evaluacionPetrofisica',
        form: <EvaluacionPetrofisica />,
        title: 'Evaluacion Petrofisica'
      },
      mecanicoYAparejo: {
        key: 'mecanicoYAparejo',
        form: <MecanicoYAparejo />,
        title: 'Edo. Mecanico y Aparejo de Produccion'
      },
      historicoDePresionCampo: {
        key: 'historicoDePresionCampo',
        form: <HistoricoDePresionCampo />,
        title: 'Historico de Presion Campo'
      },
      historicoDePresionPozo: {
        key: 'historicoDePresionPozo',
        form: <HistoricoDePresionPozo />,
        title: 'Historico de Presion Pozo'
      },
      historicoDeProduccion: {
        key: 'historicoDeProduccion',
        form: <HistoricoDeProduccion />,
        title: 'Historico de Produccion'
      },
      analisisDelAgua: {
        key: 'analisisDelAgua',
        form: <AnalisisDelAgua />,
        title: 'Analisis del Agua (Stiff & Davis)'
      }
    }

export const pagesIntervenciones = {
      estimulacion: {
            propuestaEstimulacion: {
              key: 'propuestaEstimulacion',
              form: <PropuestaDeEstimulacion />,
              title: 'Propuesta de Tratamiento de Estimulacion'
            },
            pruebasDeLaboratorio: {
              key: 'pruebasDeLaboratorio',
              form: <PruebasDeLaboratorio />,
              title: 'Pruebas de Laboratorio'
            },
            resultadosDeLaSimulacion: {
              key: 'resultadosDeLaSimulacion',
              form: <ResultadosDeLaSimulacionEstimulacion />,
              title: 'Resultados de la Simulacion de Estimulacion'
            },
            estimacionDelIncremento: {
              key: 'estimacionDelIncremento',
              form: <EstimacionIncProduccionEstimulacion />,
              title: 'Estimacion del Incremento de Produccion'
            },
            estimacionDeCostos: {
              key: 'estimacionDeCostos',
              form: <EstimacionCostosEstimulacion />,
              title: 'Estimacion de Costos de Estimulacion'
            },
      },
      acido: {
            propuestaAcido: {
              key: 'propuestaAcido',
              form: <PropuestaDeAcido />,
              title: 'Propuesta de Fracturamiento Acido'
            },
            pruebasDeLaboratorio: {
              key: 'pruebasDeLaboratorio',
              form: <PruebasDeLaboratorio />,
              title: 'Pruebas de Laboratorio'
            },
            pruebasDeLaboratorioExtra: {
              key: 'pruebasDeLaboratorioExtra',
              form: <PruebasDeLaboratorioAcidoExtra />,
              title: 'Pruebas de Laboratorio - Fracturamiento Acido'
            },
            resultadosDeLaSimulacion: {
              key: 'resultadosDeLaSimulacion',
              form: <ResultadosDeLaSimulacionAcido />,
              title: 'Resultados de la Simulacion de Fracturamiento Acido'
            },
            estimacionDelIncremento: {
              key: 'estimacionDelIncremento',
              form: <EstimacionIncProduccionAcido />,
              title: 'Estimacion del Incremento de Produccion'
            },
            estimacionDeCostos: {
              key: 'estimacionDeCostos',
              form: <EstimacionCostosAcido />,
              title: 'Estimacion de Costos de Fracturamiento Acido'
            },
      },
      apuntalado: {
            propuestaApuntalado: {
              key: 'propuestaApuntalado',
              form: <PropuestaDeApuntalado />,
              title: 'Propuesta de Fracturamiento Apuntalado'
            },
            pruebasDeLaboratorio: {
              key: 'pruebasDeLaboratorio',
              form: <PruebasDeLaboratorio/>,
              title: 'Pruebas de Laboratorio'
            },
            pruebasDeLaboratorioExtra: {
              key: 'pruebasDeLaboratorioExtra',
              form: <PruebasDeLaboratorioApuntaladoExtra />,
              title: 'Pruebas de Laboratorio de Fracturamiento Apuntalado'
            },
            resultadosDeLaSimulacion: {
              key: 'resultadosDeLaSimulacion',
              form: <ResultadosDeLaSimulacionApuntalado />,
              title: 'Resultados de la Simulacion de Fracturamiento Apuntalado'
            },
            estimacionDelIncremento: {
              key: 'estimacionDelIncremento',
              form: <EstimacionIncProduccionApuntalado />,
              title: 'Estimacion del Incremento de Produccion'
            },
            estimacionDeCostos: {
              key: 'estimacionDeCostos',
              form: <EstimacionCostosApuntalado />,
              title: 'Estimacion de Costos de Fracturamiento Apuntalado'
            },
      }
    }
