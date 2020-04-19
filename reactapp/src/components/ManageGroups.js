import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Form } from 'reactstrap';
import { getGroupInfo, getMember, updateTitleGroup, updateMembersGroup, getUser, deleteGroup, deleteGroupsMessage } from '../nodeserverapi'
import { Link } from 'react-router-dom'


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

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupId = location.state ? location.state.groupId : undefined
    let oldGroupId = prevProps.location.state ? prevProps.location.state.groupId : undefined

    if (newGroupId && newGroupId!==oldGroupId) {
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
        this.getMembers(groupInfo.id)
        this.setState({ groupInfo: response.data, newMember: '' })
      },
      error => {
      }
    )
  }

  deleteGroupMember = (member, i) => {
    const { groupInfo } = this.state;

      updateMembersGroup(getUserToken(), groupInfo.id, false, member.email,
        response => {
          this.getMembers(groupInfo.id)
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
        
        getUser(this.props.userInfo.id, getUserToken(),
        response => {
          this.props.setUserInfo(response.data)
        },
        error => {
        }
      )
      },
      error => {
      }
    )
  }

  removeGroup = () => {
    const { groupInfo } = this.state
    deleteGroup(getUserToken(), groupInfo.id,
      response => {
        this.removeGroupsMessages()
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
      },
      error => {
      }
    )
  }

  removeGroupsMessages = () => {
    const { groupInfo } = this.state;
    
    deleteGroupsMessage(getUserToken(), groupInfo.id,
      response => {
      },
      error => {
      }
    )

  }

  render() {
		const { groupsMembers, newMember, newGroupTitle, groupInfo } = this.state;

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
                      <td>{groupInfo.creator !== member.id ? <Button onClick={()=>this.deleteGroupMember(member, index)}>x</Button>: <Button disabled>X</Button>}</td>
                      <td>{member.email}</td>
                    </tr>)}
                  </tbody>	
                </table>	
                <Link to='/' onClick={this.removeGroup}>Delete Group</Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>    
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(ManageGroups);