import React, {PropTypes, Component} from 'react';

import themeable from '../themeable';
import translatable from '../translatable';

import Select from './Select';

class MenuSelect extends Component {
  static propTypes = {
    applyTheme: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    refine: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })).isRequired,
    selectedItem: PropTypes.string.isRequired,
  };

  render() {
    const {applyTheme, refine, items, selectedItem, translate} = this.props;

    return (
      <Select
        applyTheme={applyTheme}
        selectedItem={selectedItem || ''}
        onSelect={refine}
        items={[
          {label: translate('none'), value: ''},
        ].concat(items.map(item => ({
          label: `${item.value} ${translate('count', item.count)}`,
          value: item.value,
        })))}
      />
    );
  }
}

export default themeable({
  root: 'MenuSelect',
})(
  translatable({
    none: 'None',
    count: count => count.toLocaleString(),
  })(
    MenuSelect
  )
);
