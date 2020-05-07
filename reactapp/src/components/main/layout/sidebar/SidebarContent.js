import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { connect } from 'react-redux';
import { Form, Input } from 'reactstrap'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../../../redux/containers/SignedInUserCtr';
import { getUser, createGroup, getValidUsers } from '../../../../nodeserverapi'
import { groupPrefixes, groupPrefixes2, groupRoots } from '../../../GroupNames';

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [], groupsInitUsers: [] };
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    getUser(this.props.userInfo.id, getUserToken(),
      response => {
      },
      error => {
      }
    )
    let usersGroups = this.props.userInfo && this.props.userInfo.groups ? this.props.userInfo.groups : []
    this.setState({ groupList: usersGroups })
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.userInfo && prevProps.userInfo.groups !== this.props.userInfo.groups) {
      this.setState({ groupList: this.props.userInfo.groups })
    }
  }

  onChangeGroupsInitUsers = (e) => {
    this.setState({ groupsInitUsers: e.target.value })
  }

  createNewGroup = (e) => {
    e.preventDefault()

    const { groupsInitUsers, groupList } = this.state;

    let emailsToAdd = this.parseForUserEmails(groupsInitUsers)

    let validUserEmails = []
    let validUsers = []

    getValidUsers(getUserToken(), emailsToAdd,
      response => {

        validUsers = response.data

        if (validUsers.length > 0) {

          for (let user of validUsers) {
            validUserEmails.push(user.email)
          } 
      
          validUserEmails.unshift(this.props.userInfo.email)
  
          let listOneLength = groupPrefixes.length
          let listTwoLength = groupPrefixes2.length
          let listThreeLength = groupRoots.length
          
          let prefixOneIndex = Math.floor(Math.random() * Math.floor(listOneLength))
          let prefixTwoIndex = Math.floor(Math.random() * Math.floor(listTwoLength))
          let rootIndex = Math.floor(Math.random() * Math.floor(listThreeLength))
  
          let prefixOne = groupPrefixes[prefixOneIndex]
          let prefixTwo = groupPrefixes2[prefixTwoIndex]
          let root = groupRoots[rootIndex]
  
          let initGroupsDefaultTitle = prefixOne + ' ' + prefixTwo + ' ' + root
          let groupsDefaultTitle = initGroupsDefaultTitle.trim()
      
          createGroup(groupsDefaultTitle, validUserEmails, this.props.userInfo.id,
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

        } else {
          this.setState({ groupsInitUsers: '' })
        }

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

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { groupList, groupsInitUsers } = this.state;

    return (
      <span>
        <div className="sidebar__content">
          {/*<ul className="sidebar__block">
            <SidebarLink title="Log Out" icon="exit" route="/signin" onClick={this.hideSidebar} />
          </ul>*/}
          <Form onSubmit={this.createNewGroup}>
            <Input bsSize='sm'
              name="groupsInitUsers"
              placeholder="enter user(s) for new group"
              value={groupsInitUsers}
              onChange={this.onChangeGroupsInitUsers}
            />
        </Form>
        <hr/>
          {groupList.map((group, index) => 
            <ul key={index} className='sidebar__block'>
              <SidebarLink key={index} title={group.title} to={{pathname:'/', state: {groupId: group._id}, backtoGroup: false}} onClick={this.hideSidebar} />
            </ul>
          )}  
        </div>
      </span>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
