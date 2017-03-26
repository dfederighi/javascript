import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {
    RadioButton, 
    RadioButtonGroup
} from 'material-ui/RadioButton';

import formStyles from '../constants/formStyles';


const MealsView = (props) => {
    let {
        MealType,
        MealCategory,
        MealContents,
        MealLocation, 
        Healthy
    } = props;

    return (
        <div>
            <div className="element-container">
                <SelectField
                    floatingLabelText="Meal"
                    value={MealType}
                    onChange={props.onHandleSelect.bind(null, 'MealType')}
                    {...formStyles.selectProps} 
                >
                    <MenuItem value={1} primaryText="Breakfast" />
                    <MenuItem value={2} primaryText="Lunch" />
                    <MenuItem value={3} primaryText="Dinner" />
                    <MenuItem value={4} primaryText="Snacks" />
                </SelectField>
            </div>
            <hr className="divider" />
            <div className="element-container">
                <SelectField
                    floatingLabelText="Category"
                    value={MealCategory}
                    onChange={props.onHandleSelect.bind(null, 'MealCategory')}
                    {...formStyles.selectProps} 
                >
                    <MenuItem value={0} primaryText="None" />
                    <MenuItem value={1} primaryText="Normal" />
                    <MenuItem value={2} primaryText="Vegetarian" />
                    <MenuItem value={3} primaryText="Vegan" />
                </SelectField>
            </div>
            <hr className="divider" />
            <div className="element-container">
                <TextField
                    name="MealContents" 
                    floatingLabelText="What I Ate" 
                    multiLine={true}
                    rows={2} 
                    value={MealContents} 
                    onChange={props.onHandleChange} 
                    {...formStyles.textFieldProps}
                />
            </div>
            <hr className="divider" />
            <div className="element-container">    
                <RadioButtonGroup 
                    name="MealLocation" 
                    onChange={props.onHandleChange} 
                    valueSelected={MealLocation} 
                    style={formStyles.radioButtonGroup}
                >
                    <RadioButton 
                        value={1} 
                        label="Home"
                        {...formStyles.radioButtonProps}
                    />
                    <RadioButton 
                        value={2} 
                        label="Out"
                        {...formStyles.radioButtonProps}
                    />
                </RadioButtonGroup>
            </div>
            <hr className="divider" />
            <div className="element-container">
                <Checkbox
                    label="Healthy" 
                    checked={Healthy} 
                    name="Healthy" 
                    onCheck={props.onHandleChange} 
                    {...formStyles.checkboxProps}
                />
            </div>
        </div> 
    );
};

// Maybe pull these defaultProps from a Config and use that same Config attribute 
// When saving back a meal in the saveMeals action?
MealsView.defaultProps = {
    MealType: 1,
    MealCategory: 0,
    MealContents: '',
    MealLocation: 1,
    Healthy: 1
};

export default MealsView;

