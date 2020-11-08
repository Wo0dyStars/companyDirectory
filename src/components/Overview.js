import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { goToTop } from 'react-scrollable-anchor';
// import SwipeToDelete from 'react-swipe-to-delete-component';
// import Swipeable from "./Swipeable";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import Swipeable from "./Swipeable";

export default class Overview extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            error: null,
            isLoaded: false,
            employees: [],
            searchedEmployees: [],
            filters: [],
            sorters: [["name", "p.firstName"], ["email", "p.email"], ["department", "d.name"], ["location", "l.name"]],
            currentSorter: "p.firstName",
            currentSorting: "ASC",
            successOnDeletion: "",
            isComponentLoaded: false,
            isArrowVisible: false,
            Departments: [],
            typing: "",
            isModalOpen: false,
            isSearching: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSorter = this.handleChangeSorter.bind(this);
        this.handleChangeSorting = this.handleChangeSorting.bind(this);
        this.handleType = this.handleType.bind(this);
        this.modal = this.modal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onOpenProfile = this.onOpenProfile.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        let scroll = this;
        document.addEventListener("scroll", function(event) {
            scroll.toggleVisibility();
        })

        if ( this.props.location.state ) {
            console.log("currentstate: ",this.props.location.state);
            this.setState({ employees: this.props.location.state.employees, typing: this.props.location.state.typing, searchedEmployees: this.props.location.state.searched, Departments: this.props.location.state.Departments, isLoaded: true });
        } else {
            serverAPI("GET", "department/get.php")
            .then(departments => {
                const allDepartments = [];
                for (let [key, department] of Object.entries(departments.data)) {
                    allDepartments.push(department.name);
                }
                this.setState({Departments: allDepartments});
            })

            serverAPI("GET", "get.php?orderby=p.firstName")
            .then(employees => {
                this.setState({ isLoaded: true, employees: employees.data, searchedEmployees: employees.data });
                setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);
            })
            .catch((error) => {
                this.setState({ isLoaded: true, error })
            });
        }
    }

    modal = (event) => {

    }

    openModal = (event) => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    closeModal = (event) => {
        this.setState({ isModalOpen: false });
    }

    toggleVisibility() {
        if ( window.pageYOffset > 300 ) {
            this.setState({ isArrowVisible: true });
        } else { this.setState({ isArrowVisible: false }) };
    }

    onOpenProfile = (employeeID) => {
        const {employees, typing, searchedEmployees, Departments} = this.state;
        const employee = employees.filter(employee => employee.id === employeeID)[0];
        
        this.props.history.push({
            pathname:`/employee/${employeeID}`,
            state: {
                employee, employees, typing, searched: searchedEmployees, Departments
            }
        });
    }

    onDelete = (employeeID) => {
        this.setState({ isLoaded: false });
        serverAPI("POST", "delete.php", JSON.stringify({id: employeeID}))
        .then(() => {
            const person = this.state.employees.filter(employee => employee.id === employeeID)[0];
            const personName = person.firstName + " " + person.lastName;
            this.setState({ employees: this.state.employees.filter(employee => employee.id !== employeeID),
                            searchedEmployees: this.state.searchedEmployees.filter(employee => employee.id !== employeeID),
                            isLoaded: true,
                            successOnDeletion: `You have now successfully deleted ${personName} from your directory.` });
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

        if (!this.state.employees.length) { this.setState({ filters: [] }) };
    }

    handleChangeSorter = (event) => {
        this.setState({ currentSorter: event.target.value });
    }

    handleChangeSorting = (event) => {
        this.setState({ currentSorting: event.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        let filters = "";
        this.state.filters.forEach(filter => {
            filters += `${filter.key}=${filter.value}&`;
        })

        filters += `orderby=${this.state.currentSorter}&`;
        filters += `orderdir=${this.state.currentSorting}`;
        
        this.setState({ isLoaded: false });
        serverAPI("GET", `get.php?${filters}`)
            .then(employees => this.setState({ isLoaded: true, employees: employees.data }))
            .catch((error) => this.setState({ isLoaded: true, error }));
    }

    handleType = (event) => {
        console.log("typing now: ", this.state.typing);
        this.setState({ typing: event.target.value });

        console.log("currentemployees: ",this.state.employees);
        let filteredEmployees = this.state.employees.filter(employee => {
            const { firstName, lastName, jobTitle, department, email, location, expertise } = employee;
            const searchedKeys = [ firstName, lastName, jobTitle, department, email, location, expertise ];
            
            return searchedKeys.join(" ").toLowerCase().indexOf(event.target.value) !== -1;
        });
        
        this.setState({ searchedEmployees: filteredEmployees });
    }

    componentDidUpdate() {
        setTimeout(() => this.setState({successOnDeletion: ""}), 7500);
    }

    render() {
        const { error, isLoaded, employees, sorters, currentSorter, isModalOpen, currentSorting, Departments, successOnDeletion, searchedEmployees, typing,  isArrowVisible } = this.state;

        const departments = Departments.map((department, index) => (
            <option key={`${department}-${index}`} value={department}>{department}</option>
        ))

        const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXZ".split("");
        let ABCList = (
            <div className="ABCLetter">
                { ABC.map((letter, index) => (
                    <div key={`letter-${index}`}>{letter}</div>
                )) }
            </div>);
        
        let employeesGrouped = searchedEmployees.reduce((employees, currentEmployee) => {
                let currentGroup = currentEmployee.firstName[0];
    
                if ( !employees[currentGroup] ) employees[currentGroup] = { currentGroup, employees: [ currentEmployee ] }
                else { employees[currentGroup].employees.push(currentEmployee) }
    
                return employees;
        }, {})
        
       
        let filterInput = (
            <div className="filters">
                <div className="filters__filter">
                    <input type="text" name="keyWord" placeholder="Keyword" autoComplete="off" onChange={this.handleChange}/>
                </div>

                <div className="filters__filter">
                    <input type="text" name="location" placeholder="Location" autoComplete="off" onChange={this.handleChange}/>
                </div>

                <div className="filters__filter filters__filter--select">
                    <select name="department" defaultValue="select" autoComplete="off" onChange={this.handleChange}>
                        <option value="select">Department</option>
                        { departments }
                    </select>
                </div>

                <div>
                    <button type="submit"><i className="fas fa-search"></i></button>
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

        console.log(isModalOpen);
        console.log(this.state.isSearching);
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
                
                { isArrowVisible && (
                    <div onClick={() => {goToTop()}} className="floating-arrow"><i className="fas fa-angle-double-up"></i></div>
                ) }

                <div className="members">
                    <h1 className="members-background">Members Directory</h1>
                    <h1 className="members-header">Members Directory</h1>
                </div>

                <div id="controls">
                    <div id="controls-background"></div>

                    <div className={this.state.isSearching ? "filters_ filters_-searching" : "filters_"}>
                        <span onClick={() => this.setState({isSearching: !this.state.isSearching})}><i className="fas fa-search"></i></span>
                        <input type="text" name="search" value={typing} placeholder="Search" onChange={this.handleType} />
                    </div>

                    <div className="modal-button" onClick={this.openModal}>
                        <i className="fas fa-cogs"></i>
                    </div>
                        
                </div>

                <div className={isModalOpen ? "modal" : ""}>
                        <input type="checkbox" id="modal-checkbox" checked={isModalOpen} onChange={this.openModal} />
                        <div className="overlay" onClick={this.openModal}></div>
                        <div id="checkbox-items">
                            <div className="menu">
                                <Link className="menu-link" to={{pathname:"/locations", state: {employees, typing, searched: searchedEmployees, Departments} }}>
                                    <div id="menu-background-1" className="menu-background"></div>
                                    <i className="fas fa-globe"></i>
                                    <div>Locations</div>
                                    <p>
                                        Recently relocated or established a new office? Do not forget to update your locations.
                                    </p>
                                </Link>
                            </div>
                            <div className="menu">
                                <Link className="menu-link" to={{pathname:"/departments", state: {employees, typing, searched: searchedEmployees, Departments} }}>
                                    <div id="menu-background-2" className="menu-background"></div>
                                    <i className="fas fa-building"></i>
                                    <div>Departments</div>
                                    <p>
                                        Recently relocated or established a new office? Do not forget to update your locations.
                                    </p>
                                </Link>
                            </div>
                            <div className="menu">
                                <Link className="menu-link" to={{pathname:"/employee/new", state: {employees, typing, searched: searchedEmployees, Departments} }}>
                                    <div id="menu-background-3" className="menu-background"></div>
                                    <i className="fas fa-user-plus"></i>
                                    <div>New Member</div>
                                    <p>
                                        Recently relocated or established a new office? Do not forget to update your locations.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>

                {successMessage}

                <form onSubmit={this.handleSubmit}>
                    {filterInput}

                    <div className="employees-form__sortinggroup">
                        <div>
                            {sorterInputs}
                        </div>
                        
                        <div className="sorter--sortby">
                            <input key="sortby1" type="radio" id="sortby1" name="sortby" checked={ "ASC" === currentSorting } value="ASC" onChange={this.handleChangeSorting}/>
                            <label htmlFor="sortby1" className="sorter--sortby__asc"><i className="fas fa-long-arrow-alt-up"></i></label>

                            <input key="sortby2" type="radio" id="sortby2" name="sortby" checked={ "DESC" === currentSorting } value="DESC" onChange={this.handleChangeSorting}/>
                            <label htmlFor="sortby2" className="sorter--sortby__desc"><i className="fas fa-long-arrow-alt-down"></i></label>
                        </div>
                    </div>
                </form>

                <div className="extra-information">
                    <div className="information">
                        <span><i className="fas fa-info-circle"></i></span>{ searchedEmployees.length } members found
                    </div>

                    <Link to={{pathname:"/employee/new", state: {employees, typing, searched: searchedEmployees, Departments} }} className="routerLink">
                        <div>
                            <div className="routerLink--icon"><i className="fas fa-user-plus"></i></div>
                        </div>
                    </Link>
                </div>

                <article className={isModalOpen ? "employee-table-hide" : "employee-table"}>
                    <div className="employee-table__heading">
                        <div>Photo</div>
                        <div>Name</div>
                        <div>Email Address</div>
                        <div>Availability</div>
                    </div>
                    
                    <div className="employees-section">
                        <div className="ABC-list">{ ABCList }</div>

                        { Object.entries(employeesGrouped).map(([group, employeesGroup], index) => (
                            <div key={`group-${index}`}>
                                <div className="employee-table__groupLetter">{ group }</div>
                                <div>
                                    { employeesGroup.employees.map((employee) => (
                                        <Swipeable key={employee.id} name={employee.id} onClick={this.onOpenProfile} onDelete={this.onDelete} className="employee-table__employee">
                                            <div className="employee-table__employee--avatar">
                                                <img src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} title={`${employee.firstName} ${employee.lastName}`} />
                                            </div>
                
                                            <div className="employee-table__employee--credentials">
                                                <div className="employee-table__employee--name">
                                                    {employee.firstName} {employee.lastName}
                                                </div>
                                                
                                                <div className="employee-table__employee--department"> 
                                                    { employee.department }
                                                </div>
                                                <div className="employee-table__employee--location"> 
                                                    { employee.location }
                                                </div>
                                            </div>
                
                                            <div className="employee-table__employee--email">
                                                { employee.email }
                                            </div>
                
                                            { employee.isAvailable ? (
                                                <div className="employee-table__employee--available">
                                                    <span></span>
                                                    <span>Available</span>
                                                </div>
                                            ) : (
                                                <div className="employee-table__employee--out">
                                                    <span></span>
                                                    <span>Out</span>
                                                </div>
                                            ) }
                                        </Swipeable>
                                    )) }
                                </div>
                            </div>
                            
                        )) }
                    </div>
                    
                </article>
            </div>
        )
        }
    }
}