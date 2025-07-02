import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
    const [text, setText] = useState('');

    const createPost = e => {
        e.preventDefault();
        addPost({ text });
        console.log('posted')
        setText('');
    };

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form className="form my-1" onSubmit={e => createPost(e)}>
                <textarea
                    name="text"
                    value={text}
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    onChange={e => setText(e.target.value)}
                    required
                ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    )

}

PropTypes.propTypes = {
    addPost: PropTypes.func.isRequired
};


export default connect(null, { addPost })(PostForm);