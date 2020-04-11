import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Form } from 'reactstrap';
import { getGroupInfo, getMember, updateTitleGroup, updateMembersGroup } from '../nodeserverapi'

class ManageGroups extends Component {
  constructor() {
    super();
    this.state = { groupsMembers: [], groupInfo: undefined, newMember: '', newGroupTitle: '' };
	}
	
	componentDidMount = () => {

    getGroupInfo(getUserToken(), this.props.location.state.groupId,
      response => {
        let groupInfo = response.data
        this.getMembers(groupInfo.id)
        this.setState({ groupInfo: groupInfo, newGroupTitle: groupInfo.title })
      },
      error => {
      }
    )

  }

  onChangeNewMember = (e) => {
    this.setState({ newMember: e.target.value })
  }
  
  onChangeNewGroupTitle = (e) => {
    this.setState({ newGroupTitle: e.target.value })
  }

  addMembers = (e) => {
    e.preventDefault()
    const { groupInfo, newMember } = this.state;

    updateMembersGroup(getUserToken(), groupInfo.id, true, newMember,
      response => {
        this.setState({ groupInfo: response.data })
      },
      error => {
      }
    )
  }
  
  getMembers = (groupId) => {
    getMember(getUserToken(), groupId,
      response => {
        this.setState({ groupsMembers: response.data })
      },
      error => {
      }
    )
  }

  updateGroupTitle = (e) => {
    e.preventDefault()
    const { newGroupTitle, groupInfo } = this.state;

    updateTitleGroup(getUserToken(), groupInfo.id, newGroupTitle,
      response => {
        this.setState({ groupInfo: response.data })
      },
      error => {
      }
    )
  }

  render() {
		const { groupsMembers, newMember, newGroupTitle } = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <br></br>
            <Form onSubmit={this.updateGroupTitle}>
              <input
                name="newGroupTitle"
                value={newGroupTitle}
                onChange={this.onChangeNewGroupTitle}
              />                    
            </Form>
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Form onSubmit={this.addMembers}>
                  <input
                    name="newMember"
                    placeholder="enter usernames"
                    value={newMember}
                    onChange={this.onChangeNewMember}
                  />                    
                </Form>

                <hr></hr>

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