import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert, Form, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { createGroup, getAllGroups, getGroup, addMember } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { groupTitle: '', groupList: [], showGroup: false, selectedGroup: undefined, newMemberUsername: '', groupTableIndex: undefined };
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

  createGroup = () => {
    const { groupTitle, groupList } = this.state;
    console.log('>>>> creating group')

    groupList.push({ title: groupTitle, members: [] })

    createGroup(groupTitle, this.props.userInfo.id,
        response => {
            console.log('group created: ', response.data)
            this.setState({ groupTitle: '' })
        },
        error => {
            console.log('error found: ', error.message)
        }
    )

    console.log(groupList)
  }

  goToGroup = (groupId) => {
    console.log('GROUPID: ', groupId)
    getGroup(groupId, getUserToken(),
      response => {
        console.log('success!: ', response.data)
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

  addMember = () => {
    const { newMemberUsername } = this.state;
    console.log('here: ', newMemberUsername)
  }


  render() {
    const { groupTitle, groupList, showGroup, selectedGroup, newMemberUsername, groupTableIndex } = this.state

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
                      <td><Button onClick={()=>this.goToGroup(group.id)}>{group.title}</Button></td>
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
                        <Button onClick={this.addMember}>Add</Button>
                      </td>}
                    </tr>)}
                  </tbody>
                </table>

                {showGroup && <span>
                  
                  <Form>
                    <FormGroup>
                      <p>test</p>
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