import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button } from 'reactstrap';
import { getGroup } from '../nodeserverapi'

class ManageGroups extends Component {
  constructor() {
    super();
    this.state = { groupsMembers: [] };
	}
	
	componentDidMount = () => {
		getGroup(getUserToken(), this.props.location.state.groupId, 
			response => {
			},
			error => {
			}
		)
	}

  render() {
		const { groupsMembers } = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <br></br>
            <h3 className="page-title">{}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <table>
                  <tbody>
                    {groupsMembers.map((user, index) => <tr key={index}>
                      <td><Button>x</Button></td>
                      <td>{user.email}</td>
                    </tr>)}
                  </tbody>	
                </table>	
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>    
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(ManageGroups);