import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'


const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="primary"  variant="dark"  style={{Color: 'blue'}}>
            <Container>
                <Navbar.Brand href="http://www.github.com/Tariq15994" style={ {color: 'White',fontWeight:'bold' ,fontFamily:'Poppins, sans-serif' }}>
                    
                    &nbsp; Jokhio Market place
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="pad" >
                    <Nav className="me-auto " >
                        <Nav.Link as={Link} to="/" style={ {color: 'White' ,fontWeight:'bold' ,fontFamily:'Poppins, sans-serif'}} >Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" style={ {color: 'White' ,fontWeight:'bold' ,fontFamily:'Poppins, sans-serif'}}>Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items" style={ {color: 'White' ,fontWeight:'bold' ,fontFamily:'Poppins, sans-serif'}}>My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases" style={ {color: 'White' ,fontWeight:'bold' ,fontFamily:'Poppins, sans-serif'}}>My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;