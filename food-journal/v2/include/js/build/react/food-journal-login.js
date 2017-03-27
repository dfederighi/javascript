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
