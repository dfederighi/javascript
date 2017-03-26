const FJ_BLUE = '#193441';

const formStyles = {
    checkbox: {
        margin: 20,
        marginLeft: 10
    },
    checkboxLabel: {
        color: FJ_BLUE
    },
    select: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 20,
        width: 350
    },
    selectLabel: {
        color: FJ_BLUE
    },
    selectedMenuItemStyle: {
        color: FJ_BLUE
    },
    underlineStyle: {
        display: 'none'
    },
    floatingLabelStyle: {
        color: FJ_BLUE
    },
    textField: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 20,
        width: 350
    },
    textFieldLabel: {
        color: FJ_BLUE
    },
    radioButtonGroup: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 20
    },
    radioButton: {
        marginLeft: 30,
        display: 'inline-block',
        width: 120
    },
    radioButtonIconStyle: {
        marginRight: 4
    },
    radioButtonLabelStyle: {
        marginLeft: 5
    }
};

formStyles.checkboxProps = {
    style: formStyles.checkbox,
    labelStyle: formStyles.checkboxLabel,
    labelPosition: 'left'
};

formStyles.selectProps = {
    style: formStyles.select,
    underlineStyle: formStyles.underlineStyle,
    selectedMenuItemStyle: formStyles.selectedMenuItemStyle,
    floatingLabelStyle: formStyles.floatingLabelStyle
};

formStyles.textFieldProps = {
    floatingLabelStyle: formStyles.textFieldLabel,
    style: formStyles.textfield,
    underlineStyle: formStyles.underlineStyle
};

formStyles.radioButtonProps = {
    style: formStyles.radioButton,
    iconStyle: formStyles.radioButtonIconStyle,
    labelStyle: formStyles.radioButtonLabelStyle
};

export default formStyles;
