import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Row, Card, CardBody, Button, Form } from 'reactstrap';
import { createGroup, createMessage, getMessages, getGroupInfo, getUser, updateMembersGroup } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { onHomePage: true, groupsInitUsers: '', groupList: [], selectedGroup: undefined, newMemberUsername: '', newMessage: '', groupsMessages: [], pageNo: 1, sameId: undefined };
  }

  componentDidMount = () => {

    if (this.props.location.state) {
      const { groupId } = this.props.location.state
      this.getGroup(groupId)
      this.getGroupMessages(groupId, 0)
    }

  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupId = location.state ? location.state.groupId : undefined
    let oldGroupId = prevProps.location.state ? prevProps.location.state.groupId : undefined

    if (newGroupId && newGroupId!==oldGroupId) {
      this.getGroup(newGroupId)
      this.getGroupMessages(newGroupId, 0)
      this.setState({ onHomePage: false })
    }
  }

  getGroup = (groupId) => {
    getGroupInfo(getUserToken(), groupId,
      response => {
        this.setState({ selectedGroup: response.data })
      },
      error => {
      }
    )

  } 

  onChangeGroupsInitUsers = (e) => {
    this.setState({ groupsInitUsers: e.target.value })
  }

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
  }

  createNewGroup = (e) => {
    e.preventDefault()

    const { groupsInitUsers, groupList } = this.state;

    let emailsToAdd = this.parseForUserEmails(groupsInitUsers)
    emailsToAdd.unshift(this.props.userInfo.email)

    let groupsDefaultTitle = ''
    let emailNo = 1

    for (let email of emailsToAdd) {
      let nickname = this.getUserNickname(email)

      if (emailNo < emailsToAdd.length) {
        groupsDefaultTitle = groupsDefaultTitle + nickname + ', '
      } else {
        groupsDefaultTitle = groupsDefaultTitle + nickname
      }
      
      emailNo++
    }

    createGroup(groupsDefaultTitle, emailsToAdd, this.props.userInfo.id,
      response => {
        groupList.push(response.data)
        this.setState({ groupsInitUsers: '' })

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

    getMessages(getUserToken(), groupId, skipCount-10,
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

  leaveGroup = (e) => {
    e.preventDefault()
    const { userInfo } = this.props;
    const { selectedGroup } = this.state;

    updateMembersGroup(getUserToken(), selectedGroup.id, false, userInfo.email,
      response => {
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

  render() {
    const { groupsInitUsers, onHomePage, newMessage, groupsMessages, selectedGroup } = this.state;

    return (
      <span>

          <h3 className="page-title">{selectedGroup ? selectedGroup.title : 'Home'}</h3>
          {!onHomePage && <Button color='primary' size='sm' onClick={this.leaveGroup}>x</Button>}

          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={this.createNewGroup}>
                    <input
                      name="groupsInitUsers"
                      placeholder="Enter users"
                      value={groupsInitUsers}
                      onChange={this.onChangeGroupsInitUsers}
                    />
                  </Form>

                  <hr></hr>

                  <Button color='primary' size='sm' onClick={()=>this.pageNoChanger(true)}>{'<'}</Button>
                  <Button color='primary' size='sm' onClick={()=>this.pageNoChanger(false)}>{'>'}</Button>

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

      </span>

    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);