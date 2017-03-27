var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    _ = require('lodash'),
                            
    TabbedArea = Bootstrap.TabbedArea,
    TabPane = Bootstrap.TabPane,
    Input = Bootstrap.Input;

FoodJournalForm = React.createClass({

    statics: {
        DateKeys: [
            'JournalDateID',
            'Date',
            'Exercised',
            'Vitamins',
            'AlcoholCount',
            'CoffeeCount'
        ],
        MealDefaults: {
            MealType: 1,
            MealCategory: 0,
            MealContents: '',
            MealLocation: 1,
            Healthy: 1 
        }
    },

    getInitialState: function() {
        return {
            JournalDateID: null,
            Date: '',
            Exercised: false,
            Vitamins: false,
            AlcoholCount: 0,
            CoffeeCount: 0,
            Breakfast: {},
            Lunch: {},
            Dinner: {},
            Snacks: {},
            SelectedMealType: 1
        };
    },

    componentWillMount: function() {
        this.setStateWithProps(this.props.journalDate); 
    },

    componentWillReceiveProps: function(nextProps) {
        this.receivedProps(nextProps);
    },

    receivedProps: function(props) {
        this.setStateWithProps(props.journalDate);
    },

    setStateWithProps: function(journalDate) {
        if (journalDate && journalDate.attributes) {
            this.setState(_.pick(journalDate.attributes, FoodJournalForm.DateKeys));

            _.each(_.values(FoodJournal.MealTypes), function(mealType, index) {
                var change = {};
                if (journalDate.get(mealType).attributes) {
                    change[mealType] = journalDate.get(mealType).attributes;
                    this.setState(change);
                }
            }, this);

        } else {
            this.replaceState(this.getInitialState());
        }
    },

    handleChange: function(key, event) {
        var change = {},
            value;

        switch (key) {
            case 'Exercised':
            case 'Vitamins':
                value = event.target.checked ? 1 : 0; 
                break;
            case 'AlcoholCount':
            case 'CoffeeCount':
                value = parseInt(event.target.value);
                break;
            default:
                value = event.target.value;
        }
        change[key] = value;
        this.setState(change);
    },

    handleMealChange: function(key, event) {
        var state = this.state,
            change = {},
            selectedMealType = state.SelectedMealType,
            mealDefaults = _.clone(FoodJournalForm.MealDefaults),
            mealType, mealEntry, value;

        switch (key) {
            case 'Healthy':
                value = event.target.checked ? 1 : 0;
                break;
            case 'MealCategory':
            case 'MealLocation':
                value = parseInt(event.target.value);
                break;
            case 'MealType':
                value = parseInt(event.target.value);
                selectedMealType = value;
                this.setState({'SelectedMealType': value});
                break;
            case 'MealContents':
                value = event.target.value;
        }

        mealType = FoodJournal.MealTypes[selectedMealType];
        mealEntry = _.isEmpty(state[mealType]) ? mealDefaults : state[mealType];
        mealEntry[key] = value;
        change[mealType] = mealEntry;

        this.setState(change);
    },

    handleSubmit: function(event) {
        event.preventDefault();

        this.props.processSubmit(this.state);
    },

    render: function() {
        var state = this.state,
            mealType = FoodJournal.MealTypes[state.SelectedMealType],
            entry = _.isEmpty(state[mealType]) ? _.clone(FoodJournalForm.MealDefaults) : state[mealType];

        return (
            <div className="fj-tabs">
                <form onSubmit={this.handleSubmit}>
                    <TabbedArea defaultActiveKey={1} animation={false}>
                        <TabPane eventKey={1} tab="DAILY">
                            <Input type="checkbox" 
                                   label="Exercised" 
                                   value={true}
                                   checked={state.Exercised} 
                                   onChange={this.handleChange.bind(this, 'Exercised')} /> 
                            <Input type="checkbox" 
                                   label="Vitamins" 
                                   value={true}
                                   checked={state.Vitamins} 
                                   onChange={this.handleChange.bind(this, 'Vitamins')} /> 
                            <Input type="select" label="Alcohol Count" value={state.AlcoholCount} onChange={this.handleChange.bind(this, 'AlcoholCount')}>
                                <option value="0">None</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">More than 3</option>
                            </Input>
                            <Input type="select" label="Coffee Count" value={state.CoffeeCount} onChange={this.handleChange.bind(this, 'CoffeeCount')}>
                                <option value="0">None</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">More than 3</option>
                            </Input>
                        </TabPane>
                        <TabPane eventKey={2} tab="MEALS">
                            <Input type="select" label="Meal Type" value={state.MealType} onChange={this.handleMealChange.bind(this, 'MealType')}>
                                <option value="1">Breakfast</option>
                                <option value="2">Lunch</option>
                                <option value="3">Dinner</option>
                                <option value="4">Snack</option>
                            </Input>
                            <Input type="select" label="Meal Category" value={entry.MealCategory} onChange={this.handleMealChange.bind(this, 'MealCategory')}>
                                <option value="0">None</option>
                                <option value="1">Normal</option>
                                <option value="2">Vegetarian</option>
                                <option value="3">Vegan</option>
                            </Input>
                            <Input type="textarea" label='What I Ate' value={entry.MealContents} onChange={this.handleMealChange.bind(this, 'MealContents')} />
                            <h5>Where I Ate</h5>
                            <Input type="radio" 
                                   label="Home" 
                                   value={1} 
                                   checked={entry.MealLocation === 1} 
                                   onChange={this.handleMealChange.bind(this, 'MealLocation')} />
                            <Input type="radio" 
                                   label="Out" 
                                   value={2} 
                                   checked={entry.MealLocation === 2} 
                                   onChange={this.handleMealChange.bind(this, 'MealLocation')} />
                            <Input type="checkbox" 
                                   label="Healthy" 
                                   value={true}
                                   checked={entry.Healthy} 
                                   onChange={this.handleMealChange.bind(this, 'Healthy')} />
                        </TabPane>
                        <TabPane eventKey={3} tab="STATS">
                            <FoodJournalStats />
                        </TabPane>
                    </TabbedArea>
                    <Input type="submit" value="UPDATE" bsStyle="primary" />
                </form>
            </div>
        );
    },

});
