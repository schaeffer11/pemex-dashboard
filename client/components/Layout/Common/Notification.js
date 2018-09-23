import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { setIsLoading } from '../../../redux/actions/global'
import 'react-toastify/dist/ReactToastify.css'

const Toasty = ({ type, notification }) => {
  let className
  switch (type) {
    case 'success':
      className = 'fa fa-check'
      break;
    case 'warning':
      className = 'fa fa-exclamation-triangle'
      break;
    case 'error':
      className = 'fa fa-times'
      break;
  
    default:
      className = ''
      break;
  }
  return (
    <div>
      <i className={className} /> {notification}
    </div>
  )
}

// class Notification extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       notify: false
//     }
//   }

//   componentDidUpdate(prevProps) {
//     const type = 'success'
//     const toastProps = {
//       position: 'top-right',
//       autoClose: false,
//       // hideProgressBar: false,
//       closeOnClick: true,
//       // pauseOnHover: true,
//       type,
//       newestOnTop: true,
//       draggable: true,
//       draggablePercent: 60,
//     }
//     const { isSaved } = this.props
//     if (isSaved) {
//       this.props.setSaved(false)
//       toast(<Toasty type={type} notification="successful save" />, { ...toastProps })
//     }
//   }

//   render() {
//     return <ToastContainer />
//   }
// }

const Notification = ({ saved, loaded, submitted, setLoading }) => {
  console.log('Notifying?', saved, loaded)
    const toastProps = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      newestOnTop: true,
      draggable: true,
      draggablePercent: 60,
    }
    const toastPropsCopy = { ...toastProps }
    let notification = ''
    if (saved !== null) {
      toastPropsCopy.type = saved
      notification = saved === 'success' ? '¡Exito! Su información se ha guardado' : '¡Error! Su información no se guardó'
      setLoading({ saved: null })
    } else if (loaded !== null) {
      toastPropsCopy.type = loaded
      notification = loaded === 'success' ? '¡Descarga existosa!' : '¡Error! Su información no se descargó'
      setLoading({ loaded: null })
    } else if (submitted !== null) {
      toastPropsCopy.type = submitted
      notification = loaded === 'success' ? '¡Exito! Su información se ha guardado' : '¡Error! Su información no se guardó'
      setLoading({ submitted: null })
    }

    if (saved || loaded || submitted) {
      toast(<Toasty type={submitted} notification={notification} />, toastPropsCopy)
    }
    
    return <ToastContainer />
}

const mapStateToProps = state => ({
  saved: state.getIn(['global', 'saved']),
  loaded: state.getIn(['global', 'loaded']),
  submitted: state.getIn(['global', 'submitted']),
})

const mapDispatchToProps = dispatch => ({
  setLoading: obj => dispatch(setIsLoading(obj)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
