import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';
import PropTypes from 'prop-types';

const CommentForm = ({ addComment, postId }) => {
    const [text, setText] = useState('');



    return (
        <div>
            <div className="post-form">
                <div className="bg-primary p">
                    <h3>Leave a comment</h3>
                </div>
                <form className="form my-1" onSubmit={e => { e.preventDefault(); addComment(postId, { text }) }}>
                    <textarea
                        name="text"
                        value={text}
                        cols="30"
                        rows="5"
                        placeholder="Create a Comment"
                        onChange={e => setText(e.target.value)}
                        required
                    ></textarea>
                    <input type="submit" className="btn btn-dark my-1" value="Submit" />
                </form>
            </div>

        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired
};



export default connect(null, { addComment })(CommentForm)