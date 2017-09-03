import React from 'react';
import { connect } from 'react-redux';

import MealsView from '../components/MealsView';
import { setMeal, updateMealsLocalUI } from '../actions/journalActions';
import { MEAL_NAME_VALUES } from '../constants/mealsConfig';


@connect((store) => {

    let mealName = MEAL_NAME_VALUES[store.selectedMeal];
    let selectedMeals = store.meals[store.selectedDate] || {};
    let selectedMeal = selectedMeals[mealName] || {'MealType': store.selectedMeal};
    let localUIData = store.mealsUI || {};

    return {
        meal: Object.assign({}, selectedMeal, localUIData[mealName]),
        selectedMeal: store.selectedMeal,
        localChanges: (Object.keys(localUIData).length > 0)
    };
    
})

export default class MealsViewContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
        return (
			<MealsView 
                {...this.props.meal} 
                onHandleSelect={this.handleSelect} 
                onHandleChange={this.handleChange} 
            />
		);

	}

	handleSelect = (id, event, index, value) => {
        let props = this.props;
        let mealName = MEAL_NAME_VALUES[props.selectedMeal];

        if (id === 'MealType') {
            props.dispatch(setMeal(value));
        } else {
            props.dispatch(updateMealsLocalUI(mealName, {[id]: value}));
        }
    }

	handleChange = (event, value) => {
		let props = this.props;
        let mealName = MEAL_NAME_VALUES[props.selectedMeal];
        let key = event.target.name;
        
        props.dispatch(updateMealsLocalUI(mealName, {[key]: value}));
    }
	
}
