import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { palette, space } from './theme';

/* ------------------------------------------------------------------ */
/*  Types + seed data                                                 */
/* ------------------------------------------------------------------ */

type AvatarTint = 'brand' | 'neutral';

type Institution = {
  name: string;
  initial: string;
  tint: AvatarTint;
};

/* Pattern mirrors the Figma row striping (brand / neutral alternating). */
const INSTITUTIONS: Institution[] = [
  { name: 'Advocate Doctors', initial: 'A', tint: 'brand' },
  { name: 'AllianceChicago', initial: 'A', tint: 'neutral' },
  { name: 'American Academy of Pediatrics', initial: 'P', tint: 'brand' },
  { name: 'Bassett Healthcare Network', initial: 'B', tint: 'neutral' },
  { name: 'BPCATCH', initial: 'B', tint: 'neutral' },
  { name: 'Canadian Blood Services', initial: 'C', tint: 'brand' },
  { name: 'Carle Health', initial: 'C', tint: 'neutral' },
  { name: "Children's Hospital Colorado", initial: 'C', tint: 'brand' },
  { name: 'Cleveland Clinic', initial: 'C', tint: 'neutral' },
  { name: 'Curbside Health', initial: 'C', tint: 'brand' },
  { name: 'Duke Health', initial: 'D', tint: 'neutral' },
  { name: 'Emory Healthcare', initial: 'E', tint: 'brand' },
];

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { id: 'all', label: 'All Institutions' },
  { id: 'verified', label: 'Verified' },
  { id: 'mine', label: 'My Institutions' },
];

const SIDEBAR_WIDTH = 260;

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function DiscoverInstitutions() {
  const [selected, setSelected] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = INSTITUTIONS.filter((i) =>
    i.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        bgcolor: palette.neutral[800],
      }}
    >
      {/* ---------------- Sidebar ------------------------------------ */}
      <Box
        component="nav"
        aria-label="Discover"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: 'background.default',
          borderRight: 1,
          borderColor: 'divider',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          pt: space[3],
        }}
      >
        <Box sx={{ pl: space[3], pr: space[3], pt: space['1.5'], pb: space['1.5'] }}>
          <Typography variant="overline" sx={{ color: palette.neutral[300] }}>
            Discover
          </Typography>
        </Box>

        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === selected;
            return (
              <ListItemButton
                key={item.id}
                selected={isActive}
                onClick={() => setSelected(item.id)}
                sx={{
                  pl: space[3],
                  pr: space[3],
                  py: space['1.5'],
                  minHeight: 40,
                  borderRadius: 0,
                  position: 'relative',
                  '&.Mui-selected': {
                    bgcolor: alpha(palette.purple[500], 0.08),
                    '&:hover': { bgcolor: alpha(palette.purple[500], 0.12) },
                  },
                }}
              >
                {isActive && (
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
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body1',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* ---------------- Content ------------------------------------ */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: space[3], md: space[6] },
            py: { xs: space[3], md: space[5] },
          }}
        >
          <Stack spacing={space[3]}>
            {/* Header */}
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Discover Institutions
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.neutral[300], mt: space['0.5'] }}
              >
                Find and join institutions on Curbside Health.
              </Typography>
            </Box>

            {/* Search */}
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search institutions…"
              fullWidth
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: palette.neutral[300], fontSize: 18 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  fontSize: 14,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: palette.neutral[500],
                  },
                },
              }}
            />

            {/* Grid */}
            <Grid container spacing={space[3]}>
              {filtered.map((institution) => (
                <Grid
                  key={institution.name}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <InstitutionCard institution={institution} />
                </Grid>
              ))}
            </Grid>

            {filtered.length === 0 && (
              <Box
                sx={{
                  py: space[6],
                  textAlign: 'center',
                  color: palette.neutral[300],
                }}
              >
                <Typography variant="body1">
                  No institutions match “{query}”.
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */

function InstitutionCard({ institution }: { institution: Institution }) {
  const brand = institution.tint === 'brand';

  return (
    <Card
      variant="outlined"
      sx={{
        height: 252,
        borderRadius: 2,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 112,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: brand ? palette.purple[900] : palette.neutral[700],
            color: brand ? 'primary.main' : palette.neutral[300],
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {institution.initial}
        </Avatar>
      </Box>

      <Divider />

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: space[2],
          '&:last-child': { pb: space[2] },
        }}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: 15,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {institution.name}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            height: 44,
            borderRadius: 1.5,
            borderWidth: 1.5,
            fontWeight: 600,
            '&:hover': { borderWidth: 1.5 },
          }}
        >
          Request to Join
        </Button>
      </CardContent>
    </Card>
  );
}
