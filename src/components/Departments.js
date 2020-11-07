import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";

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
            successMessage: "",
            errorMessage: "",
            departmentsFinal: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCurrentDepartment = this.handleCurrentDepartment.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLocationID = this.handleChangeLocationID.bind(this);
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
                                const employeeList = employees.data.filter(employee => employee.department === departments.data[i].name);
                                
                                isEditing.push({ id: departments.data[i].id, edit: false });
                                currentValues.push({ id: departments.data[i].id, locationID: "select", value: "" });
                                const locationNameRaw = locations.data.filter(l => l.id === departments.data[i].locationID)[0];
                                const locationName = locationNameRaw ? locationNameRaw.name : "";
                                
                                departmentsFinal.push({ id: departments.data[i].id, name: departments.data[i].name, location: { id: departments.data[i].locationID, name: locationName}, employees: employeeList.length });
                                
                            }
                            console.log("final", departmentsFinal);
                            this.setState({ isLoaded: true, departmentsFinal, isEditing, currentValues, locations: locations.data });
                        })
                        .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while loading departments" }))
                    })
                    .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while loading departments" }))
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while loading departments" }))
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

    handleEdit = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        const editingMode = this.state.isEditing.map(department => {
            if ( Number(department.id) === index ) {
                return {
                    id: department.id,
                    edit: !department.edit
                }
            }

            return department;
        })

        const currentValues = this.state.currentValues.map(value => {
            if ( Number(value.id) === index ) {
                return {
                    id: value.id,
                    locationID: "select",
                    value: ""
                }
            }

            return value;
        })

        this.setState({ isEditing: editingMode, currentValues });
    }

    handleUpdate = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        this.setState({ isLoaded: false });

        const currentValue = this.state.currentValues.filter(value => Number(value.id) === index)[0];

        let currentLocationID = 0;
        if ( currentValue.locationID === "select" ) {
            currentLocationID = this.state.departmentsFinal.filter(d => Number(d.id) === index)[0].location.id;
        } else {
            currentLocationID = currentValue.locationID;
        }

        if ( currentValue.value === "" ) {
            this.setState({ isLoaded: true, errorMessage: "Please fill up the fields properly!" });
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
                                    ...department.location,
                                    locationID: currentLocationID
                                }
                            }
                        }
    
                        return department;
                    })

                    const currentValues = this.state.currentValues.map(value => {
                        if ( Number(value.id) === index ) {
                            return {
                                id: value.id,
                                value: "",
                                locationID: "select"
                            }
                        }
            
                        return value;
                    })
            
                    this.setState({ isLoaded: true, isEditing: editingMode, departmentsFinal: editedDepartments, currentValues, successMessage: "You have updated this location successfully!" });
                }
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while updating location" }))
        }
    }

    handleDelete = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        this.setState({ isLoaded: false });
        
        serverAPI("POST", "/department/delete.php", {id: index})
            .then((deleted) => {
                if ( deleted.status.code === "200" ) {
                    const deletedDepartment = this.state.departmentsFinal.filter(department => Number(department.id) !== index);
                    this.setState({ isLoaded: true, departmentsFinal: deletedDepartment, successMessage: "You have deleted this department successfully!" });
                } else {
                    this.setState({ isLoaded: true, errorMessage: "An error occurred while deleting department" });
                }
            

            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while deleting department" }))
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

        if ( this.state.currentLocationID != 0 && this.state.currentDepartment !== "" ) {
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
                        successMessage: "You have added this department successfully!",
                        departmentsFinal: [ { id: insertedDepartment.data.index, name: this.state.currentDepartment, location: { id: this.state.currentLocationID, name: locationName}, employees: 0 }, ...this.state.departmentsFinal ]
                    })
                }
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while adding department" }))
        } else {
            this.setState({ isLoaded: true, errorMessage: "Location and department must be selected!" });
        }
        
    }

    componentDidUpdate() {
        if ( this.state.successMessage ) {
            setTimeout(() => this.setState({ successMessage: "" }), 3000);
        }

        if ( this.state.errorMessage ) {
            setTimeout(() => this.setState({ errorMessage: "" }), 3000);
        }
    }

    render() {
        const { employees, currentLocation, currentValues, locations, isLoaded, isEditing, departmentsFinal, currentDepartment, departments, successMessage, errorMessage } = this.state;

        console.log(this.state.currentValues);
        const Locations = locations.map((location, index) => (
            <option key={`${location}-${index}`} value={location.id}>{location.name}</option>
        ))

        if (!isLoaded) {
            return (
                <div className="loading-spinner">
                    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            )
        } else {
            return (
                <div className="departments-container">
                    <div className="controls">
                        <Link to={{pathname:"/", state: {employees: this.props.location.state.employees, typing: this.props.location.state.typing, searched: this.props.location.state.searched, Departments: this.props.location.state.Departments} }} className="home-link">
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
                            </div>
                            <button type="submit">Add department</button>
                        </form>
                    </div>

                    { successMessage && (
                        <div className="departments__success">
                            { successMessage }
                        </div>
                    ) }

                    { errorMessage && (
                        <div className="departments__error">
                            { errorMessage }
                        </div>
                    ) }

                    <div className="departments">
                        { departmentsFinal.map((department, index) => (
                            
                            <div key={`department-${index}`}> 
                                { !isEditing.filter(x => x.id === department.id)[0].edit ? (
                                    <div>
                                        <div className="departments__department--name departments__department--name__name">{ department.name }</div>
                                        <div className="departments__department--location">{ department.location.name }</div>
                                        <div className="departments__department--employees">Currently has { department.employees } employees</div>

                                        <div className="departments__department--controls">
                                            <button className="delete" type="button" name={`department-${department.id}`} onClick={this.handleDelete}>Remove</button>
                                            <button className="edit" type="button" name={`department-${department.id}`} onClick={this.handleEdit}>Edit</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="departments__department--name">
                                            <input type="text" name={`department-${department.id}`} placeholder={department.name} value={currentValues.filter(x => x.id === department.id)[0].value} onChange={this.handleChange} />
                                            <select name={`department-${department.id}`} defaultValue={currentValues.filter(x => x.id === department.id)[0].locationID} autoComplete="off" onChange={this.handleChangeLocationID}>
                                                <option value="select">Location</option>
                                                { Locations }
                                            </select>
                                        </div>

                                        <div className="departments__department--controls">
                                            <button className="cancel" type="button" name={`department-${department.id}`} onClick={this.handleEdit}>Cancel</button>
                                            <button className="update" type="button" name={`department-${department.id}`} onClick={this.handleUpdate}>Update</button>
                                        </div>
                                    </div>
                                ) }
                            </div>
                        )) }
                    </div>
                </div>
            )
            
        }

        
    }
}