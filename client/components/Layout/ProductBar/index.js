// imports
import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import ProductbarActions from './Actions'
import { connect } from 'react-redux'
import { NavLink, BrowserRouter } from 'react-router-dom'
import { setTab, setCurrentPage, setHasSubmitted, setIsLoading, setSaveName} from "../../../redux/actions/global";
import {submitForm} from "../../../redux/actions/pozoFormActions";
import {submitResultsForm} from "../../../redux/actions/results";
import fichaTechnicaDelPozo from "../../../redux/reducers/fichaTecnicaDelPozoHighLevel";
import { withRouter } from 'react-router-dom';

@withRouter
@autobind
class Productbar extends Component {
  constructor(props)
  {
     super(props)

     this.state = {
         location: "",
         isAdmin: false,
     }
  }

  async componentDidMount(){
    const { history } = this.props;
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange);
    this.handleLocationChange(history.location);
  }


  componentWillUnmount() {
      if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  handleLocationChange(location) {
      if(location){
        if (this.state.location !== location) {
            this.setState({ location: location })
        }
      }
  }

  showTabs(){
    let { showForms, } = this.props
    return showForms && location && this.state.location.pathname == '/carga_datos' && showForms !== 'results'
  }

  render(){
    let { app, user, logoutAction, setTab, pozoName, selectedTab } = this.props
    const { isAdmin } = this.state
    const title = app.get('title')
    return (
      <div className="productbar">
        <div className="title">
            <NavLink to="/"><span/></NavLink>
            {/*<div style={{fontFamily: 'Roboto', display: 'inline-block', color: '#CE1A22', fontWeight: 'normal', fontSize: '16px', position: 'relative', top: '-10px', left: '-35px'}}>Versión beta para prueba </div>-->*/}
        </div>
        {this.showTabs() && (
            <div>
                <span className="selectedPozo">Pozo: {pozoName}</span>
                <div className="links">
                    <a className={selectedTab == 'Pozo' ? 'active': ''} tabIndex="Pozo" onClick={e => setTab('Pozo')}>Pozo</a>
                    <a className={selectedTab == 'Intervenciones' ? 'active': ''} tabIndex="Intervenciones" onClick={e => setTab('Intervenciones')}>Intervenciones</a>
                </div>
            </div>
        )}

        { user !== null && (
          <ProductbarActions user={user} logoutAction={logoutAction} />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
    global: state.get('global'),
    user: state.getIn(['user', 'id']),
    token: state.getIn(['user', 'token']),
    selectedTab: state.getIn(['global', 'selectedTab']),
    showForms: state.getIn(['global', 'showForms']),
    pozoName: state.getIn(['fichaTecnicaDelPozoHighLevel', 'pozoName']),
})

const mapDispatchToProps = dispatch => ({
    setTab: val => dispatch(setTab(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(Productbar)
