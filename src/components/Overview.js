import React from "react";

export default class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            employees: []
        }
    }

    componentDidMount() {
        fetch("http://localhost/companydirectory/libs/php/getAll.php")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        employees: result.data
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
        const { error, isLoaded, employees } = this.state;
        if ( error ) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <ul>
                    {employees.map((employee, index) => (
                        <li key={employee.lastName}>
                            {index} {employee.firstName} {employee.lastName} {employee.email} {employee.department} {employee.location} {employee.jobTitle}
                        </li>
                    ))}
                </ul>
            )
        }
    }
}