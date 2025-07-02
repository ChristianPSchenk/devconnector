import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import { useParams } from 'react-router-dom';
import PostItem from '../posts/PostItem';
import CommentForm from '../posts/CommentForm';
import { Link } from 'react-router-dom';
import CommentItem from '../posts/CommentItem';

const Post = ({ getPost, post: { loading, post } }) => {

    const id = useParams().id;

    useEffect(() => {
        getPost(id);
    }, [getPost, id]);
    return (

        <div>

            {loading ? (
                <Spinner />
            ) : (

                <>

                    <Link to='/posts' className='btn'>
                        <i className='fas fa-arrow-left'></i> Back to Posts
                    </Link>
                    <PostItem showActions={false} post={post} />
                    <CommentForm postId={id} />

                    {

                        post.comments.map(comment =>

                        (<>


                            <CommentItem key={comment._id} comment={comment} postId={id} />
                        </>)
                        )
                    }
                </>


            )
            }
        </div >
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    post: state.post

});

export default connect(mapStateToProps, { getPost })(Post);