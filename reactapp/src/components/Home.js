import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert, Form, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { createGroup, getAllGroups, getGroup, getAllUsers, updateGroup, createMessage, getMessages } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { groupTitle: '', groupList: [], showGroup: false, selectedGroup: undefined, newMemberUsername: '', groupTableIndex: undefined, newMessage: '', groupsMessages: [], pageNo: 1, sameId: undefined };
  }

  componentDidMount= () => {
    console.log('hi')
    getAllGroups(getUserToken(),
      response => {
        console.log('>>>>>>> success!: ', response.data)

        let usersGroups = []
        for (let group of response.data) {
          for (let user of group.members) {
            if (user === this.props.userInfo.id) {
              usersGroups.push(group)
            }
          }
        }

        console.log('>>>>>>>>>> !!!', usersGroups)
        this.setState({ groupList: usersGroups }) 
      },
      error => {
        console.log('error found: ', error.message)
      }
    )
  }

  onChangeGroupTitle = (e) => {
    console.log('>>>>', e.target.value)
    this.setState({ groupTitle: e.target.value })
  }

  onChangeNewMemberUsername = (e) => {
    this.setState({ newMemberUsername: e.target.value })
  }

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
    console.log(e.target.value)
  }

  createGroup = () => {
    const { groupTitle, groupList } = this.state;
    console.log('>>>> creating group')

    createGroup(groupTitle, this.props.userInfo.id,
        response => {
            console.log('group created: ', response.data)
            groupList.push(response.data)
            this.setState({ groupTitle: '' })
        },
        error => {
            console.log('error found: ', error.message)
        }
    )

    console.log(groupList)
  }

  openGroup = (groupId) => {
    console.log('GROUPID: ', groupId)
    getGroup(groupId, getUserToken(),
      response => {
        this.getGroupMessages(groupId)
        this.setState({ selectedGroup: response.data, showGroup: true })
      },
      error => {
        console.log('error found: ', error.message)
      }
    )
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

    updateGroup(group.id , getUserToken(), newMembersList,
      response => {
        console.log('success!: ', response.data)
      },
      error => {
        console.log('error found: ', error.message)
      }
    )
  }

  postMessage = () => {
    const { selectedGroup, newMessage, groupsMessages } = this.state;
    console.log(this.props.userInfo)
    console.log(selectedGroup)

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


  render() {
    const { groupTitle, groupList, showGroup, newMessage, groupsMessages, pageNo, newMemberUsername, groupTableIndex } = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Home</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Form>
                  <FormGroup>
                    <input
                      name="groupTitle"
                      type="string"
                      placeholder="Title"
                      value={groupTitle}
                      onChange={this.onChangeGroupTitle}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button onClick={this.createGroup}>Create</Button>
                  </FormGroup>
                </Form>

                <table>
                  <thead>
                    <tr>
                      <th><p>group</p></th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupList.map((group, index) => <tr key={index}>
                      <td><Button onClick={()=>this.openGroup(group.id)}>{group.title}</Button></td>
                      <td><Button onClick={()=>this.openAdder(group, index)}>+</Button></td>
                      {index === groupTableIndex && <td>
                        <input
                          name="newMemberUsername"
                          type="string"
                          placeholder="enter username"
                          value={newMemberUsername}
                          onChange={this.onChangeNewMemberUsername}/>
                      </td>}
                      {index === groupTableIndex && <td>
                        <Button onClick={()=>this.checkValidUsername(group)}>Add</Button>
                      </td>}
                    </tr>)}
                  </tbody>
                </table>

                {showGroup && <span>
                  
                  <Form>
                    <FormGroup>
                      <table>
                        <thead>
                          <tr>
                            <th>messages</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupsMessages.map((message, index) => <tr key={index}>
                            <td>{message.poster + '-'}</td>
                            <td><br></br></td>
                            <td>{message.content}</td>
                          </tr>)}
                        </tbody>
                      </table> 
                    </FormGroup>
                    <FormGroup>
                      <Button onClick={()=>this.pageNoChanger(false)}>{'<'}</Button>
                      <Button onClick={()=>this.pageNoChanger(true)}>{'>'}</Button>
                    </FormGroup>
                    <FormGroup>
                      <input
                        name="newMessage"
                        type="string"
                        placeholder="enter message"
                        value={newMessage}
                        onChange={this.onChangeNewMessage}
                      />
                      <Button onClick={this.postMessage}>=></Button>
                    </FormGroup>
                  </Form>

                </span>}

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>      
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);