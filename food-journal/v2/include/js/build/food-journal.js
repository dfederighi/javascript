var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone');

var journalDateModel = Backbone.Model.extend({
    idAttribute: 'JournalDateID',
    
    defaults: {
        JournalDateID: '',
        AlcoholCount: 0,
        CoffeeCount: 0,
        Date: '',
        Exercised: 0,
        Vitamins: 0,
        Breakfast: {},
        Lunch: {},
        Dinner: {},
        Snacks: {}
    },
    getCustomUrl: function (method) {
        let a = ((b) => {
            console.log('b:', b);
        });
        var asyncPath = FoodJournal.Async.Path.JournalDates,
            url = '';

        switch (method) {
            case 'create':
                url = asyncPath + '/create.php';
                break;
            case 'update':
                url = asyncPath + '/update.php';
                break;
            case 'delete':
                url = asyncPath + '/delete.php';
                break;
        }
        return url;
    },
    sync: function (method, model, options) {
        if (!options) { options = {}; }

        Backbone.$ = $;
        Backbone.emulateHTTP = true;
        Backbone.emulateJSON = true;

        options.url = this.getCustomUrl(method.toLowerCase());

        if (method === 'update' || method === 'create') {
            options.data = _.omit(model.attributes, _.values(FoodJournal.MealTypes));
        }
        
        return Backbone.sync.apply(this, arguments);
    }
});

var journalDateCollection = Backbone.Collection.extend({
    model: journalDateModel,
    getByDate: function(date) {
        return this.findWhere({'Date':date});
    }
});

var journalEntryModel = Backbone.Model.extend({
    idAttribute: 'JournalEntryID',
    defaults: {
        JournalEntryID: '',
        JournalDateID: '',
        Date: '',
        Healthy: 0,
        MealCategory: 0,
        MealContents: '',
        MealLocation: 0,
        Feeling: 0,
        MealType: 1
    },
    getCustomUrl: function (method) {
        var asyncPath = FoodJournal.Async.Path.JournalEntries,
            url = '';

        /* Shouldn't need this, but it doesn't reconize that JournalEntryID is empty? */
        if (_.isEmpty(this.get('JournalEntryID'))) { method = 'create'; }

        switch (method) {
            case 'create':
                url = asyncPath + '/create.php';
                break;
            case 'update':
                url = asyncPath + '/update.php';
                break;
            case 'delete':
                url = asyncPath + '/delete.php';
                break;
        }
        return url;
    },  
    sync: function (method, model, options) {
        if (!options) { options = {}; }
            
        Backbone.$ = $;
        Backbone.emulateHTTP = true;
        Backbone.emulateJSON = true;
    
        options.url = this.getCustomUrl(method.toLowerCase());

        if (method === 'update' || method === 'create') {
            options.data = model.attributes;
        }
        
        return Backbone.sync.apply(this, arguments);
    }
});

var journalEntryCollection = Backbone.Collection.extend({
    model: journalEntryModel
});

var journalStatsModel = Backbone.Model.extend({
    initialize: function() {
        _.bindAll(this);
    },
    defaults: {
        interval: 7,
        mealTotal: 0,
        dayTotal: 0,
        data: {}
    },
    daysExercised: function() {
        return _.where(this.get('data').dates, {'Exercised':1}).length; 
    },
    percentExercised: function() {
        return (this.daysExercised() / this.get('dayTotal') * 100);
    }, 
    dailyAverageAlcohol: function() {
        var totalAlcohol = _.reduce(this.get('data').dates, function(result, date) {
            return result + date.AlcoholCount;
        }, 0);

        return totalAlcohol / this.get('dayTotal');        
    },
    mealsHealthy: function() {
        return _.where(this.get('data').entries, {'Healthy':1}).length;
    },
    percentHealthy: function() {
        return (this.mealsHealthy() / this.get('mealTotal') * 100);
    },
    indulgentMeals: function() {
        return this.get('mealTotal') - this.mealsHealthy();
    },

    /* Maybe refer to these methods as Meal methods and the ones above as Entry methods? */
    squareMealsTotal: function() {
        return _.filter(this.get('data').entries, function(entry) {
            return entry.MealType !== 4;
        }).length;
    },
    squareMealsHealthy: function() {
        return _.filter(this.get('data').entries, function(entry) {
            return (entry.Healthy === 1 && entry.MealType !== 4);
        }).length;
    },
    squarePercentHealthy: function() {
        return (this.squareMealsHealthy() / this.squareMealsTotal() * 100);
    },

    getCustomUrl: function (method) {
        var asyncPath = FoodJournal.Async.Path.JournalStats,
            url = '';

        switch (method) {
            case 'read':
                url =  asyncPath + '/get.php';
                break;
            default:
                break;
        }
        return url;
    },
    sync: function (method, model, options) {
        if (!options) { options = {}; }

        Backbone.$ = $;
        Backbone.emulateHTTP = true;
        Backbone.emulateJSON = true;

        options.url = this.getCustomUrl(method.toLowerCase());

        options.data = {'Interval': model.get('interval')};

        return Backbone.sync.apply(this, arguments);
    }
});
var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    _ = require('lodash'),
                            
    TabbedArea = Bootstrap.TabbedArea,
    TabPane = Bootstrap.TabPane,
    Input = Bootstrap.Input;

