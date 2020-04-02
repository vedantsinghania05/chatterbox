import React, { Component, useReducer } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert, Form, FormGroup } from 'reactstrap';
import { getMembers, getUser } from '../nodeserverapi'

class ManageGroups extends Component {
  constructor() {
    super();
    this.state = { groupsMembers: [] };
	}
	
	componentDidMount = () => {

		console.log('MOUNTING')

		getMembers(getUserToken(), this.props.location.state.groupId, 
			response => {
				console.log('>>> members ', response.data)
			},
			error => {
				console.log('error found: ', error.message)
			}
		)

	}

  componentDidUpdate = (prevProps) => {

		const { location } = this.props

    let newGroupInfo = location.state ? location.state.groupInfo : undefined
    let oldGroupInfo = prevProps.location.state ? prevProps.location.state.groupInfo : undefined

    if (newGroupInfo.id && newGroupInfo.id !== oldGroupInfo.id) {


			
		}

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