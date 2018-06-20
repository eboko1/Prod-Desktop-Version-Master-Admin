// vendor
import React, { Component } from 'react';
import { InputNumber } from 'antd';

// proj
import { Catcher } from 'commons';

class DiscountPanel extends Component {
    onChange(value) {
        console.log('changed', value);
    }

    render() {
        return (
            <Catcher>
                <InputNumber
                    defaultValue={ 0 }
                    min={ 0 }
                    max={ 100 }
                    formatter={ value => `${value}%` }
                    parser={ value => value.replace('%', '') }
                    onChange={ value => this.onChange(value) }
                />
                <InputNumber
                    defaultValue={ 0 }
                    min={ 0 }
                    formatter={ value =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={ value => value.replace(/\$\s?|(,*)/g, '') }
                    onChange={ value => this.onChange(value) }
                />
                <InputNumber
                    defaultValue={ 0 }
                    min={ 0 }
                    formatter={ value =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={ value => value.replace(/\$\s?|(,*)/g, '') }
                    onChange={ value => this.onChange(value) }
                />
            </Catcher>
        );
    }
}

export default DiscountPanel;
