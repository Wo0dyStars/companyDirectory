import React from "react";

class Employee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            employee: {}
        }
    }

    componentDidMount() {
        const userIndex = this.props.match.params.index;
        fetch(`http://localhost/companydirectory/libs/php/getUserByID.php?id=${userIndex}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        employee: result.data[0]
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

    render() {
        const { error, isLoaded, employee } = this.state;
        if ( error ) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <div>{employee.firstName} {employee.lastName} {employee.email} {employee.department} {employee.location} {employee.jobTitle}</div>
            )
        }
    }
}

export default Employee;