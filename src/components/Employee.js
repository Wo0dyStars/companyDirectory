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
        fetch(`http://localhost/companydirectory/libs/php/getAll.php?id=${userIndex}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
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
            const isAvailable = employee.isAvailable ? "In Office" : "On Vacation";

            return (
                <div>
                    <div className="employee__header">
                        <div className="employee__header--avatar"> { employee.firstName[0] }{ employee.lastName[0] } </div>
                        <div className="employee__header--middle">
                            <div className="employee__header--middle-fullname"> { employee.firstName } { employee.lastName } </div>
                            <div className="employee__header--middle-department"> { employee.department } </div>
                            <div className="employee__header--middle-employeeID"> { employee.id } </div>
                            <div className="employee__header--middle-available"> { isAvailable } </div>
                        </div>
                        <div className="employee__header--right">
                            <div className="employee__header--right-phone"> { employee.phone } </div>
                            <div className="employee__header--right-email"> { employee.email } </div>
                        </div>
                    </div>

                    <hr/>

                    <div>
                        <div>
                            <div>
                                <span>Job Title</span>
                                <span>{ employee.jobTitle }</span>
                            </div>

                            <div>
                                <span>Experience</span>
                                <span>{ employee.experience }</span>
                            </div>

                            <div>
                                <span>Expertise</span>
                                <span>{ employee.expertise }</span>
                            </div>

                            <div>
                                <span>Location</span>
                                <span>{ employee.location }</span>
                            </div>

                        </div>
                        
                        <div>
                            Biography
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Employee;