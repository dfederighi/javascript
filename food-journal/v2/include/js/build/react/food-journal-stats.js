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
