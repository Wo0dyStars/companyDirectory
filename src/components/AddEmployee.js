import React from "react";
import { serverAPI } from "../services/serverAPI";

const Departments = ["Human Resources", "Sales", "Marketing", "Legal", "Services", "Research and Development", "Product Management", "Training", "Support", "Engineering", "Accounting", "Business Development"];

export default class AddEmployee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            departmentID: 1,
            expertise: "",
            phone: "",
            biography: "",
            error: "",
            success: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        if ( event.target.name === "departmentID" ) { this.setState({ departmentID: Number(event.target.value) }) }
        else { this.setState({ [event.target.name]: event.target.value }); }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        serverAPI("POST", "http://localhost/companydirectory/libs/php/insertEmployee.php", JSON.stringify(this.state))
            .then(() => this.setState(
                { 
                    firstName: "", lastName: "", email: "", jobTitle: "", departmentID: 1, expertise: "", phone: "", biography: "",
                    success: "You have just added a new employee. Well done!" 
                }))
            .catch(() => this.setState({ error: "Something went wrong. Please try again!" }));
    }

    render() {
        const { firstName, lastName, email, jobTitle, expertise, departmentID, phone, biography, error, success } = this.state;
        
        // Display departments with indices given in database
        const departments = Departments.map((department, index) => (
            <option key={index} value={index + 1}>{ department }</option>
        ))

        let newEmployeeForm = (
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="firstName" value={firstName} placeholder="Your first name" required onChange={this.handleChange} />
                <input type="text" name="lastName" value={lastName} placeholder="Your last name" required onChange={this.handleChange} />
                <input type="email" name="email" value={email} placeholder="Your email address" required onChange={this.handleChange} />
                <hr/>
                <input type="text" name="jobTitle" value={jobTitle} placeholder="Job Title" onChange={this.handleChange} />
                <select name="departmentID" value={departmentID-1} onChange={this.handleChange}>{ departments }</select>
                <input type="text" name="expertise" value={expertise} placeholder="Expertise" onChange={this.handleChange} />
                <input type="text" name="phone" value={phone} placeholder="Phone number" onChange={this.handleChange} />
                <input type="text" name="biography" value={biography} placeholder="Biography..." onChange={this.handleChange} />

                <button type="submit">Submit</button>
            </form>
        )

        return (
            <div className="newEmployee">
                {newEmployeeForm}

                {error && (<div>{ error }</div>)}
                {success && (<div>{ success }</div>)}
            </div>
        )
    }
}