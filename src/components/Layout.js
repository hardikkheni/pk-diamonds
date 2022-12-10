import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const drawerWidth = 250;

const sideBarItems = [
  {
    text: 'Buy',
    to: '/buy',
    icon: ShoppingCartIcon,
  },
  {
    text: 'Sell',
    to: '/sell',
    icon: StorefrontIcon,
  },
];

function Layout() {
  const navigate = useNavigate();
  const goToHome = useCallback(() => navigate('/home'), [navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Avatar onClick={goToHome}>PK</Avatar>
          <Typography
            onClick={goToHome}
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ marginLeft: 10 }}
          >
            Diamonds
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {sideBarItems.map(({ text, to, icon: Icon }) => (
              <ListItem key={text} disablePadding onClick={() => navigate(to)}>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
