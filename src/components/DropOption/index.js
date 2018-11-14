import React from 'react';
import { Dropdown, Button, Icon, Menu } from 'antd';

const MenuItem = Menu.Item;

class DropOption extends React.PureComponent {
  render() {
    const {
      name,
      icon = 'bars',
      menuOptions,
      onMenuClick,
      buttonStyle,
      dropdownProps,
    } = this.props;

    const menu = menuOptions.map((item) => {
      return (
        <MenuItem key={item.key}>
          {item.icon && <Icon type={item.icon} style={{ marginRight: 2 }} />}
          {item.name}
        </MenuItem>
      );
    });

    return (
      <Dropdown overlay={<Menu onClick={onMenuClick}>{menu}</Menu>} {...dropdownProps}>
        <Button style={{ border: 'none', ...buttonStyle }}>
          <Icon style={{ marginRight: 2 }} type={icon} />
          {name}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

export default DropOption;
