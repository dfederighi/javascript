import React from 'react';
import Snackbar from 'material-ui/Snackbar';

class JournalStatus extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			statusOpen: props.statusOpen
		};
	}


	handleRequestClose = () => {
	    this.setState({
	      statusOpen: false
	    });
  	};

  	render() {
		return (
			<Snackbar 
				open={this.state.statusOpen} 
				message={this.props.message} 
				autoHideDuration={3000}
          		onRequestClose={this.handleRequestClose}
			/>
		);
	}
}

JournalStatus.defaultProps = {
	statusOpen: false,
	message: 'Processing'
};

export default JournalStatus;