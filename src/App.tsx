import { useEffect, useState } from 'react';
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
import DiscoverInstitutions from './DiscoverInstitutions';
import { theme, layout, palette, space } from './theme';

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
    id: 'discover',
    items: [
      { id: 'discover-institutions', label: 'Discover Institutions', path: '/discover' },
    ],
  },
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

  /* Keep selection in sync with the URL so route-backed items win on refresh
     or deep-link. Selection is the single source of truth for active styling
     — only one item can be active at a time. Items without a `path` simply
     track the last click (no navigation). */
  useEffect(() => {
    const match = NAV_GROUPS.flatMap((g) => g.items).find(
      (i) => i.path === location.pathname,
    );
    if (match) setSelected(match.id);
  }, [location.pathname]);

  const handleSelect = (item: NavItem) => {
    setSelected(item.id);
    setMobileOpen(false);
    if (item.path) navigate(item.path);
  };

  const isActive = (item: NavItem) => selected === item.id;

  const sidebar = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        pt: space[3],
      }}
      role="navigation"
      aria-label="Settings"
    >
      {NAV_GROUPS.map((group, groupIndex) => {
        /* Untitled groups rely on a thin divider for separation (matches
           the Discover sidebar's flat, edge-to-edge look). Titled groups
           let the overline header carry the visual break instead. */
        const needsDivider = groupIndex > 0 && !group.title;
        return (
          <Box key={group.id}>
            {needsDivider && <Divider sx={{ my: space['0.5'] }} />}

            {group.title && (
              <Box sx={{ pl: space[3], pr: space[3], pt: space['3.5'], pb: space['1.5'] }}>
                <Typography
                  variant="overline"
                  sx={{ display: 'block', color: palette.neutral[300] }}
                >
                  {group.title}
                </Typography>
              </Box>
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
        );
      })}
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
            {/* Home shows V3 — the current My Account design. */}
            <Route path="/" element={<AccountSettingsV3 />} />
            <Route path="/v1" element={<AccountSettings />} />
            <Route path="/v2" element={<AccountSettingsV2 />} />
            {/* Keep /v3 as an alias so existing links don't break. */}
            <Route path="/v3" element={<Navigate to="/" replace />} />
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
      <Routes>
        {/* Discover renders its own full-page layout (sidebar + content). */}
        <Route path="/discover" element={<DiscoverInstitutions />} />
        {/* Everything else stays inside the Settings shell. */}
        <Route path="/*" element={<Shell />} />
      </Routes>
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
        /* Flat, edge-to-edge item (matches Discover sidebar). Active state
           is shown by a purple left bar + tinted background instead of a
           rounded pill, so no border-radius here. */
        pl: space[3],
        pr: space[3],
        py: space['1.5'],
        borderRadius: 0,
        position: 'relative',
        // WCAG 2.5.8 / design-system §13.2 touch target — 44pt minimum.
        minHeight: (t) => t.spacing(layout.touchTargetUnits),
        color: danger ? 'error.main' : 'text.primary',
        '&:hover': {
          bgcolor: danger
            ? (t) => alpha(t.palette.error.main, 0.06)
            : 'action.hover',
        },
        '&.Mui-selected': {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          color: 'primary.main',
          '&:hover': {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          },
        },
      }}
    >
      {selected && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 18,
            bgcolor: 'primary.main',
            borderRadius: 0.5,
          }}
        />
      )}
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
