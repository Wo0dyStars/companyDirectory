import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

export default class AddEmployee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            departmentID: 0,
            expertise: "",
            phone: "",
            biography: "",
            avatar: "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg",
            error: "",
            errorTitle: "",
            success: "",
            successTitle: "",
            isComponentLoaded: false,
            Departments: [],
            expertiseList: [],
            isAvatarURL: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewExpertise = this.handleNewExpertise.bind(this);
        this.handleDeleteExpertise = this.handleDeleteExpertise.bind(this);
        this.addExpertise = this.addExpertise.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        setTimeout(() => this.setState({ isComponentLoaded: true }), 2000);

        if (this.props.location.state) {
            const { Departments } = this.props.location.state;
            this.setState({ Departments, isLoaded: true, departmentID: Departments[0].id });
        }
        
        else {
            serverAPI("GET", "department/get.php")
            .then(departments => {
                const allDepartments = [];
                for (let department of Object.values(departments.data)) {
                    allDepartments.push({ id: department.id, name: department.name });
                }
                
                this.setState({Departments: allDepartments, isLoaded: true, departmentID: allDepartments[0].id});
            })
            .catch(() => this.setState({ isLoaded: true, errorTitle: "Loading unsuccessful", error: "An error occurred while loading your data" }));
        }
    }

    addExpertise = (event) => {
        if ( this.state.expertiseList.length === 5 ) {
            this.setState({ error: "You can provide maximum 5 expertise", errorTitle: "Maximum number of expertise reached" });
        } else {
            this.setState({expertiseList: [...this.state.expertiseList, ""]});
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

    handleSubmit = (event) => {
        event.preventDefault();

        const newState = this.state;
        newState.expertiseList = newState.expertiseList.filter(exp => exp !== "");
        newState.expertise = newState.expertiseList.join(",");

        this.setState({ isLoaded: false });
        serverAPI("POST", "insert.php", JSON.stringify(newState))
            .then((res) => {

                this.setState(
                { 
                    firstName: "", lastName: "", email: "", jobTitle: "", departmentID: this.state.Departments[0].id, expertise: "", expertiseList: [], phone: "", biography: "", avatar: "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg",
                    success: "You have just added a new employee. Well done!",
                    successTitle: "Join successful",
                    isLoaded: true
                })})
            .catch((error) => this.setState({ error: "Something went wrong. Please try again!", errorTitle: "Join unsuccessful", isLoaded: true, errorLoading: error }));
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle } = this.state;
        const { firstName, lastName, email, jobTitle, expertiseList, departmentID, avatar, isAvatarURL, phone, biography, Departments, isLoaded, isComponentLoaded } = this.state;

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
            
            // Display departments with indices given in database
            const departments = Departments.map((department, index) => (
                <option key={`department-${index}`} value={department.id}>{ department.name }</option>
            ))

            let newEmployeeForm = (
                <form className="newEmployee-form" onSubmit={this.handleSubmit}>
                    <div className="newEmployee__navigation">
                        <Link to={{pathname:"/"}} className="routerLink">
                            <div>
                                <div className="routerLink--icon"><i className="fas fa-chevron-left"></i></div>
                                <div>employees</div>
                            </div>
                        </Link>
                        <button className="avatar-button done-button" type="submit">Done</button>
                    </div>

                    <div className="preview">
                        <img className="preview-avatar" src={avatar} alt="Avatar"/>
                        <div className="preview-text">Your Default Avatar</div>
                        <button className="avatar-button" type="button" onClick={() => this.setState({isAvatarURL: !isAvatarURL, avatar: "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"})}>{ isAvatarURL ? "Discard" : "Change" }</button>
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
                        <div className="exp-newexp" onClick={this.addExpertise}>
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

            return (
                <div className={isComponentLoaded ? "newEmployee" : "newEmployee entranceAddEmployee"}>

                    <div className="newEmployee-text">
                        <h3 className="newEmployee-text-background">Add a new employee</h3>
                        <h3 className="newEmployee-text-header">Add a new employee</h3>
                    </div>

                    {newEmployeeForm}

                    {successMessage}
                    {errorMessage}
                </div>
            )
        }
    }
}