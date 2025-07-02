import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { deleteComment } from "../../actions/post";

const CommentItem = ({ auth, comment: { _id, text, name, avatar, user, date }, postId, deleteComment }) => {

    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to="/profile/${user}">
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
            </div>
            {!auth.loading && user === auth.user._id && (
                <button
                    type="button"
                    className="btn btn-danger btn-info"
                    onClick={e => deleteComment(postId, _id)}
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    )
}

CommentItem.propTypes = {
    deleteComment: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired
    ,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { deleteComment })(CommentItem);