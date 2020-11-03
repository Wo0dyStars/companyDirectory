import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import $ from "jquery";

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
            successOnDeletion: "",
            isComponentLoaded: false,
            isArrowVisible: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeSorter = this.handleChangeSorter.bind(this);
        this.handleChangeSorting = this.handleChangeSorting.bind(this);
    }

    componentDidMount() {
        let scroll = this;
        document.addEventListener("scroll", function(event) {
            scroll.toggleVisibility();
        })

        serverAPI("GET", "get.php")
            .then(employees => {
                this.setState({ isLoaded: true, employees: employees.data });
                setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);
            })
            .catch((error) => {
                this.setState({ isLoaded: true, error })
            });
    }

    toggleVisibility() {
        if ( window.pageYOffset > 300 ) {
            this.setState({ isArrowVisible: true });
        } else { this.setState({ isArrowVisible: false }) };
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
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

    handleDelete = (event) => {

        this.setState({ isLoaded: false });
        serverAPI("POST", "delete.php", JSON.stringify({id: event.target.value}))
        .then(() => {
            const person = this.state.employees.filter(employee => employee.id === event.target.value)[0];
            const personName = person.firstName + " " + person.lastName;
            this.setState({ employees: this.state.employees.filter(employee => employee.id !== event.target.value),
                            isLoaded: true,
                            successOnDeletion: `You have now successfully deleted ${personName} from your directory.` });
        })
        .catch((error) => this.setState({ isLoaded: true, error }));
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

    componentDidUpdate() {
        setTimeout(() => this.setState({successOnDeletion: ""}), 7500);
    }

    render() {
        const { error, isLoaded, employees, sorters, currentSorter, currentSorting, successOnDeletion, isArrowVisible } = this.state;
        
        const departments = Departments.map((department, index) => (
            <option key={`${department}-${index}`} value={department}>{department}</option>
        ))

       
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
                    <div onClick={() => this.scrollToTop()} className="floating-arrow"><i className="fas fa-angle-double-up"></i></div>
                ) }

                <div className="members">
                    <h1 className="members-background">Members Directory</h1>
                    <h1 className="members-header">Members Directory</h1>
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
                            <label htmlFor="sortby1" className="sorter--sortby__asc"><i className="fas fa-sort-up"></i></label>

                            <input key="sortby2" type="radio" id="sortby2" name="sortby" checked={ "DESC" === currentSorting } value="DESC" onChange={this.handleChangeSorting}/>
                            <label htmlFor="sortby2" className="sorter--sortby__desc"><i className="fas fa-sort-down"></i></label>
                        </div>
                    </div>
                </form>

                <div class="extra-information">
                    <div className="information">
                        <span><i className="fas fa-info-circle"></i></span>{ employees.length } members found
                    </div>

                    <Link to="/employee/new" className="routerLink">
                        <div>
                            <div className="routerLink--icon"><i className="fas fa-user-plus"></i></div>
                        </div>
                    </Link>
                </div>

                <article className="employee-table">
                    <div className="employee-table__heading">
                        <div>Photo</div>
                        <div>Name</div>
                        <div>Email Address</div>
                        <div>Availability</div>
                        <div></div>
                    </div>

                    { employees.map((employee, index) => (
                        <div key={`${employee.firstName}-${index}`} className="employee-table__employee">
                            <div className="employee-table__employee--avatar">
                                <img src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} title={`${employee.firstName} ${employee.lastName}`} />
                            </div>

                            <div className="employee-table__employee--credentials">
                                <Link to={`/employee/${employee.id}`} style={{textDecoration: "none"}}>
                                    <div className="employee-table__employee--name">
                                        {employee.firstName} {employee.lastName}
                                    </div>
                                </Link>
                                
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

                            <div className="employee-table__employee--more">
                                <Link to={`/employee/${employee.id}`} className="employee-table__employee--link"><span><i className="fas fa-external-link-alt"></i></span></Link>
                                <button className="btn employee-table__employee--delete" value={employee.id} type="button" onClick={this.handleDelete}>X</button>
                            </div>
                        </div>
                    )) }
                </article>
            </div>
        )
        }
    }
}