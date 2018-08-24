import React from 'react'

import TecnicaDelPozoHighLevel from '../components/Layout/InputsUI/PozoForms/TecnicaDelPozoHighLevel'
import TecnicaDelPozo from '../components/Layout/InputsUI/PozoForms/TecnicaDelPozo'
import TecnicaDelCampo from '../components/Layout/InputsUI/PozoForms/TecnicaDelCampo'
import SistemasArtificialesDeProduccion from '../components/Layout/InputsUI/PozoForms/SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from '../components/Layout/InputsUI/PozoForms/EvaluacionPetrofisica'
import MecanicoYAparejo from '../components/Layout/InputsUI/PozoForms/MecanicoYAparejo'
import HistoricoDePresion from '../components/Layout/InputsUI/PozoForms/HistoricoDePresion'
import HistoricoDeProduccion from '../components/Layout/InputsUI/PozoForms/HistoricoDeProduccion'
import AnalisisDelAgua from '../components/Layout/InputsUI/PozoForms/AnalisisDelAgua'



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
      historicoDePresion: {
        key: 'historicoDePresion',
        form: <HistoricoDePresion />,
        title: 'Historico de Presion'
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

    }
