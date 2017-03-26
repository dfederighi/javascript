import React from 'react';
import { connect } from 'react-redux';

import MealsView from '../components/MealsView';
import { setMeal, updateMealsLocalUI } from '../actions/journalActions';

/* Config ??? */
const mealsMap = {
    1: 'breakfast',
    2: 'lunch',
    3: 'dinner',
    4: 'snacks'
};

@connect((store) => {

    let mealName = mealsMap[store.selectedMeal];
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
                onHandleSelect={this.handleSelect.bind(this)} 
                onHandleChange={this.handleChange.bind(this)} 
            />
		);

	}

    handleSelect(id, event, index, value) {
        let props = this.props;
        let mealName = mealsMap[props.selectedMeal];

        if (id === 'MealType') {
            props.dispatch(setMeal(value));
        } else {
            props.dispatch(updateMealsLocalUI(mealName, {[id]: value}));
        }
    }

    handleChange(event, value) {
        let mealName = mealsMap[this.props.selectedMeal];
        let key = event.target.name;
        
        this.props.dispatch(updateMealsLocalUI(mealName, {[key]: value}));
    }
	
}