FoodJournalForm = React.createClass({displayName: "FoodJournalForm",

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
            React.createElement("div", {className: "fj-tabs"}, 
                React.createElement("form", {onSubmit: this.handleSubmit}, 
                    React.createElement(TabbedArea, {defaultActiveKey: 1, animation: false}, 
                        React.createElement(TabPane, {eventKey: 1, tab: "DAILY"}, 
                            React.createElement(Input, {type: "checkbox", 
                                   label: "Exercised", 
                                   value: true, 
                                   checked: state.Exercised, 
                                   onChange: this.handleChange.bind(this, 'Exercised')}), 
                            React.createElement(Input, {type: "checkbox", 
                                   label: "Vitamins", 
                                   value: true, 
                                   checked: state.Vitamins, 
                                   onChange: this.handleChange.bind(this, 'Vitamins')}), 
                            React.createElement(Input, {type: "select", label: "Alcohol Count", value: state.AlcoholCount, onChange: this.handleChange.bind(this, 'AlcoholCount')}, 
                                React.createElement("option", {value: "0"}, "None"), 
                                React.createElement("option", {value: "1"}, "1"), 
                                React.createElement("option", {value: "2"}, "2"), 
                                React.createElement("option", {value: "3"}, "3"), 
                                React.createElement("option", {value: "4"}, "More than 3")
                            ), 
                            React.createElement(Input, {type: "select", label: "Coffee Count", value: state.CoffeeCount, onChange: this.handleChange.bind(this, 'CoffeeCount')}, 
                                React.createElement("option", {value: "0"}, "None"), 
                                React.createElement("option", {value: "1"}, "1"), 
                                React.createElement("option", {value: "2"}, "2"), 
                                React.createElement("option", {value: "3"}, "3"), 
                                React.createElement("option", {value: "4"}, "More than 3")
                            )
                        ), 
                        React.createElement(TabPane, {eventKey: 2, tab: "MEALS"}, 
                            React.createElement(Input, {type: "select", label: "Meal Type", value: state.MealType, onChange: this.handleMealChange.bind(this, 'MealType')}, 
                                React.createElement("option", {value: "1"}, "Breakfast"), 
                                React.createElement("option", {value: "2"}, "Lunch"), 
                                React.createElement("option", {value: "3"}, "Dinner"), 
                                React.createElement("option", {value: "4"}, "Snack")
                            ), 
                            React.createElement(Input, {type: "select", label: "Meal Category", value: entry.MealCategory, onChange: this.handleMealChange.bind(this, 'MealCategory')}, 
                                React.createElement("option", {value: "0"}, "None"), 
                                React.createElement("option", {value: "1"}, "Normal"), 
                                React.createElement("option", {value: "2"}, "Vegetarian"), 
                                React.createElement("option", {value: "3"}, "Vegan")
                            ), 
                            React.createElement(Input, {type: "textarea", label: "What I Ate", value: entry.MealContents, onChange: this.handleMealChange.bind(this, 'MealContents')}), 
                            React.createElement("h5", null, "Where I Ate"), 
                            React.createElement(Input, {type: "radio", 
                                   label: "Home", 
                                   value: 1, 
                                   checked: entry.MealLocation === 1, 
                                   onChange: this.handleMealChange.bind(this, 'MealLocation')}), 
                            React.createElement(Input, {type: "radio", 
                                   label: "Out", 
                                   value: 2, 
                                   checked: entry.MealLocation === 2, 
                                   onChange: this.handleMealChange.bind(this, 'MealLocation')}), 
                            React.createElement(Input, {type: "checkbox", 
                                   label: "Healthy", 
                                   value: true, 
                                   checked: entry.Healthy, 
                                   onChange: this.handleMealChange.bind(this, 'Healthy')})
                        ), 
                        React.createElement(TabPane, {eventKey: 3, tab: "STATS"}, 
                            React.createElement(FoodJournalStats, null)
                        )
                    ), 
                    React.createElement(Input, {type: "submit", value: "UPDATE", bsStyle: "primary"})
                )
            )
        );
    },

});
var _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    Bootstrap = require('react-bootstrap'),
                            
    Model = Bootstrap.Modal,
    Input = Bootstrap.Input;

