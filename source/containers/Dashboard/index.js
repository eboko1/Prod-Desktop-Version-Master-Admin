import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// proj
import { fetchDashboard, fetchPostsLoad } from 'core/dashboard/duck';
import { Catcher } from 'commons';

// own

const mapStateToProps = state => ({
    orders:    state.dashboard.orders,
    postsLoad: state.dashboard.postLoad,
});

const mapDispatchToProps = {
    fetchDashboard,
    fetchPostsLoad,
};

@connect(mapStateToProps, mapDispatchToProps)
class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchDashboard();
    }

    render() {
        // const dashDays = _.map(this.props.postsLoad, obj =>
        //     _.assign(obj, _.find(this.props.days, { date: obj.startDate })));

        return (
            <Catcher>
                <table>
                    <thead>
                        <tr>
                            { [ 1, 2, 3, 4, 5, 6, 7 ].map((day, index) => {
                                return (
                                    <th
                                        className={ `dashboard__table-header ${
                                            day.current
                                                ? 'dashboard__table-header_active'
                                                : ''
                                        }` }
                                        key={ `${day}--${index}` }
                                    >
                                        <div>{ day }</div>
                                        <Link to='/dashboard'>
                                            { `${day.dateFormat} -
                                                ${day.load_coefficient}%` }
                                        </Link>
                                    </th>
                                );
                            }) }
                        </tr>
                    </thead>
                </table>
            </Catcher>
        );
    }
}

export default Dashboard;
