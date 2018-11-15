import React from 'react';
import { formatMessage } from 'umi/locale';

class CollapseTextArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      collapse: true,
    };

    this.collapseText = this.collapseText.bind(this);
  }

  componentWillMount() {
    const { text, len = 50 } = this.props;
    this.setState({ text: this.collapseText(text, len) });
  }

  componentWillReceiveProps(nextProps) {
    const { len = 50 } = this.props;
    this.setState({ text: this.collapseText(nextProps.text, len), collapse: true });
  }

  handleCollapseClick = () => {
    const { text, len = 50 } = this.props;
    const { collapse } = this.state;

    if (collapse) {
      this.setState({ text, collapse: !collapse });
    } else {
      this.setState({ text: text.slice(0, len).concat('...'), collapse, });
    }
  };

  collapseText(t, l) {
    const { text, len } = this.props;
    const ctext = t || text;
    const clen = l || len;

    if (ctext) {
      if (ctext.length <= clen) {
        return ctext;
      }
      return ctext.slice(0, clen).concat('...');
    } 
    return '';
  }

  render() {
    const { len } = this.props;
    const { text, collapse } = this.state;

    return (
      <div>
        {collapse ?
          (
            <p>{text}&nbsp;&nbsp;&nbsp;&nbsp;
              { text && text.length > len ? (
                <a onClick={() => this.handleCollapseClick()}>
                  {collapse ? formatMessage({ id: 'Ops.expand' }) : formatMessage({ id: 'Ops.collapse' })}
                </a>
              ) : null }
            </p>
          ) : (
            <div>
              <p style={{
                whiteSpace: 'pre-wrap',
                maxHeight: '300px',
                overflow: 'auto',
                overflowWrap: 'normal' }}
              >
                {text}
              </p>
              <p>
                { text ? (
                  <a onClick={() => this.handleCollapseClick()}>
                    {collapse ? formatMessage({ id: 'Ops.expand' }) : formatMessage({ id: 'Ops.collapse' })}
                  </a>
                ) : null }
              </p>
            </div>
          )
        }
      </div>
    );
  }
}

export default CollapseTextArea;