FoodJournalLogin = React.createClass({displayName: "FoodJournalLogin",

    getInitialState: function() {
        return {
            'formInputStyle': ''
        };
    },

    handleSubmit: function(event) {
        event.preventDefault();

        $.getJSON(FoodJournal.Async.Path.User + '/login.php', {
            'Email': this.refs.email.getValue(),
            'Pass': this.refs.pass.getValue()
        }, function(result) {
            if (result.status === 'success') {
                location.reload(true);
            } else {
                this.setState({'formInputStyle': 'error'});
            }
        }.bind(this));
    },

    render: function() {
        var state = this.state,
            inputStyle = state.formInputStyle;
            
        return (
             React.createElement(Modal, React.__spread({},  this.props, {bsStyle: "success", title: "Food Journal Login", onRequestHide: this.props.onRequestHide, animation: true}), 
                React.createElement("div", {className: "modal-body"}, 
                    React.createElement("form", {method: "post", onSubmit: this.handleSubmit}, 
                        React.createElement(Input, {type: "text", label: "Email", name: "email", ref: "email", bsStyle: inputStyle, placeholder: "user@domain.com", hasFeedback: true}), 
                        React.createElement(Input, {type: "password", label: "Password", ref: "pass", name: "pass", bsStyle: inputStyle, hasFeedback: true}), 
                        React.createElement(Input, {type: "submit", value: "Login"})
                    )
                )
            )
        );
    }

});
var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    _ = require('lodash'),
                            
    Table = Bootstrap.Table,
    Input = Bootstrap.Input;

FoodJournalStats = React.createClass({displayName: "FoodJournalStats",

    statics: {
        PercentageMins: {
            'Exercised': 60,
            'Healthy': 92
        },
    
        AverageMax: {
            'Alcohol': 2
        }
    },

    getInitialState: function() {
        return {
            interval: 365,
            stats: {}
        };
    },

    componentWillMount: function() {
        var stats = new journalStatsModel({'interval':this.state.interval}),
            self = this;

        stats.fetch({
            success: function() {
                self.setState({'stats':stats});
            }
        });
    },

    handleIntervalChange: function(key, event) {
        var state = this.state,
            stats = state.stats,
            self = this,
            change = {},
            interval = parseInt(event.target.value);

        change[key] = interval;
        this.setState(change);

        stats.set('interval', interval);
        stats.fetch({
            success: function() {
                self.setState({'stats':stats});
            } 
        }); 
    },

    formatPercent: function(key, value) {
        var min = FoodJournalStats.PercentageMins[key],
            cx = React.addons.classSet,
            classes = cx({
                'good': value > min,
                'bad': min > value,
                'stat-amount': true
            });

        return (
            React.createElement("span", {className: classes}, value.toFixed(1), "%")
        ); 
    },

    formatAverage: function(key, value) {
        var max = FoodJournalStats.AverageMax[key],
            cx = React.addons.classSet,
            classes = cx({
                'good': max > value,
                'bad': value > max,
                'stat-amount': true
            });

        return (
            React.createElement("span", {className: classes}, value.toFixed(1))
        );
    },

    getSummarySection: function() {
        var state = this.state,
            stats = state.stats,
            exercisedPercent, healthyPercent, healthySquaresPercent;

        if (!_.isEmpty(stats)) {
            exercisedPercent = this.formatPercent('Exercised', stats.percentExercised());
            healthyPercent = this.formatPercent('Healthy', stats.percentHealthy()); 
            healthySquaresPercent = this.formatPercent('Healthy', stats.squarePercentHealthy()); 
            averageAlcohol = this.formatAverage('Alcohol', stats.dailyAverageAlcohol());

            return (
                React.createElement("div", {className: "summary"}, 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Meal Total"), 
                        React.createElement("span", {className: "stat-amount"}, stats.get('mealTotal'))
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Days Exercised (Count)"), 
                        React.createElement("span", {className: "stat-amount"}, stats.daysExercised())
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Days Exercised (%)"), 
                        exercisedPercent
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Healthy Meals (Count)"), 
                        React.createElement("span", {className: "stat-amount"}, stats.mealsHealthy())
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Healthy Meals (%)"), 
                        healthyPercent
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Indulgent Meals (Count)"), 
                        React.createElement("span", {className: "stat-amount"}, stats.indulgentMeals())
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Squares Total"), 
                        React.createElement("span", {className: "stat-amount"}, stats.squareMealsTotal())
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Healthy Squares (Count)"), 
                        React.createElement("span", {className: "stat-amount"}, stats.squareMealsHealthy())
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Healthy Squares (%)"), 
                        healthySquaresPercent
                    ), 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "stat-label"}, "Average Drinks (Per Day)"), 
                        averageAlcohol
                    )
                )
            );
        }
    },

    render: function() {
        var state = this.state,
            stats = state.stats,
            summarySection = this.getSummarySection();

        return (
            React.createElement("div", {className: "fj-stats"}, 
                React.createElement(Input, {type: "select", label: "Range", value: state.interval, onChange: this.handleIntervalChange.bind(this, 'interval')}, 
                    React.createElement("option", {value: "365"}, "Past Year"), 
                    React.createElement("option", {value: "90"}, "3 Months"), 
                    React.createElement("option", {value: "30"}, "Month"), 
                    React.createElement("option", {value: "14"}, "2 Weeks"), 
                    React.createElement("option", {value: "7"}, "Past Week")
                ), 
                summarySection
            )
        );
    },

});
var _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Calendar = require('react-input-calendar'),

    Alert = Bootstrap.Alert,
    Input = Bootstrap.Input,
    Modal = Bootstrap.Modal;

