import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function SystemSettingsView() {
  const [showInforDetails, setShowInforDetails] = useState(false);
  const [showSettingDetails, setShowSettingDetails] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const toggleContactDetails = () => {
    setShowContactDetails(prev => !prev);
  };

  const toggleInforDetails = () => {
    setShowInforDetails(prev => !prev);
  };

  const toggleSettingDetails = () => {
    setShowSettingDetails(prev => !prev);
  };

  const handleOpenDialog = () => {
    // Logic to open dialog
    console.log('Open dialog for new user');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Settings
        </Typography>
      </Box>

      <List>
        <ListItem button onClick={toggleContactDetails}>
          <ListItemText primary="Cài đặt liên hệ" />
        </ListItem>
        {showContactDetails && (
          <Box sx={{ p: 2 }}>
            <List>
              <ListItem button onClick={() => console.log('Cài đặt liên hệ 1')}>
                <ListItemText primary="Cài đặt liên hệ 1" />
              </ListItem>
              <ListItem button onClick={() => console.log('Cài đặt liên hệ 2')}>
                <ListItemText primary="Cài đặt liên hệ 2" />
              </ListItem>
              <ListItem button onClick={() => console.log('Cài đặt liên hệ 3')}>
                <ListItemText primary="Cài đặt liên hệ 3" />
              </ListItem>
            </List>
          </Box>
        )}
        
        <Divider />
        
        <ListItem button onClick={toggleInforDetails}>
          <ListItemText primary="Thông tin công ty" />
        </ListItem>
        {showInforDetails && (
          <Box sx={{ p: 2 }}>
            <List>
              <ListItem button onClick={() => console.log('Thông tin công ty 1')}>
                <ListItemText primary="Cài đặt Thông tin công ty 1" />
              </ListItem>
              <ListItem button onClick={() => console.log('Thông tin công ty 2')}>
                <ListItemText primary="Cài đặt Thông tin công ty 2" />
              </ListItem>
              <ListItem button onClick={() => console.log('Thông tin công ty 3')}>
                <ListItemText primary="Cài đặt Thông tin công ty 3" />
              </ListItem>
            </List>
          </Box>
        )}

        <Divider />
        
        <ListItem button onClick={toggleSettingDetails}>
          <ListItemText primary="Cấu hình thông báo" />
        </ListItem>
        {showSettingDetails && (
          <Box sx={{ p: 2 }}>
            <List>
              <ListItem button onClick={() => console.log('Cấu hình thông báo 1')}>
                <ListItemText primary="Cài đặt Cấu hình thông báo 1" />
              </ListItem>

              <ListItem button onClick={() => console.log('Cấu hình thông báo 2')}>
                <ListItemText primary="Cài đặt Cấu hình thông báo 2" />
              </ListItem>
              <ListItem button onClick={() => console.log('Cấu hình thông báo 3')}>
                <ListItemText primary="Cài đặt Cấu hình thông báo 3" />
              </ListItem>
            </List>
          </Box>
        )}
      </List>
    </Container>
  );
}