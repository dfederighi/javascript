
export function dailyReducer(state={}, action) {
	switch (action.type) {
        case 'HYDRATE_DAILY': {
        	return Object.assign({}, state, action.payload);
            
        }
    }
    return state;
}

export function mealsReducer(state={}, action) {
	switch (action.type) {
		case 'HYDRATE_MEALS': {
			return Object.assign({}, state, action.payload);
		}
	}
	return state;
}

export function fetchingReducer(state = false, action) {
	switch (action.type) {
		case 'FETCHING': {
			return action.isFetching
		}
	}
	return state;
}

export function selectedDateReducer(state = null, action) {
	switch (action.type) {
		case 'SET_SELECTED_DATE': {
			return action.payload;
        }
	}
	return state;
}

export function selectedMealReducer(state = 1, action) {
	switch (action.type) {
		case 'SET_SELECTED_MEAL': {
			return action.payload;
        }
	}
	return state;
}

export function dailyUIReducer(state={}, action) {
	switch (action.type) {
		case 'UPDATE_LOCAL_DAILY': {
			return Object.assign({}, state, action.payload);
	    }
	    case 'RESET_LOCAL': {
	    	return {};
	    }
	}
	return state;
}

export function mealsUIReducer(state={}, action) {
	switch (action.type) {
		case 'UPDATE_LOCAL_MEALS': {
	    	let {
	    		mealName, 
	    		data
	    	} = action.payload;
	    	
	    	let mealData = {
	    		[mealName]: data
	    	};
	    	
	    	if (state[mealName]) {
	    		mealData = {
	    			[mealName]: Object.assign({}, state[mealName], data)
	    		}
	    	} 

	    	return Object.assign({}, state, mealData);
	    }
	    case 'RESET_LOCAL': {
	    	return {};
	    }
	}
	return state;
}