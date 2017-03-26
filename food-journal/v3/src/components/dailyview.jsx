import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

import formStyles from '../constants/formStyles';


const DailyView = (props) => {
    
    let {
        Exercised,
        Vitamins,
        AlcoholCount,
        CoffeeCount
    } = props;

    return (
        <div>
            <div className="element-container">
                <Checkbox 
                    label="Exercise" 
                    name="Exercised"
                    checked={Exercised} 
                    onCheck={props.onHandleCheck} 
                    {...formStyles.checkboxProps}
                />
            </div>
            <hr className="divider" />
            <div className="element-container">
                <Checkbox 
                    label="Vitamins" 
                    name="Vitamins"
                    checked={Vitamins} 
                    onCheck={props.onHandleCheck} 
                    {...formStyles.checkboxProps}
                />
            </div>
            <hr className="divider" />
            <div className="element-container">
                <SelectField
                    floatingLabelText="Alcohol (in Units)"
                    value={AlcoholCount}
                    onChange={props.onHandleSelect.bind(null, 'AlcoholCount')}
                    {...formStyles.selectProps} 
                >
                    <MenuItem value={0} primaryText="None" />
                    <MenuItem value={1} primaryText="1" />
                    <MenuItem value={2} primaryText="2" />
                    <MenuItem value={3} primaryText="3" />
                    <MenuItem value={4} primaryText="3+" />
                </SelectField> 
            </div>
            <hr className="divider" />      
            <div className="element-container">
                <SelectField
                    floatingLabelText="Coffees"
                    value={CoffeeCount} 
                    onChange={props.onHandleSelect.bind(null, 'CoffeeCount')}
                    {...formStyles.selectProps}  
                >
                    <MenuItem value={0} primaryText="None" />
                    <MenuItem value={1} primaryText="1" />
                    <MenuItem value={2} primaryText="2" />
                    <MenuItem value={3} primaryText="3" />
                    <MenuItem value={4} primaryText="3+" />
                </SelectField>
            </div>
            
        </div>
    );
};

// Maybe pull these defaultProps from a Config and use that same Config attribute 
// When saving daily data to server?
DailyView.defaultProps = {
    Exercised   : false,
    Vitamins    : false,
    AlcoholCount: 0,
    CoffeeCount : 0
};

export default DailyView;
