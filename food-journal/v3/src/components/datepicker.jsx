import React from 'react';
import Moment from 'moment';
import {MdChevronLeft, MdChevronRight} from 'react-icons/lib/md';


export default class DatePicker extends React.Component {
    constructor(props) {
        super(props); 

        let current = new Date();
        this.state = {
            month: current.getMonth(),
            date: current.getDate(),
            year: current.getYear()
        };
    }

    componentDidUpdate() {
        let state = this.state;
        let props = this.props;

        if (props.callback) {
            props.callback({
                month: state.month, 
                date: state.date, 
                year: state.year
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return Object.keys(this.state).some((key) => {
            return this.state[key] !== nextState[key];
        });
    }

    componentDidMount() {
        let state = this.state;
        let props = this.props;
        
        if (props.callback) {
            props.callback({
                month: state.month,
                date: state.date,
                year: state.year
            });
        }
    }

    render() {
        let state = this.state;
        
        // TODO: Clean this all up!
        return (
            <div className="calendar-container">
                <div className="prev-control">
                    <a href="#" onClick={this.prev}><MdChevronLeft /></a>
                </div>
                <div className="calendar-display">
                    <div className="date-all">
                        <div className="top-row">
                            <div className="mmm-ddd">
                                <div className="mmm">{this.getFormattedMonth()}</div>
                                <div className="ddd">{this.getFormattedWeekday()}</div>
                            </div>
                            <div className="big-dd">{this.getFormattedDate()}</div>
                        </div>
                        <div className="bottom-row">
                            <div className="yyyy">{this.getFormattedYear()}</div>
                        </div>
                    </div>
                </div>
                <div className="next-control">
                    <a href="#" onClick={this.next}><MdChevronRight /></a>
                </div>
            </div>
        );
        
    }

	prev = (e) => {
        e.preventDefault();

        let state = this.state;

		let {
			month: currentMonth,
			date: currentDate,
			year: currentYear
		} = state;

        let beginMonth = (currentDate === 1);         
        let beginYear = (currentMonth === 0);
		let prevYear = currentYear - 1;
    
        if (beginYear && beginMonth) {
            this.setState({
                year: prevYear,
                month: 11,
                date: new Date(prevYear, 12, 0).getDate() 
            });
            return;
        }

        if (!beginYear && beginMonth) {
            this.setState({
                month: currentMonth - 1,
                date: new Date(currentYear, currentMonth, 0).getDate()
            });
            return;
        }

        this.setState({
            date: currentDate - 1
        });
        return;
    }

	next = (e) => {
        e.preventDefault();

        let state = this.state;

		let {
			month: currentMonth,
			date: currentDate,
			year: currentYear
		} = state;

		let nextMonth = currentMonth + 1;
        let lastDateInMonth = new Date(currentYear, nextMonth, 0).getDate();

        let endMonth = (currentDate === lastDateInMonth);
        let endYear = (currentMonth === 11);

        if (endYear && endMonth) {
            this.setState({
                year: currentYear + 1,
                month: 0,
                date: 1
            });
            return;
        }

        if (!endYear && endMonth) {
            this.setState({
                month: nextMonth,
                date: 1
            });
            return;
        }

        this.setState({
            date: currentDate + 1
        });
        return;
    }

    getFormattedMonth() {
        let state = this.state;
        let date = new Date(state.year + 1900, state.month, state.date);
        return Moment(date).format('MMM');
    }

    getFormattedDate() {
        let state = this.state;
        let date = new Date(state.year + 1900, state.month, state.date);
        return Moment(date).format('DD');
    }

    getFormattedYear() {
        return this.state.year + 1900;
    }

    getFormattedWeekday() {
        let state = this.state;
        let date = new Date(state.year + 1900, state.month, state.date);
        return Moment(date).format('ddd');
    }

}
