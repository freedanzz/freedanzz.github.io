import React from 'react';
import DetailUser from '../Components/Users/DetailUser';
import Users from '../Components/Users/Users';
import { Helmet } from 'react-helmet';

class UsersPage extends React.Component {
  
  state = {
    loading: true,
    user: {}
  };

  getUser = (data) => {
    console.log(data);
    let user = {...data};
    this.setState({user: user});
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Freedanz | Usuarios</title>
        </Helmet>
        <div className='wrapUsers'>
          <div className="wrapLeft">
            <Users getUserHandle={this.getUser} />
          </div>
          <div className='warpRight'>
            <DetailUser user={this.state.user} />
          </div>
        </div>
      </>
    )
  }

}

export default UsersPage;