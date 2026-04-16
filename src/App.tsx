import { useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import AccountSettings from './AccountSettings';
import AccountSettingsV2 from './AccountSettingsV2';
import AccountSettingsV3 from './AccountSettingsV3';
import { theme, layout } from './theme';

/* Sidebar width resolved from the 8pt rhythm token (design-system §4.1). */
const DRAWER_WIDTH = theme.spacing(layout.drawerWidthUnits);

type NavItem = {
  id: string;
  label: string;
  path?: string;
  danger?: boolean;
};

type NavGroup = {
  id: string;
  title?: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'user',
    title: 'User Settings',
    items: [
      { id: 'account', label: 'My Account', path: '/' },
      { id: 'disclosures', label: 'Disclosures' },
    ],
  },
  {
    id: 'app',
    title: 'App Settings',
    items: [{ id: 'notifications', label: 'Notifications' }],
  },
  {
    id: 'content',
    title: 'Content Settings',
    items: [{ id: 'content-settings', label: 'Content Settings' }],
  },
  {
    id: 'legal',
    items: [
      { id: 'terms', label: 'Terms Of Use' },
      { id: 'privacy', label: 'Privacy Policy' },
    ],
  },
  {
    id: 'logout',
    items: [{ id: 'logout', label: 'Logout', danger: true }],
  },
  {
    id: 'logout-all',
    items: [{ id: 'logout-all', label: 'Logout from all devices', danger: true }],
  },
];

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<string>('account');

  const handleSelect = (item: NavItem) => {
    setSelected(item.id);
    setMobileOpen(false);
    if (item.path) navigate(item.path);
  };

  const isActive = (item: NavItem) => {
    if (item.path) return location.pathname === item.path;
    return selected === item.id;
  };

  const sidebar = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 2,
      }}
      role="navigation"
      aria-label="Settings"
    >
      {NAV_GROUPS.map((group, groupIndex) => (
        <Box key={group.id}>
          {groupIndex > 0 && <Divider sx={{ my: 1 }} />}

          {group.title && (
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                px: 1.5,
                color: 'text.secondary',
              }}
            >
              {group.title}
            </Typography>
          )}

          <List disablePadding>
            {group.items.map((item) => (
              <SidebarItem
                key={item.id}
                label={item.label}
                selected={isActive(item)}
                danger={item.danger}
                onClick={() => handleSelect(item)}
              />
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
        open
      >
        {sidebar}
      </Drawer>

      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {sidebar}
      </Drawer>

      {/* Main column */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile menu trigger */}
        <IconButton
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            position: 'fixed',
            top: (t) => t.spacing(1.5),
            left: (t) => t.spacing(1.5),
            zIndex: (t) => t.zIndex.appBar,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Routes>
            <Route path="/" element={<AccountSettings />} />
            <Route path="/v2" element={<AccountSettingsV2 />} />
            <Route path="/v3" element={<AccountSettingsV3 />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar item                                                      */
/* ------------------------------------------------------------------ */

function SidebarItem({
  label,
  selected,
  danger,
  onClick,
}: {
  label: string;
  selected?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        px: 1.5,
        py: 1,
        my: 0.25,
        // radius-md (6px) per design-system §6 — uses theme.shape.borderRadius.
        borderRadius: 1,
        // WCAG 2.5.8 / design-system §13.2 touch target — 44pt minimum.
        minHeight: (t) => t.spacing(layout.touchTargetUnits),
        color: danger ? 'error.main' : 'text.primary',
        '&:hover': {
          bgcolor: danger
            ? (t) => alpha(t.palette.error.main, 0.06)
            : 'action.hover',
        },
        '&.Mui-selected': {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
          color: 'primary.main',
          '&:hover': {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
          },
        },
      }}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          variant: 'body1',
          fontWeight: selected ? 600 : 400,
        }}
      />
    </ListItemButton>
  );
}
