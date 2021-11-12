
import React from "react";
import {
    Nav,
    NavLogo,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";


const Navbar = (pages) => {
    return (
        <Nav>
            <Bars />

            <NavMenu>
                {pages.pages.map(
                     page => {
                        return (<NavLink to={`/${page[1]}`} activeStyle>
                            {page[1]}
                        </NavLink>)
                    })
                    }
            </NavMenu>
        </Nav>
    );
};
export default Navbar;