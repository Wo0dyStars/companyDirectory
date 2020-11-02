import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

const Departments = ["Human Resources", "Sales", "Marketing", "Legal", "Services", "Research and Development", "Product Management", "Training", "Support", "Engineering", "Accounting", "Business Development"];

export default class AddEmployee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorLoading: null,
            isLoaded: true,
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            departmentID: 1,
            expertise: "",
            phone: "",
            biography: "",
            avatar: "",
            error: "",
            success: "",
            isComponentLoaded: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);
    }

    handleChange = (event) => {
        if ( event.target.name === "departmentID" ) { this.setState({ departmentID: Number(event.target.value) }) }
        else { this.setState({ [event.target.name]: event.target.value }); }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({ isLoaded: false });
        serverAPI("POST", "insert.php", JSON.stringify(this.state))
            .then(() => this.setState(
                { 
                    firstName: "", lastName: "", email: "", jobTitle: "", departmentID: 1, expertise: "", phone: "", biography: "", avatar: "",
                    success: "You have just added a new employee. Well done!",
                    isLoaded: true
                }))
            .catch((error) => this.setState({ error: "Something went wrong. Please try again!", isLoaded: true, errorLoading: error }));
    }

    componentDidUpdate() {
        setTimeout(() => this.setState({success: ""}), 7500);
    }

    render() {
        const { firstName, lastName, email, jobTitle, expertise, departmentID, avatar, phone, biography, error, success, errorLoading, isLoaded, isComponentLoaded } = this.state;

        if ( errorLoading ) {
            return <div>Error: {errorLoading.message}</div>
        } else if (!isLoaded) {
            return (
                <div className="loading-spinner">
                    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>)
        } else {
            // Display departments with indices given in database
            const departments = Departments.map((department, index) => (
                <option key={index} value={index + 1}>{ department }</option>
            ))

            let newEmployeeForm = (
                <form className="newEmployee-form" onSubmit={this.handleSubmit}>
                    <input type="text" name="firstName" value={firstName} placeholder="Your first name" required onChange={this.handleChange} />
                    <input type="text" name="lastName" value={lastName} placeholder="Your last name" required onChange={this.handleChange} />
                    <input type="email" name="email" value={email} placeholder="Your email address" required onChange={this.handleChange} />
                    
                    <input type="text" name="jobTitle" value={jobTitle} placeholder="Job Title" onChange={this.handleChange} />
                    <select name="departmentID" value={departmentID-1} onChange={this.handleChange}>{ departments }</select>
                    <div className="expertise-list">
                        Please list the skills separated by a comma
                    </div>
                    <input type="text" name="expertise" value={expertise} placeholder="Expertise" onChange={this.handleChange} />
                    <input type="text" name="phone" value={phone} placeholder="Phone number" onChange={this.handleChange} />
                    <textarea type="text" maxLength="300" name="biography" value={biography} placeholder="Biography..." onChange={this.handleChange} ></textarea>
                    <input type="text" name="avatar" value={avatar} placeholder="Your avatar URL" onChange={this.handleChange} />

                    { avatar ? ( 
                        <div>
                            <div className="preview-text">Your Preview</div>
                            <img className="preview-avatar" src={avatar} alt="Avatar"/>
                        </div> 
                        ) : <div></div> }


                    <button className="btn btn--pink mg-large" type="submit">Create New Employee</button>
                </form>
            )

            let successMessage = <div></div>;
            if ( success ) {
                successMessage = (
                <div className="success message">
                    <div className="message--icon"><i className="fas fa-check-circle"></i></div>
                    <div className="message--group">
                        <div className="message--title">Adding new employee successful</div>
                        <div className="message--message">{ success }</div>
                    </div>
                </div>)
            }

            let errorMessage = <div></div>;
            if ( error ) {
                errorMessage = (
                <div className="error message">
                    <div className="message--icon"><i className="fas fa-exclamation-circle"></i></div>
                    <div className="message--group">
                        <div className="message--title">Adding new employee error</div>
                        <div className="message--message">{ error }</div>
                    </div>
                </div>)
            }

            return (
                <div className={isComponentLoaded ? "newEmployee" : "newEmployee entranceAddEmployee"}>
                    <Link to="/" className="routerLink">
                        <div>
                            <div className="routerLink--icon"><i className="fas fa-users"></i></div>
                            <div className="routerLink--title">See All Employees</div>
                        </div>
                    </Link>

                    <div className="newEmployee-text">
                        <h3 className="newEmployee-text-background">Add a new employee</h3>
                        <h3 className="newEmployee-text-header">Add a new employee</h3>
                    </div>

                    {newEmployeeForm}

                    {error && (<div>{ errorMessage }</div>)}
                    {success && (<div>{ successMessage }</div>)}
                </div>
            )
        }
    }
}