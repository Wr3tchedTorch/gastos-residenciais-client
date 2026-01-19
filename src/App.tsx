import { Box, Tab, Tabs } from '@mui/material';
import './App.css'
import UserManagement from './Pages/UserManagement';
import React from 'react';
import CategoryManagement from './Pages/CategoryManagement';
import TransactionManagement from './Pages/TransactionManagement';

function App() {

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);

  return (
    <>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        }}>
        
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered style={{backgroundColor: 'white' }}>
          <Tab label="Usuários" {...a11yProps(0)} />
          <Tab label="Categorias" {...a11yProps(1)} />
          <Tab label="Transações" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserManagement />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CategoryManagement/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TransactionManagement />
      </CustomTabPanel>
    </>
  )
}

export default App
