import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

export default class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            employees: [],
            filters: [{ key: '', value: '' }],
            sorters: ["name", "email", "department", "location"],
            currentSorter: "p.firstName"
        }

        this.handleChangeKey = this.handleChangeKey.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewFilter = this.handleNewFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.handleChangeSorter = this.handleChangeSorter.bind(this);
    }

    componentDidMount() {
        serverAPI("GET", "http://localhost/companydirectory/libs/php/getAll.php")
            .then(employees => this.setState({ isLoaded: true, employees: employees.data }))
            .catch((error) => this.setState({ isLoaded: true, error }));
    }

    handleChangeKey = (event) => {
        const index = Number(event.target.name.split('-')[1]);
        const currentFilters = this.state.filters.map((filter, ind) => {
            if ( ind === index ) {
                return {
                    key: event.target.value,
                    value: filter.value
                }
            } else return filter;
        });

        this.setState({ filters: currentFilters });
    }

    handleChangeValue = (event) => {
        const index = Number(event.target.name.split('-')[1]);
        const currentFilters = this.state.filters.map((filter, ind) => {
            if ( ind === index ) {
                return {
                    key: filter.key,
                    value: event.target.value
                }
            } else return filter;
        });

        this.setState({ filters: currentFilters });
    }

    handleChangeSorter = (event) => {
        this.setState({ currentSorter: event.target.value });
    }

    handleNewFilter = (event) => {
        const { filters } = this.state;
        if ( filters.length < 3 ) {
            this.setState({ filters: [ ...filters, { key: '', value: '' } ] });
        }
    }

    removeFilter = (event) => {
        if ( this.state.filters.length > 1 ) {
            const index = Number(event.target.name.split('-')[1]);
            const removedFilter = this.state.filters.filter((filter, ind) => ind !== index);
            
            this.setState({ filters: removedFilter });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        let filters = "";
        this.state.filters.forEach(filter => {
            filters += `${filter.key}=${filter.value}&`;
        })

        filters += `orderby=${this.state.currentSorter}`;
        
        serverAPI("GET", `http://localhost/companydirectory/libs/php/getAll.php?${filters}`)
            .then(employees => this.setState({ isLoaded: true, employees: employees.data }))
            .catch((error) => this.setState({ isLoaded: true, error }));
    }

    render() {
        const { error, isLoaded, employees, filters, sorters, currentSorter } = this.state;

        let filterInputs = filters.map((filter, index) => (
            <div key={`filter-${index}`} className="employees-form__filterline">
                <span className="employees-form__filterline--index">{index + 1}</span>
                <select name={`filter.key-${index}`} value={filter.key} onChange={this.handleChangeKey}>
                    <option value="jobTitle">Job Title</option>
                    <option value="department">Department</option>
                    <option value="location">Location</option>
                </select>

                <input type="text" name={`filter.value-${index}`} value={filter.value} placeholder="Add a filter..." onChange={this.handleChangeValue}/>

                <div className="employees-form__filtergroup-x_wrap">
                    <button className="employees-form__filtergroup-x" type="button" name={`filter.x-${index}`} onClick={this.removeFilter}>
                        X
                    </button>
                </div>
            </div>
        ))

        let sortingInput = (
            <div>
                <select name="sorting" value={currentSorter} onChange={this.handleChangeSorter}>
                    <option value="p.firstName">{sorters[0]}</option>
                    <option value="p.email">{sorters[1]}</option>
                    <option value="d.name">{sorters[2]}</option>
                    <option value="l.name">{sorters[3]}</option>
                </select>
            </div>
        );

        if ( error ) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {

            

            return (
                <div className="employees-container">
                    <div className="employees-form">
                        <form onSubmit={this.handleSubmit}>
                            <label>Filters</label>

                            <div className="employees-form__filtergroup">
                                { filterInputs }

                                <span className="employees-form__filtergroup-more">
                                    <button type="button" onClick={this.handleNewFilter}>
                                        More
                                    </button>
                                </span>
                            </div>

                            <hr/>

                            <label>Sort By</label>

                            <div className="employees-form__sortinggroup">
                                {sortingInput}
                            </div>

                            <div className="employees-form__submit_wrap">
                                <button type="submit" className="employees-form__submit">Submit</button>
                            </div>
                        </form>
                    </div>

                    
                    <ul className="employees">
                        {employees.map((employee, index) => (
                            <li key={`${employee.lastName}-${index}`}>
                                <div className="employee">
                                    <div className="employee__head">{employee.firstName} {employee.lastName}</div>
                                    <div className="employee__bottom">
                                        <div className="employee__bottom--avatar">{employee.firstName[0]}{employee.lastName[0]}</div>
                                        <div className="employee__bottom--info">
                                            <div className="employee__bottom--info-experience">{employee.experience} years of experience</div>
                                            <div className="employee__bottom--info-department">{employee.department}</div>
                                            <Link to={`/employee/${employee.id}`} className="employee__bottom--info-link"><div>More</div></Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    }
}