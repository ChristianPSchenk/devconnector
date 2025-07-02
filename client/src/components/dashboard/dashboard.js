import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

import Experience from './Experience'
import DashboardActions from './DashboardActions';
import Education from './Education';

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {

    useEffect(() => {

        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && profile == null ? <Spinner /> :
        <>
            <div>
                <h1 className="large text-primary">Dashboard</h1>
                <p className="lead"><i className="fas fa-user"></i> Welcome {user && user.name}</p>

                {profile !== null ? <>
                    <DashboardActions></DashboardActions>
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                    <div className='my-2'>
                        <button className='btn btn-danger' onClick={() => {
                            deleteAccount()
                        }}>
                            <i className="fas fa-user-minus"></i>
                            Delete Account
                        </button>

                    </div>
                </> : <>

                    <p> You haven't yet set-up a profile</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
                </>}
            </div>
        </>
        ;
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
    ,
    deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({

    profile: state.profile,
    auth: state.auth
});
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)