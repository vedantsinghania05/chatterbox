import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert, Form, FormGroup } from 'reactstrap';
import {  } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { messages: [], newMessage: '' };
  }

  onChangeNewMessage = (e) => {
    console.log(e.target.value)
    this.setState({ newMessage: e.target.value })
  }

  render() {
    const { newMessage, messages } = this.state

    console.log('>>>>>>>', this.props.history.location.state)

    /* this.props.history.location.state */

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">{this.props.history.location.state.groupId}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Form>
                  <FormGroup>
                    <input
                      name="newMessage"
                      type="string"
                      placeholder="enter message"
                      value={newMessage}
                      onChange={this.onChangeNewMessage}
                    />
                  </FormGroup>
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