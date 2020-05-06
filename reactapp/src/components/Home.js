import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Row, Card, CardBody, Button, Form, Container } from 'reactstrap';
import { createMessage, getMessages, getGroupInfo, getUser, updateMembersGroup, countGroupsMessage } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { onHomePage: true, groupsInitUsers: '', groupList: [], selectedGroup: undefined, 
    newMemberUsername: '', newMessage: '', groupsMessages: [], pageNo: 1, sameId: undefined, 
    isCreator: true, messageCount: undefined, reset: false };
  }

  componentDidMount = () => {

    if (this.props.location.state) {
      const { groupId } = this.props.location.state
      this.getGroup(groupId)
      this.getGroupMessages(groupId, 1)
      this.setState({onHomePage: this.props.location.backToGroup, pageNo: 1})
    }

  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupId = location.state ? location.state.groupId : undefined
    let oldGroupId = prevProps.location.state ? prevProps.location.state.groupId : undefined

    if (newGroupId && newGroupId!==oldGroupId) {
      this.getGroup(newGroupId)
      this.getGroupMessages(newGroupId, 1)
      this.setState({ onHomePage: false, pageNo: 1, reset: false })
    }
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

  getGroupMessages = (groupId, newPageNo) => {
    const { pageNo, messageCount } = this.state;
    let skipCount;
    countGroupsMessage(getUserToken(), groupId, 
      response => {
        this.setState({messageCount: response.data})
      },
      error => {
      }
    )

    if (newPageNo) {
      skipCount = newPageNo * 10
    } else {
      skipCount = pageNo * 10
    }
    if (skipCount > messageCount && messageCount) {
      this.setState({reset: true})
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
    const { pageNo, sameId, reset } = this.state;
    let newPageNo = pageNo;
    
    if (shouldIncrease) {
      newPageNo = pageNo + 1
    } else {
      if (pageNo > 1) {
        newPageNo = pageNo - 1
      }
    }

    if (reset) {
      this.setState({reset: false})
    }

    this.getGroupMessages(sameId, newPageNo)
    this.setState({ pageNo: newPageNo })
  }

  postMsg = (e) => {
    e.preventDefault()

    const { selectedGroup, newMessage } = this.state;
    if (newMessage && newMessage[0] !== ' ') {
      this.setState({pageNo: 1, reset: false})
      createMessage(this.props.userInfo.id, selectedGroup.id, newMessage,
        response => {
          this.getGroupMessages(selectedGroup.id, 0)
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
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
            this.setState({selectedGroup: undefined, onHomePage: true})
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

  render() {
    const { onHomePage, newMessage, groupsMessages, selectedGroup, reset, messageCount, pageNo } = this.state;

    return (
      <Container className="dashboard">
        {onHomePage && <h3 className="page-title">Home</h3>}

        {!onHomePage && <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Row md='auto'>
                  <Col md='auto'><h5 className="page-title2">{selectedGroup ? selectedGroup.title : ''}</h5></Col>
                  {!this.state.isCreator && !onHomePage && <Col ><Button color='primary' size='sm' onClick={this.leaveGroup}>Leave Group</Button></Col>}
                  {selectedGroup && this.state.isCreator && <Col><Link to={{pathname:'/manage', state: {groupId: selectedGroup.id}}}><Button color='primary' size='sm'>Manage</Button></Link></Col>}
                </Row>

                {messageCount > 10 && <div>
                {reset ? <Button disabled size='sm' >{'<'}</Button> : <Button color='primary' size='sm' onClick={()=>this.pageNoChanger(true)}>{'<'}</Button>}
                {pageNo === 1 ? <Button disabled size='sm' >{'>'}</Button> : <Button color='primary' size='sm' onClick={()=>this.pageNoChanger(false)}>{'>'}</Button>}
                </div>}

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
        </Row>}

      </Container>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);