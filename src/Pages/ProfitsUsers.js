import React from 'react';
import FindUser from '../Components/Profits/FindUser';

class ProfitsUsers extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {

  }

  getDocumentUser = (event) => {
    event.preventDefault();
    console.log("Form action", event.target.document.value);
  }

  render() {
    return (
      <>
        <div>Beneficios de usuarios</div>
        <FindUser actionUser={this.getDocumentUser} />
      </>
    )
  }

}

export default ProfitsUsers;