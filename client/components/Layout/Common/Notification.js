import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { setIsSaved } from '../../../redux/actions/global'
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

const Notification = ({ isSaved, setSaved }) => {
  const type = 'success'
    const toastProps = {
      position: 'top-right',
      autoClose: false,
      // hideProgressBar: false,
      closeOnClick: true,
      // pauseOnHover: true,
      type,
      newestOnTop: true,
      draggable: true,
      draggablePercent: 60,
    }
    // const { isSaved } = this.props
    if (isSaved) {
      setSaved(false)
      toast(<Toasty type={type} notification="Informacion se ha guardado exitosamente" />, { ...toastProps })
    }
    return <ToastContainer />
}

const mapStateToProps = state => ({
  isSaved: state.getIn(['global', 'isSaved']),
})

const mapDispatchToProps = dispatch => ({
  setSaved: val => dispatch(setIsSaved(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
