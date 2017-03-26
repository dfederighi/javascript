import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import * as actions from '../actions/journalActions';
import DatePicker from '../components/datepicker';
import TabsComponent from '../components/tabs';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import muiThemeStyles from '../constants/muiThemeStyles';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme(muiThemeStyles);

@connect((store) => {
    return {
        fetching: store.fetching
    };
})

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <DatePicker callback={this.setSelectedDate.bind(this)} />
                <div className="main-container">
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <div>
                            <TabsComponent />
                            <button 
                                onClick={this.saveData.bind(this)} 
                                className="saveButton"
                            >
                                SAVE
                            </button>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }

    saveData() {
        this.props.dispatch(actions.saveData());
    }

    setSelectedDate(dateState) {
        let props = this.props;
        let dateString = Moment(
            new Date(
                dateState.year + 1900, 
                dateState.month, 
                dateState.date
            )
        ).format('YYYY-MM-DD');

        props.dispatch(actions.resetLocalUI());
        props.dispatch(actions.setDate(dateString));
        props.dispatch(actions.getDateMeals());
    }

}
