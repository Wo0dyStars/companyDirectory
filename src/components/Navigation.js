import React from "react";
import { NavLink } from "react-router-dom";

export default class Navigation extends React.Component {
    render() {
        return (
            <nav className="navigation">
                <ul className="navigation-list">
                    <NavLink exact to="/" className="navigation-list--element__link" activeClassName="navigation-list--element__active">
                        <li className="navigation-list--element">Overview</li>
                    </NavLink>
                    <NavLink to="/employee/new" className="navigation-list--element__link" activeClassName="navigation-list--element__active">
                        <li className="navigation-list--element">+</li>
                    </NavLink>
                </ul>
            </nav>
        )
    }
}