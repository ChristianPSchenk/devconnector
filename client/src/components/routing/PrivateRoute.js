import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children, auth, ...rest }) => (

    !auth.isAuthenticated && !auth.loading ?


        <Navigate to='/login' replace /> :
        <>
            {React.Children.map(children, child => React.cloneElement(child, { auth, ...rest }))}
        </>



)

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute)