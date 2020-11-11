import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { Line, Bar } from 'react-chartjs-2';

class Employee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            errorTitle: "",
            success: "",
            successTitle: "",
            isLoaded: false,
            employee: {},
            Departments: [],
            Locations: [],
            editEmployee: {},
            typingEmployee: {},
            currentDepartment: "",
            currentLocation: "",
            isEditing: false,
            isComponentLoaded: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.emptyTyping = this.emptyTyping.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.emptyTyping();

        const { employee, Departments, Locations } = this.props.location.state;

        const foundDepartment = Departments.filter(department => department.id === employee.departmentID)[0];
        const foundLocation = Locations.filter(location => location.id === employee.locationID)[0];
        
        const defaultDepartment = Departments[0] ? Departments[0] : 0;
        const defaultLocation = Locations[0] ? Locations.filter(l => l.id === Departments[0].locationID)[0] : 0;
        
        const currentDepartment = foundDepartment  ? foundDepartment : defaultDepartment;
        const currentLocation = foundLocation ? foundLocation : defaultLocation;

        this.setState({
            employee, 
            editEmployee: employee,
            Departments,
            Locations,
            currentDepartment,
            currentLocation,
            isLoaded: true });
        
        setTimeout(() => { this.setState({ isComponentLoaded: true }); } , 2000);
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            typingEmployee: { ...prevState.typingEmployee, [event.target.name]: event.target.value },
            editEmployee: { ...prevState.editEmployee, [event.target.name]: event.target.value }
        }))
    }

    handleChangeName = (event) => {
        const splitName = event.target.value.split(' ');
        const firstName = splitName[0];
        const lastName = splitName[1] ? splitName[1] : "";

        this.setState((prevState) => ({
            typingEmployee: { ...prevState.typingEmployee, firstName, lastName},
            editEmployee: { ...prevState.editEmployee, firstName, lastName}
        }))
    }

    handleChangeDepartment = (event) => {
        const { Departments, Locations } = this.state;
        const currentDepartment = Departments.filter(department => department.id === event.target.value)[0];
        const currentLocation = Locations.filter(location => location.id === currentDepartment.locationID)[0];

        this.setState({ currentDepartment, currentLocation, editEmployee: { ...this.state.editEmployee, departmentID: event.target.value, locationID: currentDepartment.locationID } });
    }

    handleCancel = (event) => {
        this.emptyTyping();
        this.setState({ editEmployee: this.state.employee });

        this.toggleEdit();
    }

    handleSave = (event) => {
        this.setState({ isLoaded: false });
        serverAPI("POST", "update.php", JSON.stringify(this.state.editEmployee))
            .then(() => {
                this.emptyTyping();
                this.setState({ success: "You have just saved your updated values.", successTitle: "Save successful", isLoaded: true, employee: this.state.editEmployee })

                const { Departments, Locations } = this.props.location.state;
                this.props.history.replace({ pathname: this.props.location.pathname, state: { employee: this.state.editEmployee, Departments, Locations } });
            })
            .catch(() => this.setState({ isLoaded: true, errorTitle: "Save unsuccessful", error: "An error occurred while saving your values" }));

        this.toggleEdit();
    }

    toggleEdit = (event) => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    emptyTyping = (event) => {
        const typingEmployee = { firstName: "", lastName: "", biography: "", jobTitle: "", experience: "", expertise: "", phone: "", email: "", avatar: "" };
        this.setState({ typingEmployee });
    }

    getLocation = (locationID) => {
        return this.state.Locations.filter(location => location.id === locationID)[0].name;
    }

    hideMessage = () => {
        this.setState({ success: "", successTitle: "", error: "", errorTitle: "" });
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle, isLoaded, employee, editEmployee, isEditing, isComponentLoaded, typingEmployee, Departments, currentDepartment, currentLocation } = this.state;
        
        let successMessage = <div></div>;
        if ( success ) { 
            successMessage = (
            <div className="message message-success">
                <div className="message--icon"><i className="fas fa-check-circle"></i></div>
                <div className="message--group">
                    <div className="message--title">{ successTitle }</div>
                    <div className="message--message">{ success }</div>
                </div>
                <div className="message--hide message--hide__success" onClick={this.hideMessage}>X</div>
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
                <div className="message--hide message--hide__error" onClick={this.hideMessage}>X</div>
            </div>)
        }

        const departments = Departments.map((department, index) => (
            <option key={`department-${index}`} value={department.id}>{ department.name } ({ this.getLocation(department.locationID) })</option>
        ))
            
        if (!isLoaded) {
            return <LoadingSpinner />
        } else {
            const isAvailable = employee.isAvailable ? "In Office" : "On Vacation";
            const skills = editEmployee.expertise.split(",");
            
            const skillsDisplay = skills.map((skill, index) => (
                <div key={skill} className="skill">
                    {skill}
                </div>
            ))

            let fields = {
                email: <div className="input--static">{ employee.email }</div>,
                phone: <div className="input--static">{ employee.phone ? employee.phone : "Please provide"}</div>,
                name: <div className="input--static">{ employee.firstName + " " + employee.lastName }</div>,
                biography: <div className="input--static input--static--bio">{ employee.biography ? employee.biography : "Please provide" }</div>,
                jobTitle: <div className="input--static">{ employee.jobTitle ? employee.jobTitle : "Please provide"}</div>,
                experience: <div className="input--static">{ employee.experience ? employee.experience : "Please provide" }</div>,
                expertise: <div className="input--static">{ employee.expertise ? employee.expertise : "Please provide"}</div>,
                avatar: <div className="input--static input--static--link">{ employee.avatar }</div>,
                department: <div className="input--static">{ employee.departmentID ? currentDepartment.name : "Please provide" }</div>,
                location: <div className="input--static">{ employee.locationID ? currentLocation.name : "Please provide" }</div>
            }

            if (isEditing) {
                fields.email = <input type="text" name="email" defaultValue={ typingEmployee.email } placeholder="Type your email" onChange={this.handleChange} />;
                fields.phone = <input type="text" name="phone" defaultValue={ typingEmployee.phone } placeholder="Type your phone number" onChange={this.handleChange} />;
                fields.name = <input type="text" name="name" defaultValue={ typingEmployee.firstName + "" + typingEmployee.lastName } placeholder="Type full name" onChange={this.handleChangeName} />;
                fields.biography = <textarea name="biography" defaultValue={ typingEmployee.biography } placeholder="Type your biography" onChange={this.handleChange}></textarea>;
                fields.jobTitle = <input type="text" name="jobTitle" defaultValue={ typingEmployee.jobTitle } placeholder="Type your job title" onChange={this.handleChange} />;
                fields.experience = <input type="text" name="experience" defaultValue={ typingEmployee.experience } placeholder="Type your experience" onChange={this.handleChange} />;
                fields.expertise = <input type="text" maxLength="50" name="expertise" defaultValue={ typingEmployee.expertise } placeholder="Type your expertise (use ',' for more)" onChange={this.handleChange} />;
                fields.avatar = <input type="text" name="avatar" defaultValue={ typingEmployee.avatar } placeholder="Type your avatar URL" onChange={this.handleChange} />;
                fields.department = <select name="department" defaultValue={ currentDepartment.id } onChange={this.handleChangeDepartment}>{ departments }</select>;
                fields.location = <div className="input--static">{ currentLocation.name }</div>;
            }

            // Data for chart.js
            const { posts, feedback, attendance, projects } = employee;
            const data = {
                labels: ["Posts", "Feedback", "Attendance", "Projects"],
                datasets: [
                  {
                    label: "Productivity",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(24, 40, 72, .8)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [posts, feedback, attendance, projects]
                  }
                ]
              };

            return (
                <div className={isComponentLoaded ? "employee_container" : "employee_container entranceEmployee"}>

                    <div className="employee__header">
                        <div className={isEditing ? "controls controls__editing" : "controls"}>
                            { isEditing ? (
                                <div>
                                    <button className="cancel" type="button" onClick={this.handleCancel}>Cancel</button>
                                </div> 
                            ) : (
                                <Link to={{pathname:"/" }} className="home-link">
                                    
                                        <div className="home-link--icon"><i className="fas fa-chevron-left"></i></div>
                                        <div className="home-link--text">employees</div>
                                   
                                </Link>
                            )}
                            

                            <div className="edit-controls">
                                { isEditing ? 
                                    ( 
                                        <div>
                                            <button className="save" type="button" onClick={this.handleSave}>Save</button>
                                        </div> 
                                    ) : 
                                    (
                                        <div>
                                            <button className="edit" type="button" onClick={this.toggleEdit}>Edit</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className="employee__header--avatar"> 
                            <img src={employee.avatar} alt=""/> 
                            <div className="rotated-square rotated-square-1"></div>
                            <div className="rotated-square rotated-square-2"></div>
                        </div>
                        <div className="employee__header--middle">
                            <div className="employee__header--middle-fullname"> { employee.firstName } { employee.lastName } </div>
                            <div className="employee__header--middle-department"> { employee.department } </div>
                        </div>
                        <div className="employee__header--right">
                            <div className="employee__header--middle-employeeID"> Employee ID: { employee.id } </div>
                            <div className="employee__header--middle-available"> { isAvailable } </div>
                            <div className="employee__header--right-phone"> <span><i className="fas fa-phone-volume"></i></span> { employee.phone } </div>
                            <div className="employee__header--right-email"> <span><i className="fas fa-envelope"></i></span> { employee.email } </div>
                        </div>
                    </div>

                    {successMessage}
                    {errorMessage}

                    <article className="employee-section-container">
                        
                        <section className="employee-section">
                            <header>

                                <div className="employee-text">
                                    <h3 className="employee-text-background">Personal details</h3>
                                    <h3 className="employee-text-header">Personal details</h3>
                                </div>

                                <div className="employee-section__inputs">
                                    <div>
                                        <div className="icon"><i className="fas fa-user"></i></div>
                                        <div className="field">
                                            <label htmlFor="name">Full Name</label>
                                            { fields.name }
                                            { isEditing && <span className="field--guidance">{ employee.firstName + " " + employee.lastName }</span> }
                                        </div>
                                    </div>

                                    <div>
                                        <div className="icon"><img src={typingEmployee.avatar ? typingEmployee.avatar : employee.avatar} /></div>
                                        <div className="field">
                                            <label htmlFor="name">Avatar</label>
                                            { fields.avatar }
                                            { isEditing && <span className="field--guidance">{ employee.avatar }</span> }
                                        </div>
                                    </div>

                                    <div className="biography">
                                        <div className="icon biography__head">
                                            <i className="fas fa-address-book"></i>
                                            <label htmlFor="biography">Biography</label>
                                        </div>
                                        <div className="biography__field">
                                            <div></div>
                                            { fields.biography }
                                        </div>
                    
                                    </div>
                                </div>
                            </header>
                        </section>

                        <hr className="employee-horizontal" />

                        <section className="employee-section">
                            <header>
                                <div className="employee-text">
                                    <h3 className="employee-text-background">Career details</h3>
                                    <h3 className="employee-text-header">Career details</h3>
                                </div>

                                <div className="employee-section__inputs">
                                    <div>
                                        <div className="icon"><i className="fas fa-briefcase"></i></div>
                                        <div className="field">
                                            <label htmlFor="jobTitle">Job Title</label>
                                            { fields.jobTitle }
                                            { isEditing && <span className="field--guidance">{ employee.jobTitle }</span> }
                                        </div>
                                        
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-user-cog"></i></div>
                                        <div className="field">
                                            <label htmlFor="experience">Experience</label>
                                            { fields.experience }
                                            { isEditing && <span className="field--guidance">{ employee.experience }</span> }
                                        </div>
                                       
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fab fa-buromobelexperte"></i></div>
                                        <div className="field">
                                            <label htmlFor="expertise">Expertise</label>
                                            { fields.expertise }
                                            { isEditing && <span className="field--guidance">{ employee.expertise }</span> }
                                        </div>
                                        
                                    </div>

                                    { editEmployee.expertise ? (
                                        <div id="skillset">
                                            { skillsDisplay }
                                        </div>
                                    ) : <div></div>}
                                </div>
                            </header>
                        </section >

                        <hr className="employee-horizontal" />

                        <section className="employee-section">
                            <header>
                                <div className="employee-text">
                                    <h3 className="employee-text-background">Contact details</h3>
                                    <h3 className="employee-text-header">Contact details</h3>
                                </div>

                                <div className="employee-section__inputs">
                                    <div>
                                        <div className="icon"><i className="fas fa-envelope"></i></div>
                                        <div className="field">
                                            <label htmlFor="email">Email</label>
                                            { fields.email }
                                            { isEditing && <span className="field--guidance">{ employee.email }</span> }
                                        </div>
                                       
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-phone-volume"></i></div>
                                        <div className="field">
                                            <label htmlFor="phone">Phone</label>
                                            { fields.phone }
                                            { isEditing && <span className="field--guidance">{ employee.phone }</span> }
                                        </div>
                                        
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-building"></i></div>
                                        <div className="field">
                                            <label htmlFor="department">Department</label>
                                            { fields.department }
                                        </div>
                                        
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-globe-europe"></i></div>
                                        <div className="field">
                                            <label htmlFor="location">Location</label>
                                            { fields.location }
                                        </div>
                                        
                                    </div>
                                </div>
                            </header>
                        </section>
                    </article>

                    <aside>
                        <Bar ref="chart" data={data}   />
                    </aside>
                    
                    
                </div>
            )
        }
    }
}

export default Employee;