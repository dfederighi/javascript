import 'whatwg-fetch';

import { ASYNC_URL_PREFIX } from '../constants/urlsConfig';
import { 
    MEAL_TYPE_NAMES, 
    MEAL_TYPE_VALUES
} from '../constants/mealsConfig'; 

// TODO: Auth!!!
// TODO: Message in FE onSaveData()

export function fetchedDaily(data = {}) {
    return {
        type: 'HYDRATE_DAILY',
        payload: data
    }
}

export function fetchedMeals(data = {}) {
    return {
        type: 'HYDRATE_MEALS',
        payload: data
    }
}

export function setDate(selectedDate) {
    return {
        type: 'SET_SELECTED_DATE',
        payload: selectedDate
    }
}

export function setMeal(selectedMeal) {
    return {
        type: 'SET_SELECTED_MEAL',
        payload: selectedMeal
    }
}

export function updateDailyLocalUI(data = {}) {
    return {
        type: 'UPDATE_LOCAL_DAILY',
        payload: data
    }
}

export function updateMealsLocalUI(mealName, data = {}) {
    return {
        type: 'UPDATE_LOCAL_MEALS',
        payload: {mealName: mealName, data: data}
    }
}

export function resetLocalUI() {
    return {
        type: 'RESET_LOCAL'
    }
}

export function isFetching(fetching) {
    return {
        type: 'FETCHING',
        isFetching: fetching
    }
}

export function saveData() {
    
    return function (dispatch, getState) {
        let state = getState();
        let selectedDate = state.selectedDate;
        let dailySaved = state.daily[selectedDate] || {};

        let dailyData = Object.assign({}, dailySaved, state.dailyUI);

        if (!dailyData.Date) {
            dailyData.Date = selectedDate;
        }
        
        let haveDaily = Object.keys(state.dailyUI).length; 
        if (!dailySaved.JournalDateID || haveDaily) {
            dispatch(saveDaily(dailyData));
        } else {
            dispatch(saveMeals({JournalDateID: dailySaved.JournalDateID}));
        }  
        
    }
}

export function saveDaily(data) {
    return function (dispatch, getState) {
        let state = getState();
        let selectedDate = state.selectedDate;
        let dailySaved = state.daily[selectedDate] || {};

        return fetch(ASYNC_URL_PREFIX + 'daily/save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'same-origin'
        }).then((result) => {
            if (result.status === 200) {
                return result.json();
            }
        }).then((json) => {
            let journalDateId = json.response.JournalDateID || dailySaved.JournalDateID;
            dispatch(saveMeals({JournalDateID: journalDateId}));
        }).catch((err) => {
            console.log('journalActions:saveDaily():err:', err);
        });
    }
}

// TODO: Refactor this!!! Feel it's sloppy
export function saveMeals(data) {
    return function(dispatch, getState) {
        let state = getState();
        let selectedDate = state.selectedDate;
        let mealsData = state.meals[selectedDate] || {};

        let mealJobs = [];
        MEAL_TYPE_NAMES.forEach(function (element) {
            if (state.mealsUI[element]) {
                let mealData = mealsData[element] || {};
                let meal = Object.assign({}, mealData, state.mealsUI[element]);
                
                Object.assign(data, {
                    [element]: meal
                });

                if (!meal.Date) {
                    meal.Date = selectedDate;
                }

                // Issue with defaults - ???
                if (!meal.MealLocation) {
                    meal.MealLocation = 1;
                }


                meal.JournalDateID = data.JournalDateID;
                meal.MealType = MEAL_TYPE_VALUES[element];

                mealJobs.push(dispatch(saveMeal(meal)));
            }
        });

        Promise.all(mealJobs).then(() => {
            dispatch(getDateMeals());
            dispatch(resetLocalUI());
        });

    }
}

export function saveMeal(data) {
    return (dispatch, getState) => {
        
        fetch(ASYNC_URL_PREFIX + 'meals/save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'same-origin'
        }).then((result) => {
            if (result.status === 200) {
                return result.json();
            }
        }).then((json) => {
            console.log('saveMeal:json:', json);
        }).catch((err) => {
            console.log('err:', err);
        });
        
    }
}


export function getDateMeals() {
    return function(dispatch, getState) {
        let state = getState();

        dispatch(isFetching(true));

        let url = ASYNC_URL_PREFIX + 'get.php?date=' + state.selectedDate;

        return fetch(url).then((result) => {
            if (result.status === 200) {
                return result.json();
            }
        }).then((jsonResult) => {
            dispatch(isFetching(false));
            dispatch(fetchedDaily(jsonResult.journaldates));
            dispatch(fetchedMeals(jsonResult.journalentries));
        }).catch((err) => {
            console.log('getDateMeals():err:', err);
            dispatch(isFetching(false));
        });
    }
}
