import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { goToTop } from 'react-scrollable-anchor';
import Swipeable from "./Swipeable";
import { LoadingSpinner } from "./LoadingSpinner";

export default class Overview extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            error: "",
            errorTitle: "",
            success: "",
            successTitle: "",
            isLoaded: false,
            employees: [],
            searchedEmployees: [],
            isComponentLoaded: false,
            isArrowVisible: false,
            Departments: [],
            typing: "",
            isModalOpen: false,
            isSearching: false
        }

        this.handleType = this.handleType.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onOpenProfile = this.onOpenProfile.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.clearSearching = this.clearSearching.bind(this);
    }

    componentDidMount() {
        let scroll = this;
        document.addEventListener("scroll", function(event) {
            scroll.toggleVisibility();
        })

        if ( this.props.location.state ) {
            const { employees, typing, searched, Departments } = this.props.location.state;
            this.setState({ employees, typing, searchedEmployees: searched, Departments, isLoaded: true });
        } else {
            serverAPI("GET", "department/get.php")
                .then(departments => {
                    const allDepartments = [];
                    for (let department of Object.values(departments.data)) {
                        allDepartments.push({ id: department.id, name: department.name });
                    }

                    this.setState({Departments: allDepartments});
                })
                .catch(() => this.setState({ isLoaded: true, errorTitle: "Loading unsuccessful", error: "An error occurred while loading your employees" }));

            serverAPI("GET", "get.php?orderby=p.firstName")
                .then(employees => {
                    this.setState({ isLoaded: true, employees: employees.data, searchedEmployees: employees.data });
                    setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);
                })
                .catch(() => this.setState({ isLoaded: true, errorTitle: "Loading unsuccessful", error: "An error occurred while loading your employees" }));
        }
    }

    toggleModal = (event) => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
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
                            successTitle: "Deletion successful",
                            success: `You have now successfully deleted ${personName} from your directory.` });
        })
        .catch(() => this.setState({ isLoaded: true, errorTitle: "Deletion unsuccessful", error: "An error occurred while deleting your employee" }));
    }

    clearSearching = (event) => {
        this.setState({ isSearching: false, searchedEmployees: this.state.employees, typing: "" });
    }

    handleType = (event) => {
        this.setState({ typing: event.target.value });

        if ( event.target.value !== "" ) {
            this.setState({ isSearching: true })
        } else {
            this.setState({ isSearching: false });
        }

        let filteredEmployees = this.state.employees.filter(employee => {
            const { firstName, lastName, jobTitle, department, email, location, expertise } = employee;
            const searchedKeys = [ firstName, lastName, jobTitle, department, email, location, expertise ];
            
            return searchedKeys.join(" ").toLowerCase().indexOf(event.target.value) !== -1;
        });
        
        this.setState({ searchedEmployees: filteredEmployees });
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle, isLoaded, employees, isSearching, isModalOpen, Departments, searchedEmployees, typing,  isArrowVisible } = this.state;

        const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXZ".split("");
        let ABCList = (
            <div className="ABCLetter">
                { ABC.map((letter, index) => (
                    <div key={`letter-${index}`}>{letter}</div>
                )) }
            </div>);
        
        let employeesGrouped = searchedEmployees.reduce((employees, currentEmployee) => {
                let currentGroup = currentEmployee.firstName[0].toUpperCase();
    
                if ( !employees[currentGroup] ) employees[currentGroup] = { currentGroup, employees: [ currentEmployee ] }
                else { employees[currentGroup].employees.push(currentEmployee) }
    
                return employees;
        }, {})
        
        let successMessage = <div></div>;
        if ( success ) {
            successMessage = (
            <div className="message message-success">
                <div className="message--icon"><i className="fas fa-check-circle"></i></div>
                <div className="message--group">
                    <div className="message--title">{ successTitle }</div>
                    <div className="message--message">{ success }</div>
                </div>
            </div>)
        }

        let errorMessage = <div></div>;
        if ( error ) {
            errorMessage = (
            <div className="message message-error">
                <div className="message--icon"><i className="fas fa-exclamation-circle"></i></div>
                <div className="message--group">
                    <div className="message--title">{ errorTitle }</div>
                    <div className="message--message">{ error }</div>
                </div>
            </div>)
        }
       
        if (!isLoaded) {
            return <LoadingSpinner />
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

                    <div className={isSearching ? "filters_ filters_-searching" : "filters_"}>
                        <span onClick={() => this.setState({isSearching: !this.state.isSearching})}><i className="fas fa-search"></i></span>
                        <input type="text" name="search" value={typing} placeholder="Search" onChange={this.handleType} />
                        { isSearching ? <span className="filters_-searching--x" onClick={this.clearSearching}>X</span> : <span></span> }
                    </div>

                    <div className="modal-button" onClick={this.toggleModal}>
                        <i className="fas fa-cogs"></i>
                    </div>
                </div>

                <div className={isModalOpen ? "modal" : ""}>
                        <input type="checkbox" id="modal-checkbox" checked={isModalOpen} onChange={this.toggleModal} />
                        <div className="overlay" onClick={this.toggleModal}></div>
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
                                        Planning to introduce new departments or extending your business? Update your departments.
                                    </p>
                                </Link>
                            </div>
                            <div className="menu">
                                <Link className="menu-link" to={{pathname:"/employee/new", state: {employees, typing, searched: searchedEmployees, Departments} }}>
                                    <div id="menu-background-3" className="menu-background"></div>
                                    <i className="fas fa-user-plus"></i>
                                    <div>New Member</div>
                                    <p>
                                        A new member has just joined your team? Add them to your member directory.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>

                { successMessage }
                { errorMessage }

                <div className="extra-information">
                    <div className="information">
                        <span><i className="fas fa-info-circle"></i></span>{ searchedEmployees.length } members found
                    </div>
                </div>

                <article className="employee-table">
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