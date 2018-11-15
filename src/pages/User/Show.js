import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/layouts/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import { formatDateTimeStr } from '@/utils/common';

const { Description } = DescriptionList;

@connect(state => ({
  userid: state.user.userid,
  user: state.user.currentItem,
}))
class Show extends Component {
  componentDidMount() {
    const { userid, dispatch } = this.props;
    if (userid) {
      dispatch({
        type: 'user/fetchUser',
        payload: { id: userid },
      });
    }
  }

  render() {
    const { user } = this.props;
    const { preference } = user;

    const baseInfoMsg = formatMessage({ id: 'User.baseInfo' });
    const preferenceMsg = formatMessage({ id: 'User.preference' });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <DescriptionList size="large" col={1} title={baseInfoMsg} style={{ marginBottom: 32 }}>
            <Description term={formatMessage({ id: 'User.username' })}>
              {user.username}
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
                {preference.language}
              </Description>
              <Description term={formatMessage({ id: 'User.preference.timezone' })}>
                {preference.timezone}
              </Description>
            </DescriptionList>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Show;
