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

const Notification = ({ saved, loaded, setLoading }) => {
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
    if (saved !== null) {
      toastPropsCopy.type = saved
      setLoading({ saved: null })
      toast(<Toasty type={saved} notification="¡Exito! Su información se ha guardado" />, toastPropsCopy)
    } else if (loaded !== null) {
      toastPropsCopy.type = loaded
      setLoading({ loaded: null })
      toast(<Toasty type={loaded} notification="¡Descarga existosa!" />, toastPropsCopy)
    }
    return <ToastContainer />
}

const mapStateToProps = state => ({
  saved: state.getIn(['global', 'saved']),
  loaded: state.getIn(['global', 'loaded']),
})

const mapDispatchToProps = dispatch => ({
  setLoading: obj => dispatch(setIsLoading(obj)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
