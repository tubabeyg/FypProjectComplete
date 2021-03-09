import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { doctorsignout, isAuthenticated } from '../auth/index';
import { deletedoctor } from './doctorapi';
class DeleteDoctor extends Component {
  state = {
    redirect: false,
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const doctorId = this.props.doctorId;
    deletedoctor(doctorId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        doctorsignout(() => console.log('Deleted'));

        this.setState({
          redirect: true,
        });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete this account');

    if (answer) {
      this.deleteAccount();
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to='/doctor/signin' />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className='btn btn-raised btn-danger m-3'
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteDoctor;
