var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    _ = require('lodash'),
                            
    Table = Bootstrap.Table,
    Input = Bootstrap.Input;

FoodJournalStats = React.createClass({

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
            <span className={classes}>{value.toFixed(1)}%</span>
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
            <span className={classes}>{value.toFixed(1)}</span>
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
                <div className="summary">
                    <div>
                        <span className="stat-label">Meal Total</span>
                        <span className="stat-amount">{stats.get('mealTotal')}</span>
                    </div>
                    <div>
                        <span className="stat-label">Days Exercised (Count)</span>
                        <span className="stat-amount">{stats.daysExercised()}</span>
                    </div>
                    <div>
                        <span className="stat-label">Days Exercised (%)</span>
                        {exercisedPercent}
                    </div>
                    <div>
                        <span className="stat-label">Healthy Meals (Count)</span>
                        <span className="stat-amount">{stats.mealsHealthy()}</span>
                    </div>
                    <div>
                        <span className="stat-label">Healthy Meals (%)</span>
                        {healthyPercent}
                    </div>
                    <div>
                        <span className="stat-label">Indulgent Meals (Count)</span>
                        <span className="stat-amount">{stats.indulgentMeals()}</span>
                    </div>
                    <div>
                        <span className="stat-label">Squares Total</span>
                        <span className="stat-amount">{stats.squareMealsTotal()}</span>
                    </div>
                    <div>
                        <span className="stat-label">Healthy Squares (Count)</span>
                        <span className="stat-amount">{stats.squareMealsHealthy()}</span>
                    </div>
                    <div>
                        <span className="stat-label">Healthy Squares (%)</span>
                        {healthySquaresPercent}
                    </div>
                    <div>
                        <span className="stat-label">Average Drinks (Per Day)</span>
                        {averageAlcohol}
                    </div>
                </div>
            );
        }
    },

    render: function() {
        var state = this.state,
            stats = state.stats,
            summarySection = this.getSummarySection();

        return (
            <div className="fj-stats">
                <Input type="select" label="Range" value={state.interval} onChange={this.handleIntervalChange.bind(this, 'interval')}>
                    <option value="365">Past Year</option>
                    <option value="90">3 Months</option>
                    <option value="30">Month</option>
                    <option value="14">2 Weeks</option>
                    <option value="7">Past Week</option>
                </Input>
                {summarySection}
            </div>
        );
    },

});
