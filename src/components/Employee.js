import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

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
            editEmployee: {},
            isEditing: false,
            isComponentLoaded: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.setState({
            employee: this.props.location.state.employee, 
            editEmployee: this.props.location.state.employee,
            isLoaded: true });
        
        setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            editEmployee: { ...prevState.editEmployee, [event.target.name]: event.target.value }
        }))
    }

    handleChangeName = (event) => {
        const splitName = event.target.value.split(' ');
        const firstName = splitName[0];
        const lastName = splitName[1] ? splitName[1] : "";

        this.setState((prevState) => ({
            editEmployee: { ...prevState.editEmployee, firstName, lastName}
        }))
    }

    handleCancel = (event) => {
        this.setState({ editEmployee: this.state.employee });

        this.toggleEdit();
    }

    handleSave = (event) => {
        this.setState({ isLoaded: false });
        serverAPI("POST", "update.php", JSON.stringify(this.state.editEmployee))
            .then(() => this.setState({ success: "You have just saved your updated values.", successTitle: "Save successful", isLoaded: true }))
            .catch(() => this.setState({ isLoaded: true, errorTitle: "Save unsuccessful", error: "An error occurred while saving your values" }));

        this.toggleEdit();
    }

    toggleEdit = (event) => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle, isLoaded, employee, editEmployee, isEditing, isComponentLoaded } = this.state;

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
            const isAvailable = employee.isAvailable ? "In Office" : "On Vacation";
            const skills = editEmployee.expertise.split(",");
            
            const skillsDisplay = skills.map((skill, index) => (
                <div key={skill} className="skill">
                    {skill}
                </div>
            ))

            let fields = {
                email: <input type="text" defaultValue={ editEmployee.email } readOnly />,
                phone: <input type="text" defaultValue={ editEmployee.phone ? editEmployee.phone : "Please provide"} readOnly />,
                name: <input type="text" defaultValue={ editEmployee.firstName + " " + editEmployee.lastName } readOnly />,
                biography: <textarea defaultValue={ editEmployee.biography ? editEmployee.biography : "Please provide" } readOnly></textarea>,
                jobTitle: <input type="text" defaultValue={ editEmployee.jobTitle ? editEmployee.jobTitle : "Please provide"} readOnly />,
                experience: <input type="text" defaultValue={ editEmployee.experience ? editEmployee.experience : "Please provide" } readOnly />,
                expertise: <input type="text" defaultValue={ editEmployee.expertise ? editEmployee.expertise : "Please provide"} readOnly />,
                location: <input type="text" defaultValue={ editEmployee.location } readOnly />
            }

            if (isEditing) {
                fields.email = <input type="text" name="email" placeholder={ editEmployee.email } onChange={this.handleChange} />;
                fields.phone = <input type="text" name="phone" placeholder={ editEmployee.phone } onChange={this.handleChange} />;
                fields.name = <input type="text" name="name" placeholder={ editEmployee.firstName + " " + editEmployee.lastName } onChange={this.handleChangeName} />;
                fields.biography = <textarea name="biography" placeholder={ editEmployee.biography } onChange={this.handleChange}></textarea>;
                fields.jobTitle = <input type="text" name="jobTitle" placeholder={ editEmployee.jobTitle} onChange={this.handleChange} />;
                fields.experience = <input type="text" name="experience" placeholder={ editEmployee.experience} onChange={this.handleChange} />;
                fields.expertise = <input type="text" maxLength="50" name="expertise" placeholder={ editEmployee.expertise} onChange={this.handleChange} />;
            }

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
                            <div className="employee__header--middle-fullname"> { editEmployee.firstName } { editEmployee.lastName } </div>
                            <div className="employee__header--middle-department"> { editEmployee.department } </div>
                        </div>
                        <div className="employee__header--right">
                            <div className="employee__header--middle-employeeID"> Employee ID: { editEmployee.id } </div>
                            <div className="employee__header--middle-available"> { isAvailable } </div>
                            <div className="employee__header--right-phone"> <span><i className="fas fa-phone-volume"></i></span> { editEmployee.phone } </div>
                            <div className="employee__header--right-email"> <span><i className="fas fa-envelope"></i></span> { editEmployee.email } </div>
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
                                        </div>
                                        
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-user-cog"></i></div>
                                        <div className="field">
                                            <label htmlFor="experience">Experience</label>
                                            { fields.experience }
                                        </div>
                                       
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fab fa-buromobelexperte"></i></div>
                                        <div className="field">
                                            <label htmlFor="expertise">Expertise</label>
                                            { fields.expertise }
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
                                        </div>
                                       
                                    </div>

                                    <div>
                                        <div className="icon"><i className="fas fa-phone-volume"></i></div>
                                        <div className="field">
                                            <label htmlFor="phone">Phone</label>
                                            { fields.phone }
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
                    
                </div>
            )
        }
    }
}

export default Employee;