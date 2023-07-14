import React from 'react';
import ImgHome from '../Images/home_opt.png';
import { Helmet } from 'react-helmet';
// import DownloadButton from '../Utils/DownloadPWA';

const Page404 = () => {
    return (
        <>
            <Helmet>
                <title>Freedanzz | Home</title>
            </Helmet>
            <div className='wrapScreenHome'>
                <div className='wrapMainHome'>
                    <img src={ImgHome} alt='Home' />
                </div>
            </div>
        </>
    )
}

export default Page404;