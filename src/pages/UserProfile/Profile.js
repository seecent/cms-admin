import React, { Component } from 'react';
import { Button, Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { formatMessage } from 'umi/locale';
import { formatDateTimeStr, formatLanguage } from '@/utils/common';

const { Description } = DescriptionList;

class Profile extends Component {
  state = {};

  render() {
    const { user, showPasswordModal, handleEdit } = this.props;
    const { preference } = user;

    const baseInfoMsg = formatMessage({ id: 'User.baseInfo' });
    const preferenceMsg = formatMessage({ id: 'User.preference' });

    return (
      <Card bordered={false}>
        <DescriptionList size="large" col={1} title={baseInfoMsg} style={{ marginBottom: 32 }}>
          <Description term={formatMessage({ id: 'User.username' })}>
            {user.username}
          </Description>
          <Description term={formatMessage({ id: 'User.password' })}>
            <Button size="small" onClick={showPasswordModal}>
              {formatMessage({ id: 'User.changePassword' })}
            </Button>
          </Description>
          <Description term={formatMessage({ id: 'User.fullname' })}>
            {user.fullname}
          </Description>
          <Description term={formatMessage({ id: 'User.enname' })}>
            {user.enname}
          </Description>
          <Description term={formatMessage({ id: 'User.mobile' })}>
            {user.mobile}
          </Description>
          <Description term={formatMessage({ id: 'User.email' })}>
            {user.email}
          </Description>
          <Description term={formatMessage({ id: 'User.type' })}>
            {user.usertype && formatMessage({ id: `${user.usertype}` })}
          </Description>
          <Description term={formatMessage({ id: 'User.status' })}>
            {user.status && formatMessage({ id: `${user.status}` })}
          </Description>
          <Description term={formatMessage({ id: 'User.create_date' })}>
            {formatDateTimeStr(user.date_created)}
          </Description>
          <Description term={formatMessage({ id: 'User.last_modifed' })}>
            {formatDateTimeStr(user.last_updated)}
          </Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        {preference && (
          <DescriptionList size="large" col={1} title={preferenceMsg} style={{ marginBottom: 32 }}>
            <Description term={formatMessage({ id: 'User.preference.language' })}>
              {formatLanguage(preference.language)}
            </Description>
            <Description term={formatMessage({ id: 'User.preference.timezone' })}>
              {preference.timezone}
            </Description>
            <Description term="">
              <Button size="small" onClick={handleEdit}>
                {formatMessage({ id: 'Ops.update' })}
              </Button>
            </Description>
          </DescriptionList>
        )}
      </Card>
    );
  }
}

export default Profile;
