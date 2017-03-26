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
