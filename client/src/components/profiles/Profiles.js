import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => { getProfiles() }, [getProfiles])
    return <>
        {loading ? <Spinner /> :
            <>
                <h1 className="large text-primary">
                    Developers
                </h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i> Browse and connect with developers
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (profiles.map(item => <ProfileItem key={item._id} profile={item}>s</ProfileItem>))

                        :

                        <h4>No profiles found....</h4>
                    }
                </div>
            </>
        }
    </>
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    profile: state.profile

});
export default connect(mapStateToProps, { getProfiles })(Profiles);