import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert, Form, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { createGroup, getAllUsers, createMessage, getMessages, updateGroupsMembers } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { groupsInitUsers: '', groupList: [], showGroup: false, selectedGroup: undefined, newMemberUsername: '', groupTableIndex: undefined, newMessage: '', groupsMessages: [], pageNo: 1, sameId: undefined };
  }

  componentDidUpdate = (prevProps, prevState) => {

    const { location } = this.props

    let newGroupInfo = location.state ? location.state.groupInfo : undefined
    let oldGroupInfo = prevProps.location.state ? prevProps.location.state.groupInfo : undefined

    if (newGroupInfo && newGroupInfo!==oldGroupInfo) {
      console.log('>>>>> groups id to check messages ', newGroupInfo.id)

      getMessages(getUserToken(), newGroupInfo.id, 0,
        response => {
          console.log('success on the message call: ', response.data)

          let tempGroupsMessages = []

          for (let message of response.data) {
          
            message.poster = this.getUserNickname(message.poster.email)    

            tempGroupsMessages.unshift(message)
          }

          this.setState({ groupsMessages: tempGroupsMessages, sameId: newGroupInfo.id, selectedGroup: newGroupInfo })
        },
        error => {
          console.log('message call failed: ', error.message)
        }
      )

    }


  }

  onChangeGroupsInitUsers = (e) => {
    console.log('>>>>', e.target.value)
    this.setState({ groupsInitUsers: e.target.value })
  }

  onChangeNewMemberUsername = (e) => {
    this.setState({ newMemberUsername: e.target.value })
  }

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
    console.log(e.target.value)
  }

  createGroup = (e) => {
    e.preventDefault()

    const { groupsInitUsers, groupList } = this.state;
    console.log('>>>> creating group')

    let emailsToAdd = this.parseForUserEmails(groupsInitUsers)
    emailsToAdd.unshift(this.props.userInfo.email)
    console.log('emailsToAdd: ', emailsToAdd)

    let groupsDefaultTitle = ''
    for (let email of emailsToAdd) {
      let nickname = this.getUserNickname(email)
      groupsDefaultTitle = groupsDefaultTitle + nickname + ', '
    }
    console.log('groups default title: ', groupsDefaultTitle)
    

    createGroup(groupsDefaultTitle, emailsToAdd,
        response => {
            console.log('group created: ', response.data)
            groupList.push(response.data)
            this.setState({ groupsInitUsers: '' })
        },
        error => {
            console.log('error found: ', error.message)
        }
    )

    console.log(groupList)
  }

  parseForUserEmails = (emailsString) => {
    
    let emailsList = emailsString.split(/[ ,]+/)

    for (let email of emailsList) {
      email = email.trim()
    }

    return emailsList

  }

  openAdder = (group, index) => {
    const {  } = this.state

    console.log('adding member')
    console.log('>>>>> ', group)  

    this.setState({ groupTableIndex: index })  
  }

  getGroupMessages = (groupId, newPageNo) => {
    const { pageNo } = this.state;
    let skipCount;

    console.log('newPageNo & pageNo: ', newPageNo, pageNo)

    if (newPageNo) {
      skipCount = newPageNo * 10
    } else {
      skipCount = pageNo * 10
    }

    console.log('skipCount:', skipCount)

    getMessages(getUserToken(), groupId, skipCount-10,
      response => {
        console.log('success on the message call: ', response.data)

        let tempGroupsMessages = []

        for (let message of response.data) {
        
          message.poster = this.getUserNickname(message.poster.email)    

          tempGroupsMessages.unshift(message)
        }

        this.setState({ groupsMessages: tempGroupsMessages, sameId: groupId })
      },
      error => {
        console.log('message call failed: ', error.message)
      }
    )
  }

  pageNoChanger = (shouldIncrease) => {
    const { pageNo, sameId } = this.state;
    let newPageNo = pageNo;

    console.log('pageNo before update:', pageNo)

    if (shouldIncrease) {
      console.log('increasing')
      newPageNo = pageNo + 1
    } else {
      console.log('checking for valid decrease')
      if (pageNo > 1) {
        console.log('decreasing from ', pageNo, ' to ', pageNo-1)
        newPageNo = pageNo - 1
      }
    }

    console.log('getting group messages')
    this.getGroupMessages(sameId, newPageNo)

    console.log('setting pageNo to ', newPageNo)
    this.setState({ pageNo: newPageNo })
  }

  checkValidUsername = (group) => {
    const { newMemberUsername } = this.state;
    console.log('here: ', newMemberUsername)

    getAllUsers(getUserToken(),
      response => {
        console.log('success!', response.data)
        for (let user of response.data) {
          if (user.email === newMemberUsername) {
            this.addMember(user.id, group)
          }
        }
      },
      error => {
        console.log('error found: ', error.message)
      }
    )

  }

  addMember = (userId, group) => {
    console.log('<><><><><><><><><><><><><><>', userId)

    let newMembersList = [...group.members]
    newMembersList.push(userId)
    console.log(newMembersList)
    console.log('IMPORTANT: ', group.id)

    updateGroupsMembers(group.id , getUserToken(), newMembersList,
      response => {
        console.log('success!: ', response.data)
      },
      error => {
        console.log('error found: ', error.message)
      }
    )
  }

  postMsg = (e) => {
    e.preventDefault()

    const { selectedGroup, newMessage, groupsMessages } = this.state;
    console.log(this.props.userInfo)
    console.log('>>>>>>> here', selectedGroup)

    createMessage(this.props.userInfo.id, selectedGroup.id, newMessage,
        response => {
          console.log('>>>>>>>>>>>>>>>>', response.data)

          this.getGroupMessages(selectedGroup.id, 0)

          this.setState({ newMessage: '' })

 /*         let alteredMessage = response.data

          alteredMessage.poster = this.getUserNickname(response.data.poster.email)

          let tempGroupsMessages = [...groupsMessages]
          tempGroupsMessages.push(alteredMessage)

          this.setState({ groupsMessages: tempGroupsMessages }) */
      
        },
        error => {
          console.log('error found: ', error.message)
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
        console.log('>>>>>>>>>found')
        signedInUserIndex = index
      }
      index++
    }

    if (signedInUserIndex) {
      newMembersList.splice(signedInUserIndex-1, 1)
    } else {
      console.log(signedInUserIndex)
      console.log('User not found in group memberList')
    }

    updateGroupsMembers(group.id, getUserToken(), newMembersList,
      response => {
        console.log(response.data)
      },
      error => {
        console.log(error.message)
      }  
    )
  }


  render() {
    const { groupsInitUsers, groupList, showGroup, newMessage, groupsMessages, pageNo, newMemberUsername, groupTableIndex, selectedGroup } = this.state;

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