import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import Swiping from "./Swiping";

export default class Departments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: {},
            locations: [],
            currentDepartment: "",
            currentLocationID: 0,
            isEditing: [],
            currentValues: [],
            departments: [],
            isLoaded: false,
            departmentsFinal: [],
            error: "",
            errorTitle: "",
            success: "",
            successTitle: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCurrentDepartment = this.handleCurrentDepartment.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLocationID = this.handleChangeLocationID.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        this.handleInputClear = this.handleInputClear.bind(this);
    }

    componentDidMount() {
        serverAPI("GET", "/department/get.php")
            .then(departments => {
                serverAPI("GET", "/location/get.php")
                    .then(locations => {
                        serverAPI("GET", "/get.php")
                        .then(employees => {
                            const departmentsFinal = [];
                            const isEditing = [];
                            const currentValues = [];
                            for (let i = 0; i < departments.data.length; i++) {
                                const employeeList = employees.data.filter(employee => employee.departmentID === departments.data[i].id);

                                isEditing.push({ id: departments.data[i].id, edit: false });
                                currentValues.push({ id: departments.data[i].id, locationID:  departments.data[i].locationID, value:  departments.data[i].name });
                                const locationNameRaw = locations.data.filter(l => l.id === departments.data[i].locationID)[0];
                                const locationName = locationNameRaw ? locationNameRaw.name : "";
                                
                                departmentsFinal.push({ id: departments.data[i].id, name: departments.data[i].name, location: { id: departments.data[i].locationID, name: locationName}, employees: employeeList.length });
                                
                            }
                            
                            this.setState({ isLoaded: true, departmentsFinal, isEditing, currentValues, locations: locations.data });
                        })
                        .catch(() => this.setState({ isLoaded: true, error: "An error occurred while loading employees", errorTitle: "Loading unsuccessful" }))
                    })
                    .catch(() => this.setState({ isLoaded: true, error: "An error occurred while loading locations", errorTitle: "Loading unsuccessful" }))
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while loading departments", errorTitle: "Loading unsuccessful" }))
    }

    handleChange = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        const currentValues = this.state.currentValues.map(value => {
            if ( Number(value.id) === index ) {
                return {
                    id: value.id,
                    locationID: value.locationID,
                    value: event.target.value
                }
            }

            return value;
        })

        this.setState({ currentValues });
    }

    handleChangeLocationID = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        const currentValues = this.state.currentValues.map(value => {
            if ( Number(value.id) === index ) {
                return {
                    id: value.id,
                    locationID: event.target.value,
                    value: value.value
                }
            }

            return value;
        })

        this.setState({ currentValues });
    }

    handleEdit = (id) => {
        const index = Number(id);
        const editingMode = this.state.isEditing.map(department => {
            if ( Number(department.id) === index ) {
                return {
                    id: department.id,
                    edit: !department.edit
                }
            }

            return department;
        })

        const currentValues = this.state.currentValues;
        for (let i = 0; i < this.state.departmentsFinal.length; i++) {
            currentValues[i].locationID = this.state.departmentsFinal[i].location.id;
            currentValues[i].value = this.state.departmentsFinal[i].name;
        }

        this.setState({ isEditing: editingMode, currentValues });
    }

    handleUpdate = (id) => {
        const index = Number(id);
        this.setState({ isLoaded: false });

        const currentValue = this.state.currentValues.filter(value => Number(value.id) === index)[0];

        let currentLocationID = 0;
        if ( currentValue.locationID === "select" ) {
            currentLocationID = this.state.departmentsFinal.filter(d => Number(d.id) === index)[0].location.id;
        } else {
            currentLocationID = currentValue.locationID;
        }

        let currentLocationName = this.state.locations.filter(l => l.id === currentLocationID)[0].name;

        if ( currentValue.value === "" ) {
            this.setState({ isLoaded: true, error: "Please fill up the fields properly!", errorTitle: "Missing fields" });
        } else {
            serverAPI("POST", "/department/update.php", {id: index, name: currentValue.value, locationID: Number(currentLocationID)})
            .then((updatedLocation) => {
                if ( updatedLocation.status.code === "200" ) {
                    const editingMode = this.state.isEditing.map(department => {
                        if ( Number(department.id) === index ) {
                            return {
                                id: department.id,
                                edit: false
                            }
                        }
            
                        return department;
                    })
    
                    const editedDepartments = this.state.departmentsFinal.map(department => {
                        if ( Number(department.id) === index ) {
                            return {
                                ...department,
                                name: currentValue.value,
                                location: {
                                    id: currentLocationID,
                                    name: currentLocationName
                                }
                            }
                        }
    
                        return department;
                    })
            
                    this.setState({ isLoaded: true, isEditing: editingMode, departmentsFinal: editedDepartments, success: "You have updated this location successfully!", successTitle: "Update successful" });
                }
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while updating location", errorTitle: "Update unsuccessful" }))
        }
    }

    handleDelete = (eventName) => {
        const index = Number(eventName.split("-")[1]);
        this.setState({ isLoaded: false });
       
        const currentDepartment = this.state.departmentsFinal.filter(department => Number(department.id) === index)[0];
        if ( currentDepartment.employees > 0 ) {
            this.setState({ isLoaded: true, error: "This department has employees. Please transfer them first in order to delete.", errorTitle: "Deletion rejected" });
            return false;
        } else {
            serverAPI("POST", "/department/delete.php", {id: index})
            .then((deleted) => {
                if ( deleted.status.code === "200" ) {
                    const deletedDepartment = this.state.departmentsFinal.filter(department => Number(department.id) !== index);
                    this.setState({ isLoaded: true, departmentsFinal: deletedDepartment, success: "You have deleted this department successfully!", successTitle: "Deletion successful" });
                    return true;
                } else {
                    this.setState({ isLoaded: true, error: "An error occurred while deleting department", errorTitle: "Deletion unsuccessful" });
                }
            

            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while deleting department", errorTitle: "Deletion unsuccessful" }))
        }
        
    }

    handleCurrentDepartment = (event) => {
        this.setState({ currentDepartment: event.target.value });
    }

    handleChangeLocation = (event) => {
        this.setState({ currentLocationID: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({ isLoaded: false });

        if ( this.state.currentLocationID !== 0 && this.state.currentDepartment !== "" ) {
            serverAPI("POST", "/department/insert.php", {name: this.state.currentDepartment, locationID: this.state.currentLocationID })
            .then((insertedDepartment) => {
                if ( insertedDepartment.status.code === "200" ) {
                    const locationName = this.state.locations.filter(l => l.id === this.state.currentLocationID)[0].name;

                    this.setState({
                        isLoaded: true,
                        currentLocationID: 0,
                        currentDepartment: "",
                        isEditing: [...this.state.isEditing, { id: insertedDepartment.data.index, edit: false }],
                        currentValues: [...this.state.currentValues, { id: insertedDepartment.data.index, value: "" }],
                        success: "You have added this department successfully!",
                        successTitle: "Insert successful",
                        departmentsFinal: [ { id: insertedDepartment.data.index, name: this.state.currentDepartment, location: { id: this.state.currentLocationID, name: locationName}, employees: 0 }, ...this.state.departmentsFinal ]
                    })
                }
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while adding department", errorTitle: "Insert unsuccessful" }))
        } else {
            this.setState({ isLoaded: true, error: "Location and department must be selected!", errorTitle: "Missing fields" });
        }
        
    }

    hideMessage = () => {
        this.setState({ success: "", successTitle: "", error: "", errorTitle: "" });
    }

    handleInputClear = (id) => {
        const currentValues = this.state.currentValues.map(value => (value.id === id) ? {id: value.id, locationID: value.locationID, value: ""} : value);

        this.setState({ currentValues });
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle } = this.state;
        const { currentValues, locations, isLoaded, isEditing, departmentsFinal, currentDepartment } = this.state;

        const Locations = locations.map((location, index) => (
            <option key={`${location}-${index}`} value={location.id}>{location.name}</option>
        ))

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

        const departmentsGrouped = departmentsFinal.reduce((departments, current) => {
            if ( departments[current.location.id] ) departments[current.location.id] = [...departments[current.location.id], current];
            else departments[current.location.id] = [current];

            return departments;
        }, []);

        if (!isLoaded) {
            return <LoadingSpinner />
        } else {
            return (
                <div className="departments-container">
                    <div className="controls">
                        <Link to={{pathname:"/"}} className="home-link">
                                <div className="home-link--icon"><i className="fas fa-chevron-left"></i></div>
                                <div className="home-link--text">employees</div>
                        </Link>
                    </div>

                    <div className="departments__add">
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input type="text" value={currentDepartment} placeholder="Department name" onChange={this.handleCurrentDepartment} />
                                
                                <select name="location" defaultValue="select" autoComplete="off" onChange={this.handleChangeLocation}>
                                    <option value="select">Location</option>
                                    { Locations }
                                </select>
                                <button type="submit"><i className="fas fa-plus-square"></i></button>
                            </div>
                        </form>
                    </div>

                    {successMessage}
                    {errorMessage}

                    <div className="departments">
                        { departmentsGrouped.map((departments, index) => (
                            <div key={`departments-${index}`}>
                                <div className="departments--location">{ departments[0].location.name }</div>
                                { departments.map((department, index) => (
                                    <Swiping key={`department-${index}`} name={`department-${department.id}`} onDelete={this.handleDelete}>
                                        <div className="departments__department"> 
                                            { !isEditing.filter(x => x.id === department.id)[0].edit ? (
                                                <div>
                                                    <div className="departments__department--name departments__department--name__name">{ department.name }</div>
                                                    <div className="departments__department--employees">{ department.employees } employees</div>
            
                                                    <div className="departments__department--controls">
                                                        <div className="edit-container" onClick={this.handleEdit.bind(this,department.id)}>
                                                            <i className="fas fa-edit"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="departments__department--name">
                                                        <input type="text" name={`department-${department.id}`} placeholder={department.name} value={currentValues.filter(x => x.id === department.id)[0].value} onChange={this.handleChange} />
                                                        <span className="departments__department--name__x" onClick={this.handleInputClear.bind(this, department.id)}>X</span>
                                                        <select name={`department-${department.id}`} defaultValue={currentValues.filter(x => x.id === department.id)[0].locationID} autoComplete="off" onChange={this.handleChangeLocationID}>
                                                            <option value="select">Location</option>
                                                            { Locations }
                                                        </select>
                                                    </div>
            
                                                    <div className="departments__department--controls">
                                                        <div className="cancel-container" onClick={this.handleEdit.bind(this,department.id)}>
                                                            <i className="fas fa-window-close"></i>
                                                        </div>
                                                        <div className="update-container" onClick={this.handleUpdate.bind(this, department.id)}>
                                                            <i className="fas fa-archive"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) }
                                        </div>
                                    </Swiping>
                                )) }
                            </div>
                        )) }
                    </div>
                </div>
            )
            
        }

        
    }
}