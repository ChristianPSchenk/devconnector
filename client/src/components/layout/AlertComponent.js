import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';



const Alert = ({ alerts }) => alerts != null && alerts.length > 0 && alerts.map(alert => {
    console.log(alert.id)
    return (

        < div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div >
    )
})




const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps, null)(Alert)