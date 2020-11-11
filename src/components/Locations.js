import React from "react";
import { serverAPI } from "../services/serverAPI";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import Swiping from "./Swiping";

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
            error: "",
            errorTitle: "",
            success: "",
            successTitle: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCurrentLocation = this.handleCurrentLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
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
                    .catch(() => this.setState({ isLoaded: true, error: "An error occurred while loading locations", errorTitle: "Loading unsuccessful" }))
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while loading locations", errorTitle: "Loading unsuccessful" }))
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

    handleEdit = (id) => {
        const index = Number(id);
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

    handleUpdate = (id) => {
        const index = Number(id);
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
            
                    this.setState({ isLoaded: true, isEditing: editingMode, locations: editedLocations, currentValues, success: "You have updated this location successfully!", successTitle: "Update successful" });
                }
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while updating location", errorTitle: "Update unsuccessful" }))
    }

    handleDelete = (name) => {
        const index = Number(name.split("-")[1]);
        this.setState({ isLoaded: false });

        const currentLocation = this.state.departments.filter(department => Number(department.id) === index)[0];
        if ( currentLocation.departments.length > 0 ) {
            this.setState({ isLoaded: true, error: "This location has departments, which have employees. Please transfer departments first before you delete.", errorTitle: "Deletion rejected" });
        } else {
            serverAPI("POST", "/location/delete.php", {id: index})
            .then(() => {
                const deletedLocation = this.state.locations.filter(location => Number(location.id) !== index);
                this.setState({ isLoaded: true, locations: deletedLocation, success: "You have deleted this location successfully!", successTitle: "Deletion successful" });

            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while deleting location", errorTitle: "Deletion unsuccessful" }))
        }
        
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
                            success: "You have added this location successfully!",
                            successTitle: "Insert successful"
                    });
                }
            })
            .catch(() => this.setState({ isLoaded: true, error: "An error occurred while adding location", errorTitle: "Insert unsuccessful" }))
    }

    hideMessage = () => {
        this.setState({ success: "", successTitle: "", error: "", errorTitle: "" });
    }

    componentDidUpdate() {
        if ( this.state.success ) { setTimeout(() => this.setState({ success: "", successTitle: "" }), 8000); }
        if ( this.state.error ) { setTimeout(() => this.setState({ error: "", errorTitle: "" }), 8000); }
    }

    render() {
        const { error, errorTitle, success, successTitle } = this.state;
        const { currentLocation, currentValues, locations, isLoaded, isEditing, departments } = this.state;
        
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

        if (!isLoaded) {
            return <LoadingSpinner />
        } else {
            // Show locations
            return (
                <div className="locations-container">
                    <div className="controls">
                        <Link to={{pathname:"/"}} className="home-link">
                                <div className="home-link--icon"><i className="fas fa-chevron-left"></i></div>
                                <div className="home-link--text">employees</div>
                        </Link>
                    </div>
                    <div className="locations__add">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" value={currentLocation} placeholder="Location name" required onChange={this.handleCurrentLocation} />
                            <button type="submit"><i className="fas fa-plus-square"></i></button>
                        </form>
                    </div>

                    {successMessage}
                    {errorMessage}

                    <div className="locations">

                        { locations.map((location, index) => (
                            <Swiping key={`location-${index}`} name={`location-${location.id}`} onDelete={this.handleDelete}>
                                <div className="locations__location">
                                    { !isEditing.filter(x => x.id === location.id)[0].edit ?
                                    (
                                        <div key={`location_-${index}`} className="normal">
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

                                                    return <div></div>;
                                                }) }
                                                
                                            </div>
                                            <div className="locations__location--controls">
                                                <div className="edit-container" onClick={this.handleEdit.bind(this, location.id)}>
                                                    <i className="fas fa-edit"></i>
                                                </div>
                                                
                                            </div>
                                            
                                        </div>
                                    ) :
                                    (   
                                        <div key={`location__-${index}`} className="editing">
                                            <div className="locations__location--name">
                                                <input type="text" name={`location-${location.id}`} placeholder={location.name} value={currentValues.filter(x => x.id === location.id)[0].value} onChange={this.handleChange} />
                                            </div>
                                            <div className="locations__location--controls">
                                                <div className="cancel-container" onClick={this.handleEdit.bind(this, location.id)}>
                                                    <i className="fas fa-window-close"></i>
                                                </div>
                                                <div className="update-container" onClick={this.handleUpdate.bind(this, location.id)}>
                                                    <i className="fas fa-archive"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ) }
                                </div>
                            </Swiping>
                        )) }
                    </div>
                </div>
            )
            
        }

        
    }
}