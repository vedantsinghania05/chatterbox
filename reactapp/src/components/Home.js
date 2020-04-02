import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Form } from 'reactstrap';
import { createGroup, getAllUser, createMessage, getMessage, updateMembersGroup } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { groupsInitUsers: '', groupList: [], showGroup: false, selectedGroup: undefined, newMemberUsername: '', groupTableIndex: undefined, newMessage: '', groupsMessages: [], pageNo: 1, sameId: undefined };
  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupInfo = location.state ? location.state.groupInfo : undefined
    let oldGroupInfo = prevProps.location.state ? prevProps.location.state.groupInfo : undefined

    if (newGroupInfo && newGroupInfo!==oldGroupInfo) {
      getMessage(getUserToken(), newGroupInfo.id, 0,
        response => {
          let tempGroupsMessages = []

          for (let message of response.data) {    
            message.poster = this.getUserNickname(message.poster.email)    
            tempGroupsMessages.unshift(message)
          }

          this.setState({ groupsMessages: tempGroupsMessages, sameId: newGroupInfo.id, selectedGroup: newGroupInfo })
        },
        error => {
        }
      )
    }
  }

  onChangeGroupsInitUsers = (e) => {
    this.setState({ groupsInitUsers: e.target.value })
  }

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
  }

  createGroup = (e) => {
    e.preventDefault()

    const { groupsInitUsers, groupList } = this.state;

    let emailsToAdd = this.parseForUserEmails(groupsInitUsers)
    emailsToAdd.unshift(this.props.userInfo.email)

    let groupsDefaultTitle = ''

    for (let email of emailsToAdd) {
      let nickname = this.getUserNickname(email)
      groupsDefaultTitle = groupsDefaultTitle + nickname + ', '
    }

    createGroup(groupsDefaultTitle, emailsToAdd,
      response => {
          groupList.push(response.data)
          this.setState({ groupsInitUsers: '' })
      },
      error => {
      }
    )
  }

  parseForUserEmails = (emailsString) => {
    
    let emailsList = emailsString.split(/[ ,]+/)

    for (let email of emailsList) {
      email = email.trim()
    }

    return emailsList
  }

  getGroupMessages = (groupId, newPageNo) => {
    const { pageNo } = this.state;
    let skipCount;

    if (newPageNo) {
      skipCount = newPageNo * 10
    } else {
      skipCount = pageNo * 10
    }

    getMessage(getUserToken(), groupId, skipCount-10,
      response => {

        let tempGroupsMessages = []

        for (let message of response.data) {
        
          message.poster = this.getUserNickname(message.poster.email)    

          tempGroupsMessages.unshift(message)
        }

        this.setState({ groupsMessages: tempGroupsMessages, sameId: groupId })
      },
      error => {
      }
    )
  }

  pageNoChanger = (shouldIncrease) => {
    const { pageNo, sameId } = this.state;
    let newPageNo = pageNo;

    if (shouldIncrease) {
      newPageNo = pageNo + 1
    } else {
      if (pageNo > 1) {
        newPageNo = pageNo - 1
      }
    }

    this.getGroupMessages(sameId, newPageNo)
    this.setState({ pageNo: newPageNo })
  }

  checkValidUsername = (group) => {
    const { newMemberUsername } = this.state;

    getAllUser(getUserToken(),
      response => {
        for (let user of response.data) {
          if (user.email === newMemberUsername) {
            this.addMember(user.id, group)
          }
        }
      },
      error => {
      }
    )
  }

  addMember = (userId, group) => {
    let newMembersList = [...group.members]
    newMembersList.push(userId)

    updateMembersGroup(group.id , getUserToken(), newMembersList,
      response => {
      },
      error => {
      }
    )
  }

  postMsg = (e) => {
    e.preventDefault()

    const { selectedGroup, newMessage } = this.state;

    createMessage(this.props.userInfo.id, selectedGroup.id, newMessage,
        response => {
          this.getGroupMessages(selectedGroup.id, 0)
          this.setState({ newMessage: '' })     
        },
        error => {
        }
      ) 
  }

  getUserNickname = (username) => {
    let suffixIndex = username.indexOf('@')
    let suffixLength = username.length-suffixIndex
    let posterCharacterList = username.split('')

    posterCharacterList.splice(suffixIndex, suffixLength)

    let strungCharacters = ''
    for (let character of posterCharacterList) {
      strungCharacters = strungCharacters + character
    }

    return strungCharacters
  }

  leaveGroup = (group) => {
    let newMembersList = group.members
    let index = 1
    let signedInUserIndex = -1

    for (let memberId of newMembersList) {
      if (memberId === this.props.userInfo.id) {
        signedInUserIndex = index
      }
      index++
    }

    if (signedInUserIndex) {
      newMembersList.splice(signedInUserIndex-1, 1)
    }

    updateMembersGroup(group.id, getUserToken(), newMembersList,
      response => {
      },
      error => {
      }  
    )
  }

  render() {
    const { groupsInitUsers, newMessage, groupsMessages, selectedGroup } = this.state;

    return (
        <Container className="dashboard">
          <Row>
            <Col md={12}>
              <br></br>
              <h3 className="page-title">{selectedGroup ? selectedGroup.title : 'Home'}</h3>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={this.createGroup}>
                    <input
                      name="groupsInitUsers"
                      placeholder="Enter users"
                      value={groupsInitUsers}
                      onChange={this.onChangeGroupsInitUsers}
                    />
                  </Form>

                  <hr></hr>

                  <Button size='sm' onClick={()=>this.pageNoChanger(true)}>{'<'}</Button>
                  <Button size='sm' onClick={()=>this.pageNoChanger(false)}>{'>'}</Button>

                  <table>
                    <tbody>
                      {groupsMessages.map((message, index) => <tr key={index}>
                        <td>{message.poster + '-'}</td>
                        <td><br></br></td>
                        <td>{message.content}</td>
                      </tr>)}
                    </tbody>
                  </table> 

                  <hr></hr>

                  <Form onSubmit={this.postMsg}>
                    <input
                      name="newMessage"
                      placeholder="enter message"
                      value={newMessage}
                      onChange={this.onChangeNewMessage}
                    />                    
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>    
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);