import { combineReducers } from 'redux';

import {
	dailyReducer, 
	mealsReducer, 
	selectedDateReducer,
	selectedMealReducer,
	dailyUIReducer,
	mealsUIReducer,
	fetchingReducer
} from './journalReducers';


export default combineReducers({
	daily: dailyReducer,
	meals: mealsReducer,
	selectedDate: selectedDateReducer,
	selectedMeal: selectedMealReducer,
	dailyUI: dailyUIReducer,
	mealsUI: mealsUIReducer,
	fetching: fetchingReducer
});
