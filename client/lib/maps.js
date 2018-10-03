import React from 'react'

//Well Forms
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

import PropuestaDeAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/PropuestaDeAcido'
import ResultadosDeLaSimulacionAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/ResultadosDeLaSimulacionAcido'
import EstimacionIncProduccionAcido from '../components/Layout/InputsUI/IntervencionesForms/Acido/EstimacionIncProduccionAcido'

import PropuestaDeApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/PropuestaDeApuntalado'
import ResultadosDeLaSimulacionApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from '../components/Layout/InputsUI/IntervencionesForms/Apuntalado/EstimacionIncProduccionApuntalado'



export const pagesPozo = {
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
              title: 'Estimacion de Costos de Fracturamiento Apuntalado'
            },
      }
    }



export const costMap = [{ 
  item: 'Sistemas selectivo para control de agua a base de cemento microfino', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema bache espaciador, desplazante y limpieza sistemas para control de agua a base de cemento microfino', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema modificador de permeabilidad para control y exclusión de agua', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema para control de agua de baja penetración', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Gelatina para control de agua', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema para aislamiento temporal de zonas productoras de agua y/o gas', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido con HCI para formación. No incluye el HCI.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido con HCI-HF.No incluye el HCI.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido emulsionado. No incluye el HCI.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido con alcohol. No incluye el HCI.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido retardado. No incluye el HCI.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas ácido orgánicos soluble en solvente. No incluye el solvente', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema no reactivo (aromático). No incluye el solvente', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema Oleoso', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Gel lineal', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Agua tratada', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Agua espumada', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema acuoso', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema no reactivo (alcohol).', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas divergentes quimicos polimérico.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas autodivergentes no reactivos', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema divergente a base de cloruros.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas para remoción de incrustaciones de sulfato de bario', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema reactivo para alta temperatura', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema Autodivergente reactivo', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido orgánico para control de finos', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido con HCI para limpieza de aparejo (HCI al 7.5%). No incluye el HCI. No el ncluye Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Bache inhibidor. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Bache neutralizador. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas ácidos con HCI para formación . No incluye el HCI. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema con ácidos retardados. No incluye HCI. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema con ácidos orgánicos solubles en solventes. No incluye el solvente. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema no reactivo (aromático). No incluye el solvente. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema oleoso. No incluye el solvente. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Gel lineal. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Agua tratada. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Agua espumada. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema acuoso. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistemas para remoción de incrustaciones de sulfato de bario. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Trabajos de bombeos diversos', 
  unit: 'Hora' 
}, { 
  item: 'Trabajos de mezclado y de homogeneización de fluidos diversos', 
  unit: 'Hora' 
}, { 
  item: 'Trabajos de llenado de pozo y prueba de admisión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Transporte de xileno propiedad de PEP en pipas de 20  m3 de la base del contratista a las instalaciones de PEP.', 
  unit: 'Viaje' 
}, { 
  item: 'Dispersante de asfáltenos', 
  unit: 'Litro' 
}, { 
  item: 'Inhibidor de asfáltenos', 
  unit: 'Litro' 
}, { 
  item: 'Inhibidor de parafinas', 
  unit: 'Litro' 
}, { 
  item: 'Acido clorhídrico (concentración máxima al 22%)', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema no ácido (Xileno)', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Agente abrasivo arena malla 20/40', 
  unit: 'Kilogramo' 
}, { 
  item: 'Equipo de fracturamiento de pozos', 
  unit: 'Trabajo' 
}, { 
  item: 'Sistema para fractura ácida. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Sistema ácido retardado gelificado. No incluye el Equipo de Alta Presión.', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Gel de fractura. No incluye el Equipo de Alta Presión', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Análisis de Mini Fall Off (MFO)', 
  unit: 'Trabajo' 
}, { 
  item: 'Mini frac', 
  unit: 'Trabajo' 
}, { 
  item: 'Apuntalante para fractura.', 
  unit: 'Saco (100 libras)' 
}, { 
  item: 'Transmisión en tiempo real', 
  unit: 'Trabajo' 
}, { 
  item: 'Servicios Generales', 
  unit: 'Varios' 
}, { 
  item: 'Renta de Barco', 
  unit: 'Días' 
}, { 
  item: 'Sistema Reactivo', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Nitrógeno', 
  unit: 'Metro cúbico' 
}, { 
  item: 'HCI', 
  unit: 'Metro cúbico' 
}, { 
  item: 'Protector de Árbol', 
  unit: 'Cantidad' 
}]
