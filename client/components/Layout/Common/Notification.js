import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { setIsLoading, resetNotification } from '../../../redux/actions/global'
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

const Notification = ({ notificationText, showNotification, notificationType, resetNotifications }) => {
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
    if (showNotification) {
      toastPropsCopy.type = notificationType
      toast(<Toasty type={notificationType} notification={notificationText} />, toastPropsCopy)
      resetNotifications()
    }
    // let notification = ''
    // if (saved !== null) {
    //   toastPropsCopy.type = saved
    //   notification = saved === 'success' ? '¡Exito! Su información se ha guardado' : '¡Error! Su información no se guardó'
    //   setLoading({ saved: null })
    // } else if (loaded !== null) {
    //   toastPropsCopy.type = loaded
    //   notification = loaded === 'success' ? '¡Descarga existosa!' : '¡Error! Su información no se descargó'
    //   setLoading({ loaded: null })
    // } else if (submitted !== null) {
    //   toastPropsCopy.type = submitted
    //   notification = loaded === 'success' ? '¡Exito! Su información se ha guardado' : '¡Error! Su información no se guardó'
    //   setLoading({ submitted: null })
    // }

    // if (saved || loaded || submitted) {
    //   toast(<Toasty type={submitted} notification={notification} />, toastPropsCopy)
    // }
    
    return <ToastContainer />
}

const mapStateToProps = state => ({
  saved: state.getIn(['global', 'saved']),
  loaded: state.getIn(['global', 'loaded']),
  submitted: state.getIn(['global', 'submitted']),
  text: state.getIn(['global', 'notificationText']),
  showNotification: state.getIn(['global', 'showNotification']),
  notificationText: state.getIn(['global', 'notificationText']),
  notificationType: state.getIn(['global', 'notificationType']),
})

const mapDispatchToProps = dispatch => ({
  setLoading: obj => dispatch(setIsLoading(obj)),
  resetNotifications: () => dispatch(resetNotification())
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
