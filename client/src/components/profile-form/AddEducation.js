import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';
import { useNavigate } from 'react-router-dom';

const AddEducation = ({ addEducation }) => {

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });


    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, fieldofstudy, from, to, current, description } = formData;

    const onChange = e => setFormData({
        ...formData, [e.target.name]: e.target.value
    })


    const navigate = useNavigate();

    return (<>

        <h1 className="large text-primary">
            Add An Education
        </h1>
        <p className="lead">
            <i className="fas fa-code-branch"></i> Add your Education
        </p>
        <small>* = required field</small>
        <form className="form" onSubmit={
            e => {
                e.preventDefault()
                addEducation(formData, navigate);
            }
        }>
            <div className="form-group">
                <input type="text" placeholder="* School " name="school" required value={school} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
                <input type="text" placeholder="* Degree" name="degree" required value={degree} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
                <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
                <p><input type="checkbox" name="current" checked={current} value={current} onChange={e => {
                    setFormData({ ...formData, current: !current })
                    toggleDisabled(!toDateDisabled)
                }} />{' '}Current School</p>
            </div>
            <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisabled ? 'disabled' : ''} />
            </div>
            <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Programm Description"
                    value={description}
                    onChange={e => onChange(e)}
                ></textarea>
            </div>
            <input type="submit" className="btn btn-primary my-1" />
            <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>
        </form>

    </>)
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(AddEducation);