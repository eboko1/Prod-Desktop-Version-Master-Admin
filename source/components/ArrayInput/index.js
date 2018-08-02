// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';

// proj
import { DecoratedInput } from 'forms/DecoratedFields';

// own
const FormItem = Form.Item;

class ArrayInput extends Component {
  remove = key => {
      const { fieldName, values, optional } = this.props;

      if (values.length === 1 && !optional) {
          return;
      }

      if (values.length === 1) {
          this.props.onChange(
              {
                  [ fieldName ]: [],
              },
              { form: '', field: fieldName },
          );
      }
      const newValues = [ ...values.slice(0, key), ...values.slice(key + 1, values.length)  ].map((value, index) => ({
          ...value,
          name: `${fieldName}[${index}]`,
      }));

      this.props.onChange({
          [ fieldName ]: newValues,
      });
  };

  add = () => {
      const { fieldName, values } = this.props;
      const newValue = {
          errors:     void 0,
          name:       `${fieldName}[${values.length}]`,
          touched:    true,
          validating: false,
          value:      void 0,
          dirty:      true,
      };

      this.props.onChange(
          { [ fieldName ]: [ ...values, newValue ] },
          { form: '', field: fieldName },
      );
  };

  render() {
      const { getFieldDecorator } = this.props.form;
      const { fieldName, values, fieldTitle, rules, optional } = this.props;

      const formItems = values.map((value, index) => {
          return (
              <Row type='flex' align='middle' key={ index }>
                  <Col span={ 20 }>
                      <DecoratedInput
                          hasFeedback
                          formItem
                          label={ fieldTitle }
                          getFieldDecorator={ getFieldDecorator }
                          key={ index }
                          field={ `${fieldName}[${index}]` }
                          rules={ rules }
                      />
                  </Col>
                  <Col span={ 4 }>
                      <Row type='flex' justify='center'>
                          { values.length > 1 || optional ? (
                              <Icon
                                  key={ index }
                                  className='dynamic-delete-button'
                                  type='minus-circle-o'
                                  style={ { fontSize: 20, color: '#cc1300' } }
                                  disabled={ values.length === 1 }
                                  onClick={ () => this.remove(index) }
                              />
                          ) : null }
                      </Row>
                  </Col>
              </Row>
          );
      });

      return (
          <Col>
              { formItems }
              <Row type='flex'>
                  <Col span={ 20 }>
                      <Row type='flex' justify='center'>
                          <FormItem>
                              <Button type='dashed' onClick={ this.add }>
                                  <Icon type='plus' /> { this.props.buttonText }
                              </Button>
                          </FormItem>
                      </Row>
                  </Col>
              </Row>
          </Col>
      );
  }
}

export default ArrayInput;
