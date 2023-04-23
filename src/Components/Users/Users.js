import React from 'react';
import useGoogleSheets from 'use-google-sheets';

const Users = (props) => {
  const { data, loading, error } = useGoogleSheets({
    apiKey: 'AIzaSyBLRnru0gEcZhGSuXnqUZmo6d4mmntdabI',
    sheetId: '1iG8zVNmhyCx-pVpyj-rItot_AoQcCGGix46EE5yHdxg'
  });
  console.log("data", data[0]);
  if(loading) {
    return (
      <div>Cargando...</div>
    )
  }
  if (error) {
    return <div>Error!</div>;
  }
  let countUser = 0;
  return (
    data[0].data.map((item, key) => {
      countUser++;
      return (
        <>
          <div className='user' onClick={() => props.getUserHandle(item)}>{item['Nombres']} {item['Apellidos']}</div>
          <div>{data[0].data.length === countUser ? 'Ganancias totales: $' + (countUser*50000) + ' por mes.' : ''}</div>
        </>
      )
    })
  )
}

export default Users;