import React, { Component } from 'react';
import { connect } from 'dva';
import store from 'store';
import PasswordModal from './PasswordModal';
import Profile from './Profile';
import ProfileEditer from './ProfileEditer';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(state => ({
  currentUser: state.auth.currentUser,
  user: state.user.currentItem,
  status: state.user.status,
  errors: state.user.errors,
}))
class UserProfile extends Component {
  state = {
    modalVisible: false,
    editVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const userid = store.get('userid');
    if (userid) {
      dispatch({
        type: 'user/fetchUser',
        payload: { id: userid },
      });
    }
  }

  showPasswordModal = () => {
    this.setState({ modalVisible: true });
  }

  hidePasswordModal = () => {
    this.setState({ modalVisible: false });
  }

  handleModelOk = (data) => {
    const { user: { username }, dispatch } = this.props;
    const { oldPassword, newPassword } = data;
    dispatch({
      type: 'user/updatePassword',
      payload: {
        username,
        password: oldPassword,
        new_password: newPassword,
      },
    });
    this.setState({ modalVisible: false });
  }

  handleEdit = () => {
    this.setState({ editVisible: true });
  }

  handleCancel = () => {
    this.setState({ editVisible: false });
  }

  handleSave = (values, language) => {
    this.setState({ editVisible: false });
    const { user, dispatch } = this.props;
    const { preference } = user;
    if (language && language !== preference.language) {
      preference.language = language;
      dispatch({
        type: 'user/updatePreference',
        payload: { id: user.id, ...preference },
      });
    }
    if (values) {
      dispatch({
        type: 'user/update',
        payload: { id: user.id, ...values },
      });
      dispatch({
        type: 'user/fetchUser',
        payload: { id: user.id },
      });
    }
  }

  render() {
    const { user } = this.props;
    const { modalVisible, editVisible } = this.state;

    return (
      <PageHeaderWrapper>
        {
          !editVisible && (
            <Profile
              user={user}
              showPasswordModal={this.showPasswordModal}
              handleEdit={this.handleEdit}
            />
          )
        }
        {
          editVisible && (
            <ProfileEditer
              user={user}
              handleSave={this.handleSave}
              handleCancel={this.handleCancel}
            />
          )
        }
        {
          modalVisible && (
            <PasswordModal
              visible={modalVisible}
              onOk={this.handleModelOk}
              onCancel={this.hidePasswordModal}
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default UserProfile;
