import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import DailyViewContainer from '../containers/DailyViewContainer';
import MealsViewContainer from '../containers/MealsViewContainer';

export default class TabsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'dailyTab'
        };
    }

    handleTabChange = (value) => {
        this.setState({value: value});  
    };

    render() {
        return (
            <Tabs value={this.state.value} className="fjTabs" onChange={this.handleTabChange}>
                <Tab label="Daily" value="dailyTab">
                    <DailyViewContainer />
                </Tab>
                <Tab label="Meals" value="mealsTab">
                    <MealsViewContainer />
                </Tab>
            </Tabs> 
        );
    }
}
