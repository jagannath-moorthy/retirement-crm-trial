import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Navigation: React.FC = () => (
  <Navbar bg="primary" variant="dark" expand="md" className="mb-4">
    <Container>
      <Navbar.Brand href="#home">Retirement CRM</Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar-nav" />
      <Navbar.Collapse id="main-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#community">Communities</Nav.Link>
          <Nav.Link href="#client">Clients</Nav.Link>
          <Nav.Link href="#residents">Residents</Nav.Link>
          <Nav.Link href="#staff">Staff</Nav.Link>
          <Nav.Link href="#requests">Requests</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Navigation;
