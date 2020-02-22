import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import {
  Link } from "react-router-dom";
//import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };


  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        {/*<ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" route="/signin" onClick={this.hideSidebar} />
        </ul>*/}
        <ul className="sidebar__block">
          {/*<SidebarCategory title="Example Pages" icon="diamond">*/}
            <SidebarLink justki={{hello: 'world'}} title="Home" route="/" onClick={this.hideSidebar} />
            <SidebarLink title="Users" route="/users" onClick={this.hideSidebar} />
          {/*</SidebarCategory>*/} 
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
