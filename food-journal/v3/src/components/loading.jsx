import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = (props) => {
	let isLoading = props.isLoading;
	let loadingClass = isLoading ? 'isLoading' : 'isLoaded';

	return (
		<div className={loadingClass}>
			<CircularProgress size={60} thickness={7} />
		</div>
	);
};

export default Loading;