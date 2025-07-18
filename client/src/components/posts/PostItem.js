import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';


const PostItem = ({ addLike, removeLike, deletePost, auth, post: { _id, text, name, avatar, user, likes, comments, date }, showActions }) => {

    return (

        < div className="post bg-white p-1 my-1" >
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">
                    {text}
                </p>
                <p className="post-date">
                    Posted on {moment(date).format('MM/DD/YYYY')}
                </p>
                {showActions && <>
                    <button type='button' className='btn btn-light' onClick={e => { e.preventDefault(); addLike(_id) }}>
                        <i className="fas fa-thumbs-up"></i>
                        <span>{likes.length > 0 && <span> {likes.length}</span>}</span>
                    </button>
                    <button type='button' className='btn btn-light' onClick={e => { e.preventDefault(); removeLike(_id) }}>
                        <i className="fas fa-thumbs-down"></i>

                    </button>
                    <Link to={`/posts/${_id}`} type='button' className='btn btn-primary'>
                        Discussions
                        {comments.length > 0 && (<span> {comments.length}</span>)}
                    </Link>
                    {!auth.loading && user === auth.user._id && (
                        <button
                            type="button"
                            className="btn btn-danger btn-info"
                            onClick={e => deletePost(_id)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}

                </>}


            </div>
        </div >

    );
};

PostItem.defaultProps = {
    showActions: true
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);