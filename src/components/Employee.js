import React from "react";
import { serverAPI } from "../services/serverAPI";

class Employee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            employee: {},
            editEmployee: {},
            isEditing: false
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
        .then((res) => console.log(res))
        .catch((e) => console.log(e));

        this.toggleEdit();
    }

    toggleEdit = (event) => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    render() {
        const { error, isLoaded, employee, editEmployee, isEditing } = this.state;
        console.log(this.state);
        if ( error ) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            const isAvailable = employee.isAvailable ? "In Office" : "On Vacation";

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
                fields.expertise = <input type="text" name="expertise" placeholder={ editEmployee.expertise } onChange={this.handleChange} />;
            }

            return (
                <div>
                    <div className="employee__header">
                        <div className="employee__header--avatar"> { editEmployee.firstName[0] }{ editEmployee.lastName[0] } </div>
                        <div className="employee__header--middle">
                            <div className="employee__header--middle-fullname"> { editEmployee.firstName } { editEmployee.lastName } </div>
                            <div className="employee__header--middle-department"> { editEmployee.department } </div>
                            <div className="employee__header--middle-employeeID"> Employee ID: { editEmployee.id } </div>
                            <div className="employee__header--middle-available"> { isAvailable } </div>
                        </div>
                        <div className="employee__header--right">
                            <div className="employee__header--right-phone"> Mobile: { editEmployee.phone } </div>
                            <div className="employee__header--right-email"> Email: { editEmployee.email } </div>
                        </div>
                    </div>

                    <hr/>

                    <div className="employee__middle">
                        <div className="employee__middle--left">
                            <div>
                                <label htmlFor="name">Name</label>
                                { fields.name }
                            </div>

                            <div>
                                <label htmlFor="email">Email</label>
                                { fields.email }
                            </div>

                            <div>
                                <label htmlFor="phone">Phone</label>
                                { fields.phone }
                            </div>

                            <div>
                                <label htmlFor="jobTitle">Job Title</label>
                                { fields.jobTitle }
                            </div>

                            <div>
                                <label htmlFor="experience">Experience</label>
                                { fields.experience }
                            </div>

                            <div>
                                <label htmlFor="expertise">Expertise</label>
                                { fields.expertise }
                            </div>

                            <div>
                                <label htmlFor="location">Location</label>
                                { fields.location }
                            </div>
                            
                            <div>
                                <label htmlFor="biography">Biography</label>
                                { fields.biography }
                            </div>
                        </div>
                    </div>

                    { isEditing ? 
                        ( 
                            <div>
                                <button type="button" onClick={this.handleCancel}>Cancel</button>
                                <button type="button" onClick={this.handleSave}>Save</button>
                            </div> 
                        ) : <button type="button" onClick={this.toggleEdit}>Edit</button> }
                    
                </div>
            )
        }
    }
}

export default Employee;