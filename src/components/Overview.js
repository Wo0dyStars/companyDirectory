import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

const Departments = ["Human Resources", "Sales", "Marketing", "Legal", "Services", "Research and Development", "Product Management", "Training", "Support", "Engineering", "Accounting", "Business Development"];

export default class Overview extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            error: null,
            isLoaded: false,
            employees: [],
            filters: [],
            sorters: [["name", "p.firstName"], ["email", "p.email"], ["department", "d.name"], ["location", "l.name"]],
            currentSorter: "p.firstName",
            currentSorting: "ASC",
            successOnDeletion: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeSorter = this.handleChangeSorter.bind(this);
        this.handleChangeSorting = this.handleChangeSorting.bind(this);
    }

    componentDidMount() {
        serverAPI("GET", "http://localhost/companydirectory/libs/php/getAll.php")
            .then(employees => {
                this.setState({ isLoaded: true, employees: employees.data })
            })
            .catch((error) => this.setState({ isLoaded: true, error }));
    }

    handleChange = (event) => {
        let found = false;
        const currentFilters = this.state.filters.map((filter) => {
            if ( filter.key === event.target.name) {
                found = true;
                return {
                    key: event.target.name,
                    value: event.target.value
                }
            } else return filter;
        });

        if ( !event.target.value || event.target.value === "select" ) {
            this.setState({ filters: this.state.filters.filter(f => f.key !== event.target.name) });
        } else {
            if ( found ) { this.setState({ filters: currentFilters }); }
            else { this.setState({ filters: [ ...this.state.filters, {key: event.target.name, value: event.target.value} ] }) };
        }
    }

    handleChangeSorter = (event) => {
        this.setState({ currentSorter: event.target.value });
    }

    handleChangeSorting = (event) => {
        this.setState({ currentSorting: event.target.value });
    }

    handleDelete = (event) => {
        console.log(event.target.value);

        serverAPI("POST", "http://localhost/companydirectory/libs/php/deleteEmployee.php", JSON.stringify({id: event.target.value}))
        .then((res) => {
            console.log(res);
            const person = this.state.employees.filter(employee => employee.id === event.target.value)[0];
            const personName = person.firstName + " " + person.lastName;
            this.setState({ employees: this.state.employees.filter(employee => employee.id !== event.target.value),
                            successOnDeletion: `You have now successfully deleted ${personName} from your directory.` });
        })
        .catch((e) => console.log(e));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        let filters = "";
        this.state.filters.forEach(filter => {
            filters += `${filter.key}=${filter.value}&`;
        })

        filters += `orderby=${this.state.currentSorter}&`;
        filters += `orderdir=${this.state.currentSorting}`;

        console.log(filters);
        
        serverAPI("GET", `http://localhost/companydirectory/libs/php/getAll.php?${filters}`)
            .then(employees => this.setState({ isLoaded: true, employees: employees.data }))
            .catch((error) => this.setState({ isLoaded: true, error }));
    }

    componentDidUpdate() {
        setTimeout(() => this.setState({successOnDeletion: ""}), 7500);
    }

    render() {
        const { error, isLoaded, employees, filters, sorters, currentSorter, currentSorting, successOnDeletion } = this.state;
        console.log(employees);
        const departments = Departments.map((department, index) => (
            <option key={`${department}-${index}`} value={department}>{department}</option>
        ))

       
        let filterInput = (
            <div className="filters">
                <div className="filters__filter">
                    <label htmlFor="keyWord">What are you looking for?</label>
                    <input type="text" name="keyWord" placeholder="Keyword" autoComplete="off" onChange={this.handleChange}/>
                </div>

                <div className="filters__filter">
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" placeholder="Location" autoComplete="off" onChange={this.handleChange}/>
                </div>

                <div className="filters__filter">
                    <label htmlFor="department">Department</label>
                    <select name="department" defaultValue="select" autoComplete="off" onChange={this.handleChange}>
                        <option value="select">Department</option>
                        { departments }
                    </select>
                </div>

                <div>
                    <button type="submit">Search</button>
                </div>
            </div>
        )

        let sorterInputs = sorters.map((sorter) => (
            <div className="sorter" key={sorter}>
                <input key={sorter[0]} type="radio" id={sorter[0]} name="sorter" checked={ sorter[1] === currentSorter } value={sorter[1]} onChange={this.handleChangeSorter}/>
                <label htmlFor={sorter[0]}>{sorter[0]}</label>
            </div>
        ))

        let successMessage = <div></div>;
        if ( successOnDeletion ) {
            successMessage = (
            <div className="success message">
                <div className="message--icon"><i className="fas fa-check-circle"></i></div>
                <div className="message--group">
                    <div className="message--title">Deletion successful</div>
                    <div className="message--message">{ successOnDeletion }</div>
                </div>
            </div>)
        }

        if ( error ) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return (
                <div className="loading-spinner">
                    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>)
        } else {

            

            return (
                <div className="employees-container">
                    <div className="employees-form">
                        <form onSubmit={this.handleSubmit}>
                            <h1 className="main-header">Welcome to the your favourite</h1>
                            <div>business <span>directory</span></div>
                            <div className="employees-form--background">
                                

                                {filterInput}

                                <div className="employees-form__sortinggroup">
                                    <div>
                                        {sorterInputs}
                                    </div>
                                    
                                    
                                    <div className="sorter--sortby">
                                        <input key="sortby1" type="radio" id="sortby1" name="sortby" checked={ "ASC" === currentSorting } value="ASC" onChange={this.handleChangeSorting}/>
                                        <label htmlFor="sortby1">ASC</label>

                                        <input key="sortby2" type="radio" id="sortby2" name="sortby" checked={ "DESC" === currentSorting } value="DESC" onChange={this.handleChangeSorting}/>
                                        <label htmlFor="sortby2">DESC</label>
                                    </div>
                                </div>

                                
                            </div>
                            {/* <div className="design-element"></div> */}

                            <div className="square1"></div>
                            <div className="square2"></div>
                            <div className="square3"></div>

                            <div className="square4"></div>
                            <div className="square5"></div>
                            <div className="square6"></div>
                        </form>
                    </div>

                    <div className="members">
                        <h1 className="members-background">Members Directory</h1>
                        <h1 className="members-header">Members Directory</h1>
                    </div>

                    <div className="information">
                        <span><i className="fas fa-info-circle"></i></span>You have found { employees.length } members from your directory
                    </div>

                    <Link to="/employee/new" className="routerLink">
                        <div>
                            <div className="routerLink--icon"><i className="fas fa-folder-plus"></i></div>
                            <div className="routerLink--title">Add new Employee</div>
                        </div>
                    </Link>

                    {successMessage}

                    <ul className="employees">
                        {employees.map((employee, index) => (
                            <li key={`${employee.lastName}-${index}`}>
                                <div className="employee">
                                    <div className="employee__img"><img src={employee.avatar} alt=""/></div>
                                    <div className="employee__head">{employee.firstName} {employee.lastName}</div>
                                    <div className="employee__bottom--info-department">{employee.department}</div>
                                    <div className="employee__bottom">
                                        <div>
                                            <span><i className="fas fa-street-view"></i></span>
                                            <span>{employee.location}</span>
                                        </div>
                                        <div>
                                            <span><i className="fas fa-at"></i></span>
                                            <span>{employee.email}</span>
                                        </div>
                                        <div>
                                            <span><i className="fas fa-phone-volume"></i></span>
                                            <span>{employee.phone}</span>
                                        </div>
                                        
                                        <div className="employee__bottom--info-experience">{employee.experience} years of experience</div>
                                        <hr/>
                                        <div className="employee__bottom--links">
                                            <Link to={`/employee/${employee.id}`} className="employee__bottom--info-link"><div>View Profile</div></Link>
                                            <button className="btn-delete" value={employee.id} type="button" onClick={this.handleDelete}>Delete</button>
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