import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';

import { formatDateTimeStr } from '@/utils/common';

const { Description } = DescriptionList;

@connect(state => ({
  organizationId: state.organization.organizationId,
  organization: state.organization.currentItem,
}))
class Show extends Component {
  componentDidMount() {
    const { organizationId, dispatch } = this.props;
    if (organizationId) {
      dispatch({
        type: 'organization/fetchOrg',
        payload: { id: organizationId },
      });
    }
  }

  render() {
    const { organization } = this.props;

    const baseInfoMsg = formatMessage({ id: 'User.baseInfo' });

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <DescriptionList size="large" col={1} title={baseInfoMsg} style={{ marginBottom: 32 }}>
            <Description term={formatMessage({ id: 'Organization.short_name' })}>
              {organization.short_name}
            </Description>
            <Description term={formatMessage({ id: 'Organization.name' })}>
              {organization.name}
            </Description>
            <Description term={formatMessage({ id: 'Organization.parent' })}>
              {organization.parent}
            </Description>
            <Description term={formatMessage({ id: 'Organization.org_type' })}>
              {organization.org_tyep && formatMessage({ id: `${organization.org_tyep}` })}
            </Description>
            <Description term={formatMessage({ id: 'Organization.status' })}>
              {organization.status && formatMessage({ id: `${organization.status}` })}
            </Description>
            <Description term={formatMessage({ id: 'Organization.create_date' })}>
              {formatDateTimeStr(organization.create_date)}
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Show;
