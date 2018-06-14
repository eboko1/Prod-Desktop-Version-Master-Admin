import React from 'react';
import { connect } from 'react-redux';
import { profileSelector } from 'core/forms/formikForm/reducer';

class Result extends React.Component {
    // <div>result</div>;
    render() {
        const { formik } = this.props;

        return (
            <>
                {formik ? (
                    <pre
                        style={ {
                            padding:         20,
                            backgroundColor: '#f6f8fa',
                            borderRadius:    5,
                            border:          '1px solid #e6ebf1',
                            margin:          20,
                        } }
                    >
                        { JSON.stringify({ formik }, null, 2) }
                    </pre>
                ) : (
                    <div>empty</div>
                )}
            </>
        );
    }
}

const mapStateToProps = state => ({
    formik: profileSelector(state),
});

export default connect(mapStateToProps)(Result);