FoodJournal = React.createClass({displayName: "FoodJournal",

    _selected: {
        'Month': '',
        'Year': '',
        'Date': ''
    },

    statics: {
        MealTypes: {
            1: 'Breakfast',
            2: 'Lunch',
            3: 'Dinner',
            4: 'Snacks'
        },
        Async: {
            Path: {
                'JournalDates': 'http://food-journal.federighi.net/async/journaldates',
                'JournalEntries': 'http://food-journal.federighi.net/async/journalentries',
                'JournalStats': 'http://food-journal.federighi.net/async/journalstats',
                'User': 'http://food-journal.federighi.net/async/user'
            }       
        }
    },
    
    getInitialState: function(){
        return { 
            userId: 0,
            journalDate: {},
            journalDates: {},
            journalEntries: {},
            alertVisible: false,
            loginVisible: false
        };
    },

    componentDidMount: function() {
        if (!_.isEmpty(this.getCookie('fj-user'))) {
            this.getJournalDatesForSelection();
        } else {
            this.handleLoginShow();
        }
    },

    getCookie: function(name) {
        var rval = '';

        _.find(document.cookie.split(';'), function(cookie) { 
            var parts = cookie.split('='), 
            key = parts[0], 
            value = parts[1];

            if (name === key) {
                rval = value;
                return true;
            }
        });

        return rval;
    },

    getJournalDatesForSelection: function() {
        $.getJSON(FoodJournal.Async.Path.JournalDates + '/get.php', {
            'Month': this._selected.Month,
            'Year': this._selected.Year
        }, function(result) {
            this._initializeModels(result);
        }.bind(this)); 
    },

    _initializeModels: function(data) {
        var mealTypes = FoodJournal.MealTypes,
            dateCollection = new journalDateCollection(data.journaldates),
            entryCollection = new journalEntryCollection(data.journalentries);

        entryCollection.forEach(function (model, index) {
            dateCollection.getByDate(model.get('Date')).set(mealTypes[model.get('MealType')], model);
        });

        if (_.size(dateCollection) > 0) {
            this.setState({
                'journalDates': dateCollection,
                'journalEntries': entryCollection
            });
        }
    },

    onCalendarChange: function(date) {
        var journalDates = this.state.journalDates,
            parsedDate = this._parseDate(date),
            fetchDates = false,
            journalDate;

        if (parsedDate.Month !== this._selected.Month) {
            fetchDates = true;
        }

        this._selected = parsedDate;

        if (fetchDates) {
            this.getJournalDatesForSelection();
        }

        if (_.size(journalDates) > 0 && journalDates.getByDate(date)) {
            this.setState({'journalDate': journalDates.getByDate(date)});
        } else {
            this.setState({'journalDate': {}});
        }
    },

    _parseDate: function(date) {
        return {
            'Date': date,
            'Month': date.substr(5,2),
            'Year': date.substr(0,4)
        };
    },

    _getCurrentDate: function() {
        var date = new Date(),
            month = date.getMonth() + 1,
            getDate = date.getDate(), 
            thisMonth = (month < 10 ? '0' + month : month),
            thisDate = (getDate < 10 ? '0' + getDate : getDate);

        return date.getFullYear() + '-' + thisMonth + '-' + thisDate;
    },

    processSubmit: function(data) {
        var state = this.state,
            journalDates = state.journalDates,
            dateData = _.omit(data, _.values(FoodJournal.MealTypes)),
            selectedDate = this._selected.Date,
            self = this,
            dateModel;

        if (data.JournalDateID) {
            dateModel = journalDates.getByDate(selectedDate);
            dateModel.set(dateData);
        } else {
            dateData.Date = selectedDate;
            dateModel = new journalDateModel(dateData);
        } 

        dateModel.save({}, {
            success: function(model, res, opts) {
                if (res.response.JournalDateID) {
                    dateModel.set('JournalDateID', res.response.JournalDateID);
                    journalDates.add(dateModel);
                    self.setState({'journalDates': journalDates});
                }
                self.handleAlertShow();
                self.saveMeals(data);
            },
            error: function (model, res, opts) {
                console.log({
                    'message': 'error',
                    'method': 'processSubmit',
                    'action': 'dateModel.save',
                    'data': {'model':model,'res':res,'opts':opts}
                });
            }
        });
    },

    saveMeals: function(data) {
        var journalDates = this.state.journalDates,
            journalEntries = this.state.journalEntries,
            selectedDate = this._selected.Date,
            dateModel = journalDates.getByDate(selectedDate),
            self = this;

        _.each(_.values(FoodJournal.MealTypes), function(mealType, index) {
            if (!_.isEmpty(data[mealType])) {
                var entryModel;

                if (data[mealType].JournalEntryID) {
                    entryModel = journalEntries.get(data[mealType].JournalEntryID);
                    entryModel.set(data[mealType]);
                } else {
                    _.assign(data[mealType], {
                        Date: self._selected.Date,
                        JournalDateID: dateModel.get('JournalDateID')
                    });
                    entryModel = new journalEntryModel(data[mealType]);
                }

                entryModel.save({}, {
                    success: function(model, res, opts) {
                        if (res.response.JournalEntryID) {
                            entryModel.set('JournalEntryID', res.response.JournalEntryID);
                        }
                        dateModel.set(mealType, entryModel);
                        journalEntries.add(entryModel, {merge: true});
                        self.setState({'journalDate': dateModel});
                    },
                    error: function(model, res, opts) {
                        console.log({
                            'message': 'error',
                            'method': 'saveMeals',
                            'action': 'entryModel.save',
                            'data': {'model':model,'res':res,'opts':opts} 
                        });
                    }
                });
            }
        }); 
    },

    getAlert: function() {
        if (this.state.alertVisible) {
            return (
                React.createElement(Alert, {bsStyle: "success", onDismiss: this.handleAlertDismiss, dismissAfter: 2000}, 
                    React.createElement("p", null, "Saved")
                )
            );
        }
    },

    handleAlertDismiss: function() {
        this.setState({'alertVisible': false});
    },

    handleAlertShow: function() {
        this.setState({'alertVisible': true});
    },

    getLogin: function() {
        if (this.state.loginVisible) {
            return (
                React.createElement(FoodJournalLogin, {onRequestHide: this.handleLoginDismiss, container: this})
            );
        }
    },

    handleLoginDismiss: function() {
        this.setState({'loginVisible': false});
    },

    handleLoginShow: function() {
        this.setState({'loginVisible': true});
    },

    render: function() {
        var state = this.state,
            journalDate = state.journalDate,
            journalDates = state.journalDates,
            calendarAlert = this.getAlert(),
            loginModal = this.getLogin();

        if (!this._selected.Date) {
            var currentDate = this._getCurrentDate();
            this._selected = this._parseDate(currentDate);
        }

        if (_.isEmpty(journalDate)) {
            if (!_.isEmpty(journalDates)) {
                journalDate = journalDates.getByDate(this._selected.Date);
            }
        }

        return (
            React.createElement("div", {className: "fj modal-container"}, 
                React.createElement("div", {className: "fj-calendar"}, 
                    React.createElement(Calendar, {
                        format: "MM/DD/YYYY", 
                        date: this._selected.Date, 
                        computableFormat: "YYYY-MM-DD", 
                        onChange: this.onCalendarChange}
                    )
                ), 
                calendarAlert, 
                React.createElement(FoodJournalForm, {journalDate: journalDate, processSubmit: this.processSubmit}), 
                loginModal
            )
        );
    }

});

React.render(
  React.createElement(FoodJournal, null),
  document.getElementById('fj-container')
);
