import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../../../redux/containers/SignedInUserCtr';
import { Link } from "react-router-dom";
import { getAllGroups } from '../../../../nodeserverapi';
//import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [] };
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    getAllGroups(getUserToken(),
      response => {
        console.log('all groups from database', response.data)

        let usersGroups = []

        for (let group of response.data) {
          console.log('group & group.members: ', group, group.members)
          for (let userId of group.members) {
            console.log('userId & current user: ', userId, this.props.userInfo.id)
            if (userId === this.props.userInfo.id) {
              console.log('group found: ', group)
              usersGroups.push(group)
            }
          }
        }

        this.setState({ groupList: usersGroups })
      },
      error => {
        console.log('error found: ', error.message)
      }
    )
  }

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { groupList } = this.state;

    return (
      <div className="sidebar__content">
        {/*<ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" route="/signin" onClick={this.hideSidebar} />
        </ul>*/}

        <ul className="sidebar__block" >Groups</ul>

        <ul className="sidebar__block">
          {groupList.map((group, index) =>  
            <SidebarLink key={index} title={group.title} to={{pathname:'/', state: {groupInfo: group}}} onClick={this.hideSidebar} />
          )}  
        </ul>



      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
