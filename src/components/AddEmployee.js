import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

export default class AddEmployee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorLoading: null,
            isLoaded: false,
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            departmentID: 1,
            expertise: "",
            phone: "",
            biography: "",
            avatar: "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg",
            error: "",
            success: "",
            isComponentLoaded: false,
            Departments: [],
            expertiseList: [],
            isAvatarURL: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewExpertise = this.handleNewExpertise.bind(this);
        this.handleDeleteExpertise = this.handleDeleteExpertise.bind(this);
        this.runFormValidation = this.runFormValidation.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);

        if (this.props.location.state) {
            this.setState({ Departments: this.props.location.state.Departments, isLoaded: true });
        }
        
        else {
            serverAPI("GET", "department/get.php")
            .then(departments => {
                const allDepartments = [];
                for (let [key, department] of Object.entries(departments.data)) {
                    allDepartments.push(department.name);
                }
                this.setState({Departments: allDepartments, isLoaded: true});
            })
        }
    }

    handleNewExpertise = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        let expertiseChanged = this.state.expertiseList.map((expertise, ind) => ((index === ind) ? event.target.value : expertise ));

        this.setState({expertiseList:expertiseChanged});
    }

    handleDeleteExpertise = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        let expertiseDeleted = this.state.expertiseList.filter((expertise, ind) => (index !== ind) );

        this.setState({expertiseList: expertiseDeleted});
    }

    handleChange = (event) => {
        if ( event.target.name === "departmentID" ) { this.setState({ departmentID: Number(event.target.value ) }) }
        else { this.setState({ [event.target.name]: event.target.value }); }
    }

    runFormValidation = () => {
        const {firstName, lastName, email} = this.state;
        if (( firstName.length > 0 && lastName.length > 0 && email.length > 0 && email.includes("@"))) {
            return true;
        }

        return false;
    }

    handleSubmit = (event) => {
        event.preventDefault();


        console.log(this.state);
        console.log(this.state.expertiseList.join(", "));
        // this.setState({ isLoaded: false });
        // serverAPI("POST", "insert.php", JSON.stringify(this.state))
        //     .then(() => this.setState(
        //         { 
        //             firstName: "", lastName: "", email: "", jobTitle: "", departmentID: 1, expertise: "", phone: "", biography: "", avatar: "",
        //             success: "You have just added a new employee. Well done!",
        //             isLoaded: true
        //         }))
        //     .catch((error) => this.setState({ error: "Something went wrong. Please try again!", isLoaded: true, errorLoading: error }));
    }

    componentDidUpdate() {
        setTimeout(() => this.setState({success: ""}), 7500);
    }

    render() {
        const { firstName, lastName, email, jobTitle, expertiseList, expertise, departmentID, avatar, isAvatarURL, phone, biography, error, Departments, success, errorLoading, isLoaded, isComponentLoaded } = this.state;

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
                <option key={index} value={index}>{ department }</option>
            ))

            let newEmployeeForm = (
                <form className="newEmployee-form" onSubmit={this.handleSubmit}>
                    <div className="newEmployee__navigation">
                        <Link to={{pathname:"/", state: {employees: this.props.location.state.employees, typing: this.props.location.state.typing, searched: this.props.location.state.searched, Departments: this.props.location.state.Departments} }} className="routerLink">
                            <div>
                                <div className="routerLink--icon"><i className="fas fa-chevron-left"></i></div>
                                <div>employees</div>
                            </div>
                        </Link>
                        <button className="avatar-button done-button" type="submit" disabled={!this.runFormValidation()}>Done</button>
                    </div>

                    <div>
                        <img className="preview-avatar" src={avatar} alt="Avatar"/>
                        <div className="preview-text">Your Default Avatar</div>
                        <button className="avatar-button" type="button" onClick={() => this.setState({isAvatarURL: !isAvatarURL})}>{ isAvatarURL ? "Discard" : "Change" }</button>
                        {isAvatarURL && <input type="text" name="avatar" value={avatar} placeholder="Your avatar URL" onChange={this.handleChange} />}
                    </div>
                    

                    <input type="text" name="firstName" value={firstName} placeholder="First name" required onChange={this.handleChange} />
                    <input type="text" name="lastName" value={lastName} placeholder="Last name" required onChange={this.handleChange} />
                    <input type="email" name="email" value={email} placeholder="Email address" required onChange={this.handleChange} />
                    
                    <input type="text" name="jobTitle" value={jobTitle} placeholder="Job Title" onChange={this.handleChange} />
                    <select name="departmentID" value={departmentID} onChange={this.handleChange}>{ departments }</select>

                    <div className="expertiseList">
                        { expertiseList ? (
                            expertiseList.map((expertise, index) => (
                                <div className="exp-exp" key={`expertise-${index}`}>
                                    <div>
                                        <button className="exp-btn exp-btn--delete" type="button" name={`expertise-${index}`} onClick={this.handleDeleteExpertise}>-</button>
                                        <div>{ index+1 }</div>
                                        <div><i className="fas fa-angle-right"></i></div>
                                    </div>
                                    <input className="exp-input" type="text" name={`expertise-${index}`} value={expertise} onChange={this.handleNewExpertise} />
                                </div>
                            )) 
                        ) : <div></div>}
                        <div className="exp-newexp" onClick={() => this.setState({expertiseList: [...expertiseList, ""]})}>
                            <div>
                                <button className="exp-btn exp-btn--add" type="button">+</button>
                            </div>
                            <label>Add expertise</label>
                        </div>
                    </div>

                    <input type="text" name="phone" value={phone} placeholder="Phone number" onChange={this.handleChange} />
                    <textarea type="text" maxLength="300" name="biography" value={biography} placeholder="Biography..." onChange={this.handleChange} ></textarea>
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