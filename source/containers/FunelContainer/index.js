// vendor
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// proj
import { fetchOrdersStats } from 'core/orders/duck';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
// eslint-disable-next-line
const mapStateToProps = (state, props) => {
    return {
        stats: state.orders.stats,
    };
};
// eslint-disable-next-line
const mapDispatchToProps = (dispatch, props) => {
    return {
        actions: bindActionCreators(
            {
                fetchOrdersStats: fetchOrdersStats,
            },
            dispatch,
        ),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class FunelContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchOrdersStats();
    }

    render() {
        const { stats } = this.props;

        return (
            <div className={ Styles.funel }>
                <Link to={ `${book.orders}/appointments` }>
                    appointments ({ stats.not_complete +
                        stats.call +
                        stats.reserve +
                        stats.required })
                </Link>
                <Link to={ `${book.orders}/approved` }>
                    approves ({ stats.approve })
                </Link>
                <Link to={ `${book.orders}/in-progress` }>
                    in progress ({ stats.progress })
                </Link>
                <Link to={ `${book.orders}/success` }>
                    success ({ stats.success })
                </Link>
                <Link to={ `${book.orders}/reviews` }>
                    reviews ({ stats.review })
                </Link>
                <Link to={ `${book.orders}/invitations` }>
                    invitations ({ stats.invite })
                </Link>
                <Link to={ `${book.orders}/canceled` }>
                    cancels ({ stats.cancel })
                </Link>
            </div>
        );
    }
}

export default FunelContainer;
