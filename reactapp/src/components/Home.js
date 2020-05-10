import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Row, Card, CardBody, Button, Form, Container, ButtonGroup } from 'reactstrap';
import { createMessage, getMessages, getGroupInfo, getUser, updateMembersGroup, getFirstGroup } from '../nodeserverapi'
import { Redirect } from 'react-router-dom'
import Scrollbar from 'react-smooth-scrollbar';


class Home extends Component {
  constructor() {
    super();
    this.state = {groupsInitUsers: '', groupList: [], selectedGroup: undefined, 
    newMemberUsername: '', newMessage: '', groupsMessages: [], sameId: undefined, 
    isCreator: true, confirm: false, redirect: false };
  }


  componentDidMount = () => {

    if (this.props.location.state) {
      const { groupId } = this.props.location.state
      this.getGroup(groupId)
      this.getGroupMessages(groupId)
    } else {
      this.getFirstGroupInfo()
    }

  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupId = location.state ? location.state.groupId : undefined
    let oldGroupId = prevProps.location.state ? prevProps.location.state.groupId : undefined

    if (newGroupId && newGroupId!==oldGroupId) {
      this.getGroup(newGroupId)
      this.getGroupMessages(newGroupId)
      this.setState({ onHomePage: false })
    }
  }

  getFirstGroupInfo = () => {
    getFirstGroup(getUserToken(),
      response => {
        this.getGroupMessages(response.data.id)

        this.setState({ selectedGroup: response.data })
        if (response.data.creator !== this.props.userInfo.id) {
          this.setState({isCreator: false})
        } else this.setState({isCreator: true})
      },
      error => {
      }
    )
  }

  getGroup = (groupId) => {
    getGroupInfo(getUserToken(), groupId,
      response => {
        this.setState({ selectedGroup: response.data })
        if (response.data.creator !== this.props.userInfo.id) {
          this.setState({isCreator: false})
        } else this.setState({isCreator: true})
      },
      error => {
      }
    )

  } 

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
  }

  getGroupMessages = (groupId) => {

    getMessages(getUserToken(), groupId,
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

  postMsg = (e) => {
    e.preventDefault()
    const { selectedGroup, newMessage } = this.state;
    if (newMessage && newMessage[0] !== ' ') {
      createMessage(this.props.userInfo.id, selectedGroup.id, newMessage,
        response => {
          this.getGroupMessages(selectedGroup.id)
          this.setState({ newMessage: '' })     
        },
        error => {
        }
      ) 
    }
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
    if (selectedGroup.creator !== userInfo.id) {
    updateMembersGroup(getUserToken(), selectedGroup.id, false, userInfo.email,
      response => {
        this.setState({redirect: true})
        this.setState({redirect: false, confirm: false})
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
            this.setState({selectedGroup: undefined })
          },
          error => {
          }
        )
      },
      error => {
      }
    )
    }
  }

  confirmBool = () => {
    const {confirm} = this.state
    this.setState({confirm: !confirm})
  }

  render() {
    const {newMessage, groupsMessages, selectedGroup, confirm, redirect} = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Row md='auto'>
                  <Col md='auto'><h5 className="page-title2">{selectedGroup ? selectedGroup.title : ''}</h5></Col>
                  {!this.state.isCreator && !confirm && <Col ><Button color='primary' size='sm' onClick={this.confirmBool}>Leave Group</Button></Col>}
                  {!this.state.isCreator && confirm && <Col><ButtonGroup size='sm'>
                    <Button onClick={this.leaveGroup} color='danger'>{redirect && <Redirect to='/' />}Confirm</Button>
                    <Button onClick={this.confirmBool} color='primary'>Cancel</Button> 
                  </ButtonGroup></Col>}
                  {selectedGroup && this.state.isCreator && <Col><Link to={{pathname:'/manage', state: {groupId: selectedGroup.id}}}><Button color='primary' size='sm'>Manage</Button></Link></Col>}
                </Row>

                <Scrollbar className='sidebar__scroll1'>
                  <table>
                    {groupsMessages.map((message, index) => <tbody key={index}>
                      <tr>
                        <td className='poster'>{message.poster}</td>
                      </tr>
                      <tr>
                        <td className='content'>{message.content}</td>
                      </tr>  
                    </tbody>)}
                  </table> 
                </Scrollbar >
                <Form onSubmit={this.postMsg}>
                  <input className='msginput input'
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