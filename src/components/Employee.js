import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

class Employee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            employee: {},
            editEmployee: {},
            isEditing: false,
            successOnSave: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    componentDidMount() {
        const userIndex = this.props.match.params.index;
        fetch(`http://localhost/companydirectory/libs/php/getAll.php?id=${userIndex}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        employee: result.data[0],
                        editEmployee: result.data[0]
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
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
        serverAPI("POST", "http://localhost/companydirectory/libs/php/updateEmployee.php", JSON.stringify(this.state.editEmployee))
        .then((res) => this.setState({successOnSave: "You have just saved your updated values."}))
        .catch((e) => console.log(e));

        this.toggleEdit();
    }

    toggleEdit = (event) => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    componentDidUpdate() {
        setTimeout(() => this.setState({successOnSave: ""}), 7500);
    }

    render() {
        const { error, isLoaded, employee, editEmployee, isEditing, successOnSave } = this.state;
        

        let successMessage = <div></div>;
        if ( successOnSave ) {
            successMessage = (
            <div className="success message">
                <div className="message--icon"><i className="fas fa-check-circle"></i></div>
                <div className="message--group">
                    <div className="message--title">Editing successful</div>
                    <div className="message--message">{ successOnSave }</div>
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
            const isAvailable = employee.isAvailable ? "In Office" : "On Vacation";
            const skills = editEmployee.expertise.split(",");
            
            const skillsDisplay = skills.map((skill, index) => (
                <div key={skill} className="skill">
                    {skill}
                </div>
            ))

            let fields = {
                email: <input type="text" defaultValue={ editEmployee.email } readOnly />,
                phone: <input type="text" defaultValue={ editEmployee.phone } readOnly />,
                name: <input type="text" defaultValue={ editEmployee.firstName + " " + editEmployee.lastName } readOnly />,
                biography: <textarea defaultValue={ editEmployee.biography } readOnly></textarea>,
                jobTitle: <input type="text" defaultValue={ editEmployee.jobTitle } readOnly />,
                experience: <input type="text" defaultValue={ editEmployee.experience } readOnly />,
                expertise: <input type="text" defaultValue={ editEmployee.expertise } readOnly />,
                location: <input type="text" defaultValue={ editEmployee.location } readOnly />
            }

            if (isEditing) {
                fields.email = <input type="text" name="email" placeholder={ editEmployee.email } onChange={this.handleChange} />;
                fields.phone = <input type="text" name="phone" placeholder={ editEmployee.phone } onChange={this.handleChange} />;
                fields.name = <input type="text" name="name" placeholder={ editEmployee.firstName + " " + editEmployee.lastName } onChange={this.handleChangeName} />;
                fields.biography = <textarea name="biography" placeholder={ editEmployee.biography } onChange={this.handleChange}></textarea>;
                fields.jobTitle = <input type="text" name="jobTitle" placeholder={ editEmployee.jobTitle } onChange={this.handleChange} />;
                fields.experience = <input type="text" name="experience" placeholder={ editEmployee.experience } onChange={this.handleChange} />;
                fields.expertise = <input type="text" maxLength="50" name="expertise" placeholder={ editEmployee.expertise } onChange={this.handleChange} />;
            }

            return (
                <div className="employee_container">

                    <div className="employee__header">
                        <Link to="/" className="routerLink">
                            <div>
                                <div className="routerLink--icon"><i className="fas fa-users"></i></div>
                                <div className="routerLink--title">See All Employees</div>
                            </div>
                        </Link>
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
                            <div className="employee__header--right-email"> <span><i className="fas fa-at"></i></span> { editEmployee.email } </div>
                        </div>
                    </div>

                    <div className="edit-controls">
                        { isEditing ? 
                            ( 
                                <div>
                                    <button className="btn btn-cancel" type="button" onClick={this.handleCancel}>Cancel</button>
                                    <button className="btn btn-save" type="button" onClick={this.handleSave}>Save updates</button>
                                </div> 
                            ) : 
                            (
                                <div>
                                    <button className="btn btn-edit" type="button" onClick={this.toggleEdit}>Edit</button>
                                </div>
                            )
                        }
                    </div>

                    {successMessage}

                    <article className="employee-section-container">
                        

                        <section className="employee-section">
                            <header>

                                <div className="employee-text">
                                    <h3 className="employee-text-background">Personal details</h3>
                                    <h3 className="employee-text-header">Personal details</h3>
                                </div>

                                <div className="employee-section__inputs">
                                    <div>
                                        <label htmlFor="name">Full Name</label>
                                        { fields.name }
                                    </div>

                                    <div className="biography">
                                        <div className="quotemark">"</div>
                                        <label htmlFor="biography">Biography</label>
                                        { fields.biography }
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
                                        <label htmlFor="jobTitle">Job Title</label>
                                        { fields.jobTitle }
                                    </div>

                                    <div>
                                        <label htmlFor="experience">Experience</label>
                                        { fields.experience }
                                    </div>

                                    <div>
                                        Please list your skills separated by a comma
                                    </div>

                                    <div>
                                        <label htmlFor="expertise">Expertise</label>
                                        { fields.expertise }
                                    </div>

                                    { editEmployee.expertise ? (
                                        <div className="skillset">
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
                                        <label htmlFor="email">Email</label>
                                        { fields.email }
                                    </div>

                                    <div>
                                        <label htmlFor="phone">Phone</label>
                                        { fields.phone }
                                    </div>

                                    

                                    <div>
                                        <label htmlFor="location">Location</label>
                                        { fields.location }
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