import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../../../redux/containers/SignedInUserCtr';
import { Button } from 'reactstrap';
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
    getAllGroups(getUserToken(), this.props.userInfo.id,
      response => {
        console.log('>>>>>>>>>>>> all groups from database', response.data)

        this.setState({ groupList: response.data })
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

          {groupList.map((group, index) => 
            <ul className="sidebar__block">
              <SidebarLink key={index} title={group.title} to={{pathname:'/', state: {groupInfo: group}}} onClick={this.hideSidebar} />
            </ul>
          )}  



      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
