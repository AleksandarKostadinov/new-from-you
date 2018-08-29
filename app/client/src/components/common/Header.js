import React, { Component } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render () {
    return (
      <div>
        <Navbar color='light' light expand='md'>
          <NavbarBrand href='/'>News From You</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink href='/'>All Articles</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/login'>Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/register'>Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/register'>logout</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Articles
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href='/articles/feed'>News Feed</NavLink>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink href='/articles/create'>Create an Article</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}
