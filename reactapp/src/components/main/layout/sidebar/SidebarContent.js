import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../../../redux/containers/SignedInUserCtr';
import { getUser } from '../../../../nodeserverapi'

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [] };
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

    if (prevProps.userInfo.groups !== this.props.userInfo.groups) {
      this.setState({ groupList: this.props.userInfo.groups })
    }

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

        {groupList.map((group, index) => 
          <ul key={index} className="sidebar__block">
            <SidebarLink key={index} title={group.title} to={{pathname:'/', state: {groupId: group._id}}} onClick={this.hideSidebar} />

            <div className="form__form-group">
              <div className="form__form-group-field">
                <SidebarLink key={index} title={'manage: ' + group.title} to={{pathname:'/manage', state: {groupId: group._id}}} onClick={this.hideSidebar} />
              </div>
            </div>
          </ul>
        )}  
      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
