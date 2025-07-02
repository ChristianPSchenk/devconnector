import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';


const ProfileGithub = ({ githubusername, getGithubRepos, repos }) => {
    useEffect(() => {
        getGithubRepos(githubusername);
    }, [getGithubRepos, githubusername])
    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">GitHub Repositories</h2>

            {repos === null ? <Spinner /> : repos.map(repo => <div key={repo.id} className='repo bg-white p-1 my-1'>

                <div>
                    <h4>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                    </h4>
                    <p>{repo.description}</p>
                </div>
                <div>
                    <ul>
                        <li className="badge badge-primary">Stars: {repo.stargazers_count}{' '}</li>
                        <li className="badge badge-dark">Watchers: {repo.watchers_count}{' '}</li>
                        <li className="badge badge-primary">Forks: {repo.forks_count}</li>
                    </ul>
                </div>


            </div>)}
        </div>
    );
};

PropTypes.propTypes = {
    githubusername: PropTypes.string.isRequired,
    repos: PropTypes.array.isRequired

};

const mapStateToProps = state => ({
    repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);