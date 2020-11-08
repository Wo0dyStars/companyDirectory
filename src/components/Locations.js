import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import Swipeable from "./Swipeable";

export default class Locations extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            employees: {},
            locations: [],
            currentLocation: "",
            isEditing: [],
            currentValues: [],
            departments: [],
            isLoaded: false,
            successMessage: "",
            errorMessage: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCurrentLocation = this.handleCurrentLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        window.addEventListener("mouseup", this.onDragEndMouse);
        window.addEventListener("touchend", this.onDragEndTouch);

        serverAPI("GET", "/location/get.php")
            .then(locationsData => {
                const locations = locationsData.data.map(location => ({ id: location.id, name: location.name }));

                const isEditing = [];
                const currentValues = [];
                for (let i = 0; i < locations.length; i++) {
                    isEditing.push({ id: locations[i].id, edit: false });
                    currentValues.push({ id: locations[i].id, value: "" });
                }

                serverAPI("GET", "/department/get.php")
                    .then(departments => {
                        const departmentsForLocations = [];
                        for (let i = 0; i < locations.length; i++) {
                            const localDepartmentsRaw =  departments.data.filter(department => department.locationID === locations[i].id);
                            const localDepartments = localDepartmentsRaw.map(department => department.name);

                            departmentsForLocations.push({ id: locations[i].id, departments: localDepartments });
                        }

                        this.setState({ locations, isLoaded: true, isEditing, currentValues, departments: departmentsForLocations });
                    })
                    .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while loading locations" }))
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while loading locations" }))
    }

    handleChange = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        const currentValues = this.state.currentValues.map(value => {
            if ( Number(value.id) === index ) {
                return {
                    id: value.id,
                    value: event.target.value
                }
            }

            return value;
        })

        this.setState({ currentValues });
    }

    handleEdit = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        const editingMode = this.state.isEditing.map(location => {
            if ( Number(location.id) === index ) {
                return {
                    id: location.id,
                    edit: !location.edit
                }
            }

            return location;
        })

        const currentValues = this.state.currentValues.map(value => {
            if ( Number(value.id) === index ) {
                return {
                    id: value.id,
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

        const currentValue = this.state.currentValues.filter(value => Number(value.id) === index)[0].value;

        serverAPI("POST", "/location/update.php", {id: index, name: currentValue})
            .then((updatedLocation) => {
                if ( updatedLocation.status.code === "200" ) {
                    const editingMode = this.state.isEditing.map(location => {
                        if ( Number(location.id) === index ) {
                            return {
                                id: location.id,
                                edit: false
                            }
                        }
            
                        return location;
                    })
    
                    const editedLocations = this.state.locations.map(location => {
                        if ( Number(location.id) === index ) {
                            return {
                                id: location.id,
                                name: currentValue
                            }
                        }
    
                        return location;
                    })

                    const currentValues = this.state.currentValues.map(value => {
                        if ( Number(value.id) === index ) {
                            return {
                                id: value.id,
                                value: ""
                            }
                        }
            
                        return value;
                    })
            
                    this.setState({ isLoaded: true, isEditing: editingMode, locations: editedLocations, currentValues, successMessage: "You have updated this location successfully!" });
                }
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while updating location" }))
    }

    handleDelete = (event) => {
        const index = Number(event.target.name.split("-")[1]);
        this.setState({ isLoaded: false });
        
        serverAPI("POST", "/location/delete.php", {id: index})
            .then((res) => {
                const deletedLocation = this.state.locations.filter(location => Number(location.id) !== index);
                this.setState({ isLoaded: true, locations: deletedLocation, successMessage: "You have deleted this location successfully!" });

            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while deleting location" }))
    }

    handleCurrentLocation = (event) => {
        this.setState({ currentLocation: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({ isLoaded: false });

        serverAPI("POST", "/location/insert.php", {name: this.state.currentLocation })
            .then((insertedLocation) => {
                if ( insertedLocation.status.code === "200" ) {
                    this.setState(
                        { 
                            isLoaded: true, 
                            locations: [{ id: insertedLocation.data.index, name: this.state.currentLocation }, ...this.state.locations], 
                            currentLocation: "", 
                            isEditing: [...this.state.isEditing, { id: insertedLocation.data.index, edit: false }], 
                            currentValues: [...this.state.currentValues, { id: insertedLocation.data.index, value: "" }],
                            departments: [ ...this.state.departments, { id: insertedLocation.data.index, departments: [] } ],
                            successMessage: "You have added this location successfully!"
                    });
                }
            })
            .catch(() => this.setState({ isLoaded: true, errorMessage: "An error occurred while adding location" }))
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
        const { employees, currentLocation, currentValues, locations, isLoaded, isEditing, departments, successMessage, errorMessage } = this.state;
        
        if (!isLoaded) {
            return (
                <div className="loading-spinner">
                    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            )
        } else {
            // Show locations
            return (
                <div className="locations-container">
                    <div className="controls">
                        <Link to={{pathname:"/", state: {employees: this.props.location.state.employees, typing: this.props.location.state.typing, searched: this.props.location.state.searched, Departments: this.props.location.state.Departments} }} className="home-link">
                                <div className="home-link--icon"><i className="fas fa-chevron-left"></i></div>
                                <div className="home-link--text">employees</div>
                        </Link>
                    </div>
                    <div className="locations__add">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" value={currentLocation} placeholder="Location name" onChange={this.handleCurrentLocation} />
                            <button type="submit"><i className="fas fa-plus-square"></i></button>
                        </form>
                    </div>

                    { successMessage && (
                        <div className="locations__success">
                            { successMessage }
                        </div>
                    ) }

                    { errorMessage && (
                        <div className="locations__error">
                            { errorMessage }
                        </div>
                    ) }
                    <div className="locations">

                        { locations.map((location, index) => (
                            <div key={`location-${index}`} className="locations__location">
                                { !isEditing.filter(x => x.id === location.id)[0].edit ?
                                (
                                    <div>
                                        <div className="locations__location--name">
                                            <div className="locations__location--name__name">{ location.name }</div>
                                        </div>
                                        <div>
                                            { departments.map((department, index) => {
                                                if ( department.id === location.id ) {
                                                    return (
                                                        <div key={`departments-${index}`} className="locations__location--departments">
                                                            { !department.departments.length ? (
                                                                <div className="locations__location--departments__title">Currently has no departments</div>
                                                            ) : (
                                                                <div className="locations__location--departments__title">Currently has the following departments</div>
                                                            ) }
                                                            { department.departments.map((d, index) => ( <div className="locations__location--departments__department" key={`d-${index}`}>{d}</div> )) }
                                                        </div>
                                                    )
                                                }
                                            }) }
                                        </div>
                                        <div className="locations__location--controls">
                                            <div>
                                                <button className="delete" type="button" name={`location-${location.id}`} onClick={this.handleDelete}>Remove</button>
                                                <i className="fas fa-trash-alt"></i>
                                            </div>
                                            <div>
                                                <button className="edit" type="button" name={`location-${location.id}`} onClick={this.handleEdit}>Edit</button>
                                                <i className="fas fa-edit"></i>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                ) :
                                (   
                                    <div>
                                        <div className="locations__location--name">
                                            <input type="text" name={`location-${location.id}`} placeholder={location.name} value={currentValues.filter(x => x.id === location.id)[0].value} onChange={this.handleChange} />
                                        </div>
                                        <div className="locations__location--controls">
                                            <div>
                                                <button className="cancel" type="button" name={`location-${location.id}`} onClick={this.handleEdit}>Cancel</button>
                                                <i className="fas fa-window-close"></i>
                                            </div>
                                            <div>
                                                <button className="update" type="button" name={`location-${location.id}`} onClick={this.handleUpdate}>Update</button>
                                                <i className="fas fa-archive"></i>
                                            </div>
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