import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setPruebasDeLaboratorioData } from '../../../../../redux/actions/intervencionesEstimulacion'
import { options as typeOptions } from '../PruebasDeLaboratorio'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import Select from 'react-select'

const interfaseOptions = [
  { label: 'Definida', value: 'definida' },
  { label: 'Difusa', value: 'difusa' },
  { label: 'Obscura', value: 'obscura' }
]

const solidosFiltrarOptions = [
  { label: '0', value: 'none'},
  { label: 'Trazas', value: 'trazas'},
  { label: 'Moderada Sedimentacion', value: 'moderadaSedimentacion'},
  { label: 'Alta Sedimentacion', value: 'altaSedientacion'},
]

const resultadoOptions = [
  { label: 'Compatible', value: 'compatible'},
  { label: 'No Compatible', value: 'noCompatible'},
]

@autobind class PruebasDeLaboratorioAcidoExtra extends Component {
  constructor(props) {
    super(props)
    
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let pruebas = []

    pruebasDeLaboratorioData.map((prueba, i) => {
      if(!prueba.hasOwnProperty('edited')){
        pruebas.push({ ...prueba,
          edited: '',        
          contenidoDeAceite: '',
          contenidoDeAgua: '',
          contenidoDeEmulsion: '',
          contenidoDeSolidos: '',
          tipoDeSolidos: '',
          densidadDelAceite: '',
          densidadDelAgua: '',
          densidadDeLaEmulsion: '',
          contenidoDeAsfaltenos: '',
          contenidoDeParafinas: '',
          contenidoDeResinas: '',
          indiceDeEstabilidadDelColoidal: '',
          indiceDeEstabilidadDelAgua: '',
          pH: '',
          salinidad: '',
          viscosidadDelAceite: '',
          sistemAcido: '',
          pesoMuestraInicial: '',
          pesoMuestraFinal: '',
          solubilidad: '',
          sistemaAcidoGrabado: '',
          nucleoDeFormacion: '',
          grabado: '',
          tipoDeGelLineal: '',
          viscosidadDelGelLineal: '',
          tiempoDeReticulacion: '',
          pHGelLineal: '',
          tiempoDeRompedorDelGel: '',
          sistemasTable: [{
            sistem: '',
            tiempoRompimiento: '',
            interfase: '',
            solidosFiltrar: '',
            resultado: '',
          }],
          obervaciones: ''
        })
      }else {
        pruebas.push(prueba)
      }
    })

    setPruebasDeLaboratorioData(pruebas)
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  

  updateValue(value, event){
    if(event === undefined)
      return 

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()

    let index = event.target.getAttribute('index')
    let pruebas = {...pruebasDeLaboratorio}
    pruebas.pruebasDeLaboratorioData[index][event.target.name] = value
    setPruebasDeLaboratorioData(pruebas.pruebasDeLaboratorioData)
  }

  makeCaracterizacionForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='caracterizacion-form' >
        <div className='header'>
          Caracterización de los Fluidos Producidos
        </div>
        <InputRow header="Contenido de aceite" name='contenidoDeAceite' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAceite} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de agua" name='contenidoDeAgua' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de emulsión" name='contenidoDeEmulsion' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeEmulsion} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de sólidos" name='contenidoDeSolidos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeSolidos} onChange={this.updateValue} index={index}/>
        <InputRow header="Tipo de sólidos" name='tipoDeSolidos' value={pruebasDeLaboratorioData[index].tipoDeSolidos} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad del aceite" name='densidadDelAceite' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAceite} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad del agua" name='densidadDelAgua' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad de la emulsión" name='densidadDeLaEmulsion' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDeLaEmulsion} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de asfaltenos" name='contenidoDeAsfaltenos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAsfaltenos} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de parafinas" name='contenidoDeParafinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeParafinas} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de resinas" name='contenidoDeResinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeResinas} onChange={this.updateValue} index={index}/>
        <InputRow header="Índice de estabilidad coloidal" name='indiceDeEstabilidadDelColoidal' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelColoidal} onChange={this.updateValue} index={index}/>
        <InputRow header="Índice de estabilidad del agua" name='indiceDeEstabilidadDelAgua' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="pH" name='pH' unit="adim" value={pruebasDeLaboratorioData[index].pH} onChange={this.updateValue} index={index}/>
        <InputRow header="Salinidad" name='salinidad' unit="ppm" value={pruebasDeLaboratorioData[index].salinidad} onChange={this.updateValue} index={index}/>
        <InputRow header="Viscosidad del aceite" name='viscosidadDelAceite' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelAceite} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeSolubilidadForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio 
    
    return (
      <div className='solubilidad-form' >
        <div className='header'>
          Prueba de Solubilidad (Recorte de Canal o Nucleo)
        </div>
        <InputRowUnitless header="Sistema Ácido" name='sistemAcido' value={pruebasDeLaboratorioData[index].sistemAcido} onChange={this.updateValue} index={index}/>
        <InputRow header="Peso muestra inicial" name='pesoMuestraInicial' unit="gr" value={pruebasDeLaboratorioData[index].pesoMuestraInicial} onChange={this.updateValue} index={index}/>
        <InputRow header="Peso muestra final" name='pesoMuestraFinal' unit="gr" value={pruebasDeLaboratorioData[index].pesoMuestraFinal} onChange={this.updateValue} index={index}/>
        <InputRow header="Solubilidad" name='solubilidad' unit="%" value={pruebasDeLaboratorioData[index].solubilidad} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeGrabadoNucleosForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    
    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba de Grabado de Nucleos
        </div>
        <InputRowUnitless header="Sistema ácido" name='sistemAcido' value={pruebasDeLaboratorioData[index].sistemAcido} onChange={this.updateValue} index={index}/>
        <InputRowUnitless header="Nucleo de formación" name='nucleoDeFormacion' value={pruebasDeLaboratorioData[index].nucleoDeFormacion} onChange={this.updateValue} index={index}/>
        <InputRow header="Grabado" name='grabado' unit="gr" value={pruebasDeLaboratorioData[index].grabado} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeGelLinealForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    
    return (
      <div className='gel-lineal-form' >
        <div className='header'>
          Prueba Para Gel Lineal
        </div>
        <InputRowUnitless header="Tipo de gel lineal" name='tipoDeGelLineal' value={pruebasDeLaboratorioData[index].tipoDeGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Viscosidad del gel lineal" name='viscosidadDelGelLineal' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Tiempo de reticulación" name='tiempoDeReticulacion' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeReticulacion} onChange={this.updateValue} index={index}/>
        <InputRow header="pH gel lineal" name='pHGelLineal' unit="adim" value={pruebasDeLaboratorioData[index].pHGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Tiempo de rompedor del gel" name='tiempoDeRompedorDelGel' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeRompedorDelGel} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  renderEditable(cellInfo) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let copy = JSON.parse(JSON.stringify(pruebasDeLaboratorioData))
          copy[cellInfo.column.tableIndex]["sistemasTable"][cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPruebasDeLaboratorioData(copy)
        }}>{pruebasDeLaboratorioData[cellInfo.column.tableIndex]["sistemasTable"][cellInfo.index][cellInfo.column.id]}
        </div>
    );
  }

  addNewRow(event, i) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData[i].sistemasTable

    copy[0].length = 2

    let val =  ([...copy, {index: copy.length, sistem: '', tiempoRompimiento: '', interfase: '', solidosFiltrar: '', resultado: '' , length: copy.length + 1}])
    pruebasDeLaboratorioData[i].sistemasTable = val
    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }

  deleteRow(state, rowInfo, column, instance) {

    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData
    let i = column.tableIndex
    let data = copy[i].sistemasTable

    return {
      onClick: e => {
        if (column.id === 'delete' && data.length > 1) {
          data.splice(rowInfo.original.index, 1)

          data.forEach((i, index) => {
            i.index = index
            i.length = data.length
          })

          setPruebasDeLaboratorioData(copy)
        }
      }
    }
  }

  handleSelect(row, e, i, key) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData

    copy[i].sistemasTable[row.index][key] = e
    setPruebasDeLaboratorioData(copy)
  }


  makeSistemaTable(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let data = pruebasDeLaboratorioData[index].sistemasTable

    if(data == undefined)
      return null

    let columns = [
      {
        Header: '',
        accessor: 'delete',
        width: 35,
        resizable: false,
        Cell: row => {
          if (row.original.length > 1) {
            return (<div style={{color: 'white', background: 'red', borderRadius: '4px', textAlign: 'center', cursor: 'pointer'}}>X</div>)
          }
        }
      }, {
        Header: 'Sistema',
        accessor: 'sistem',
        cell: 'renderEditable',
      }, {
        Header: 'Tiempo de rompimiento (Min)',
        accessor: 'tiempoRompimiento',
        cell: 'renderEditable',
      }, {
        Header: 'Interfase',
        accessor: 'interfase',
        style: {overflow: 'visible'},
        Cell: row => {
          return (<div>
            <Select
            className='input'
            simpleValue={true}
            options={interfaseOptions}
            name={name}
            value={interfaseOptions.find(i=> i.value === row.original.interfase) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'interfase')} 
          />
          </div>)
        }
      }, {
        Header: 'Solidos despues de filtrar',
        accessor: 'solidosFiltrar',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select
            className='input'
            simpleValue={true}
            options={solidosFiltrarOptions}
            name={name}
            value={solidosFiltrarOptions.find(i=> i.value === row.original.solidosFiltrar) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'solidosFiltrar')}
          />
          </div>)
        }
      }, {
        Header: 'Resultado',
        accessor: 'resultado',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select
            className='input'
            simpleValue={true}
            options={resultadoOptions}
            name={name}
            value={resultadoOptions.find(i=> i.value === row.original.resultado) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'resultado')} 
          />
          </div>)
        }
      }
    ]

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
      column.tableIndex = index
    })

    return (
      <div className="lab-results" style={{marginBot: '20px'}}>
        <div className='header'>
          Lab Test Results (spanish)
        </div>
        <div className='table-select'>
          <ReactTable
            name="sistemasTable"
            className="-striped"
            data={data}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={data.length}
            sortable={false}
            index={index}
            getTdProps={this.deleteRow}
          />
        </div>
        <button className='new-row-button' index={index} onClick={(e) => this.addNewRow(e, index)}> + </button>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl, e)
  }

  makeImageInput(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let imgURL = pruebasDeLaboratorioData[index].imgURL

    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Lab Evidence (spanish)
        </div>
        <input type='file' name='imgURL' accept="image/*" onChange={(e) => this.handleFileUpload(e, this.updateValue)} index={index}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  render() {
    let { setObervacionesPruebasLabAcido, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return pruebasDeLaboratorioData.map((form, i) =>      
      <div className="form pruebas-de-laboratorio-apuntalado-extra" key={`pruebasDeAcidoExtra_${i}`}>
         <div className="collapsable-section is-open">
            <div className="collapsable-title">
              <span className="left">{typeOptions.find(o => o.value === form.type) ? typeOptions.find(o => o.value === form.type).label : 'Falta tipo de análisis'}</span> 
              {form.fechaMuestreo &&
                <span className="right">Fecha: {form.fechaMuestreo}</span>}
            </div>
            <div className="collapsable-content">
              <div className='top'>
                <div className='left'>
                 { this.makeCaracterizacionForm(i) }
                </div>
                <div className='right'>
                  { this.makeSolubilidadForm(i) }
                  { this.makeGrabadoNucleosForm(i) }
                  { this.makeGelLinealForm(i) }
                </div>
              </div>
              <div className='bot'>
                { this.makeSistemaTable(i) }
                <TextAreaUnitless header="Observaciones" name='obervaciones' className={'obervaciones'} value={form.obervaciones} onChange={this.updateValue} index={i}/> 
                { this.makeImageInput(i) }
              </div>
           </div>
         </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'),
})

const mapDispatchToProps = dispatch => ({
  setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioAcidoExtra)


