var _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Calendar = require('react-input-calendar'),

    Alert = Bootstrap.Alert,
    Input = Bootstrap.Input,
    Modal = Bootstrap.Modal;

FoodJournal = React.createClass({

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
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} dismissAfter={2000}>
                    <p>Saved</p>
                </Alert>
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
                <FoodJournalLogin onRequestHide={this.handleLoginDismiss} container={this} />
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
            <div className="fj modal-container">
                <div className="fj-calendar">
                    <Calendar
                        format="MM/DD/YYYY"
                        date={this._selected.Date}
                        computableFormat="YYYY-MM-DD" 
                        onChange={this.onCalendarChange} 
                    />
                </div>
                {calendarAlert}
                <FoodJournalForm journalDate={journalDate} processSubmit={this.processSubmit} />
                {loginModal}
            </div>
        );
    }

});

React.render(
  <FoodJournal />,
  document.getElementById('fj-container')
);
