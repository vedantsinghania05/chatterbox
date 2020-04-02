import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../../../redux/containers/SignedInUserCtr';
import { getAllGroup } from '../../../../nodeserverapi';

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [] };
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    getAllGroup(getUserToken(),
      response => {
        if (response.data) this.setState({ groupList: response.data })
      },
      error => {
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

        {groupList.map((group, index) => 
          <ul className="sidebar__block">
            <SidebarLink key={index} title={group.title} to={{pathname:'/', state: {groupId: group}}} onClick={this.hideSidebar} />

            <div className="form__form-group">
              <div className="form__form-group-field">
                <SidebarLink key={index} title={'manage ' + group.title} to={{pathname:'/manage', state: {groupInfo: group.id}}} onClick={this.hideSidebar} />
              </div>
            </div>
          </ul>
        )}  
      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
