import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const TabsOptions = (props) => {
    return (
        <Tabs
            value={props.currentTab}
            onChange={props.changeTab}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example">
                <Tab value={0} label="Mis calificaciones" />
                <Tab value={1} label="Top de hoy" />
                <Tab value={2} label="Top de la semana" />
        </Tabs>
    )
}

export default TabsOptions;