import React, { Component } from 'react';
import classNames from 'classnames';
import { Tag, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const { CheckableTag } = Tag;

const FolderSelectOption = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={checked}
    key={value}
    onChange={state => onChange(value, state)}
    style={{ fontSize: '14px' }}
  >
    {children}
  </CheckableTag>
);

FolderSelectOption.isFolderSelectOption = true;

class FolderSelect extends Component {
  state = {
    expand: false,
    value: this.props.value || this.props.defaultValue || [],
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (value) => {
    const { multiple, onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      if (multiple) {
        onChange(value);
      } else if (value.length > 0) {
        onChange(value[0]);
      }
    }
  };

  onSelectAll = (checked) => {
    let checkedTags = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  getAllTags = () => {
    let { children } = this.props;
    children = React.Children.toArray(children);
    const checkedTags = children
      .filter(child => this.isFolderSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleFolderChange = (value, checked) => {
    const { multiple } = this.props;
    const { defaultValue } = this.state;
    if (multiple) {
      const checkedTags = [...defaultValue];
      const index = checkedTags.indexOf(value);
      if (checked && index === -1) {
        checkedTags.push(value);
      } else if (!checked && index > -1) {
        checkedTags.splice(index, 1);
      }
      this.onChange(checkedTags);
    } else if (checked) {
      this.onChange([value]);
    }
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  };

  handleBack = () => {
    const { onBack } = this.props;
    onBack();
  };

  isFolderSelectOption = (node) => {
    if (node && node.type) {
      return node.type.isFolderSelectOption || node.type.displayName === 'FolderSelectOption';
    }
    return false;
  };

  render() {
    const { value, expand } = this.state;
    const { children, className, style, expandable = false, multiple, showback } = this.props;

    const checkedAll = this.getAllTags().length === value.length;
    const expandMsg = formatMessage({ id: 'Ops.expand' });
    const collapseMsg = formatMessage({ id: 'Ops.collapse' });

    const cls = classNames(styles.folderSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expandable ? expand : !expandable,
    });
    return (
      <div className={cls} style={style}>
        {multiple && (
          <CheckableTag
            checked={checkedAll}
            key="tag-select-__all__"
            onChange={this.onSelectAll}
            style={{ fontSize: '14px' }}
          >
            {formatMessage({ id: 'Msg.all' })}
          </CheckableTag>
        )}
        {value &&
          React.Children.map(children, (child) => {
            if (this.isFolderSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: this.handleFolderChange,
              });
            }
            return child;
          })}
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand ? collapseMsg : expandMsg} <Icon type={expand ? 'up' : 'down'} />
          </a>
        )}
        {showback && (
          <a className={styles.back} onClick={this.handleBack}>
            <Icon type="rollback" />
            {formatMessage({ id: 'Ops.backParentFolder' })}
          </a>
        )}
      </div>
    );
  }
}

FolderSelect.Option = FolderSelectOption;
export default FolderSelect;
