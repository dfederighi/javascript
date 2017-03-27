var _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    Bootstrap = require('react-bootstrap'),
                            
    Model = Bootstrap.Modal,
    Input = Bootstrap.Input;

FoodJournalLogin = React.createClass({

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
             <Modal {...this.props} bsStyle="success" title="Food Journal Login" onRequestHide={this.props.onRequestHide} animation>
                <div className="modal-body">
                    <form method="post" onSubmit={this.handleSubmit}>
                        <Input type="text" label='Email' name="email" ref="email" bsStyle={inputStyle} placeholder="user@domain.com" hasFeedback />
                        <Input type="password" label='Password' ref="pass" name="pass" bsStyle={inputStyle} hasFeedback />
                        <Input type="submit" value="Login" />
                    </form>
                </div>
            </Modal>
        );
    }

});
