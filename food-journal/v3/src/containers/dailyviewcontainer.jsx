import React from 'react';
import { connect } from 'react-redux';

import DailyView from '../components/DailyView';
import { updateDailyLocalUI } from '../actions/journalActions';

@connect((store) => {
    let selectedDaily = store.daily[store.selectedDate] || {};
    let localUIData = store.dailyUI || {};

    return {
        daily: Object.assign({}, selectedDaily, localUIData),
        localChanges: (Object.keys(localUIData).length > 0)
    };
    
})

export default class DailyViewContainer extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
        return (
            <DailyView  
                {...this.props.daily} 
                onHandleCheck={this.handleCheck.bind(this)} 
                onHandleSelect={this.handleSelect.bind(this)}
            />
        );

	}

    handleCheck(event, value) {
        let key = event.target.name;

        this.props.dispatch(updateDailyLocalUI({[key]: value}));
    }

    handleSelect(id, event, index, value) {
        this.props.dispatch(updateDailyLocalUI({[id]: value}));
    }

}