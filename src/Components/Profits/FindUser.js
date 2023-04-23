import React from 'react';

const FindUser = (props) => {
  return (
    <form onSubmit={props.actionUser}>
      <input type="text" name="document" placeholder='Número de documento' />
    </form>
  )
}

export default FindUser;