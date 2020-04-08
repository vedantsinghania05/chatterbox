import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button } from 'reactstrap';
import { getGroupInfo, getMember } from '../nodeserverapi'

class ManageGroups extends Component {
  constructor() {
    super();
    this.state = { groupsMembers: [], groupInfo: undefined };
	}
	
	componentDidMount = () => {

    getGroupInfo(getUserToken(), this.props.location.state.groupId,
      response => {
        let groupInfo = response.data
        this.getMembers(groupInfo.id)
        this.setState({ groupInfo: groupInfo })
      },
      error => {
      }
    )

  }
  
  getMembers = (groupId) => {
    getMember(getUserToken(), groupId,
      response => {
        console.log('YAY!: ', response.data)
        this.setState({ groupsMembers: response.data })
      },
      error => {
      }
    )
  }

  render() {
		const { groupsMembers, groupInfo } = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <br></br>
            <h3 className="page-title">{groupInfo && groupInfo.title}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <table>
                  <tbody>
                    {groupsMembers.map((member, index) => <tr key={index}>
                      <td><Button>x</Button></td>
                      <td>{member.email}</td>
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