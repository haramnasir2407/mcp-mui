import { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { icons } from './theme';

const OCCUPATIONS = ['Physician', 'Nurse', 'Pharmacist', 'Researcher', 'Student', 'Other'];
const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
];
const SUB_SPECIALTIES = [
  'Interventional Cardiology',
  'Pediatric Cardiology',
  'Cosmetic Dermatology',
  'Pediatric Emergency',
  'Geriatrics',
  'Neuro-Oncology',
  'Neonatology',
  'Child Psychiatry',
  'Interventional Radiology',
  'Trauma Surgery',
];
const LABELS = ['Board Member', 'Clinical Lead', 'Researcher', 'Reviewer', 'Editor', 'Mentor'];

type Education = {
  id: number;
  institution: string;
  degree: string;
  year: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  credentials: string;
  defaultEditingRole: string;
  phoneNumber: string;
  role: string;
  npi: string;
  occupation: string;
  primaryPracticeName: string;
  currentTitle: string;
  primaryPracticeAddress: string;
  primaryPracticePhone: string;
  primaryPracticeFax: string;
  specialties: string[];
  subSpecialties: string[];
  labels: string[];
  doximityUrl: string;
  linkedin: string;
  twitter: string;
  website: string;
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
  publicProfile: boolean;
  education: Education[];
};

const initialState: FormState = {
  firstName: 'Hammad',
  lastName: 'Ahmed',
  credentials: '',
  defaultEditingRole: '',
  phoneNumber: '',
  role: 'member',
  npi: '',
  occupation: 'Physician',
  primaryPracticeName: '',
  currentTitle: '',
  primaryPracticeAddress: '',
  primaryPracticePhone: '',
  primaryPracticeFax: '',
  specialties: [],
  subSpecialties: [],
  labels: [],
  doximityUrl: '',
  linkedin: '',
  twitter: '',
  website: '',
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
  publicProfile: true,
  education: [],
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" sx={{ fontWeight: 600, color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}

export default function AccountSettings() {
  const [form, setForm] = useState<FormState>(initialState);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), institution: '', degree: '', year: '' },
      ],
    }));
  };

  const updateEducation = (id: number, patch: Partial<Education>) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const removeEducation = (id: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('submitting', form);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          My Account
        </Typography>
        <IconButton aria-label="close" size="small">
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Identity row */}
      <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 28,
                  height: 28,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                aria-label="edit avatar"
              >
                <EditIcon sx={{ fontSize: icons.sm }} />
              </IconButton>
            }
          >
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'grey.300' }} />
          </Badge>
        </Grid>

        <Grid size={{ xs: 12, md: 'grow' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SectionLabel>First Name*</SectionLabel>
              <TextField
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SectionLabel>Last Name*</SectionLabel>
              <TextField
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SectionLabel>Credentials</SectionLabel>
              <TextField
                placeholder="MD, DO, PhD…"
                value={form.credentials}
                onChange={(e) => update('credentials', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <SectionLabel>Default Editing Role</SectionLabel>
              <TextField
                placeholder="The typical role or your credentials when editing"
                value={form.defaultEditingRole}
                onChange={(e) => update('defaultEditingRole', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionLabel>Phone Number</SectionLabel>
              <TextField
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                <SectionLabel>Role</SectionLabel>
                <Tooltip title="Your team role">
                  <InfoOutlinedIcon sx={{ fontSize: icons.sm, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <TextField
                placeholder="member"
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Professional details */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>NPI</SectionLabel>
          <TextField value={form.npi} onChange={(e) => update('npi', e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Occupation*</SectionLabel>
          <TextField
            select
            required
            value={form.occupation}
            onChange={(e) => update('occupation', e.target.value)}
          >
            {OCCUPATIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Primary Practice Name</SectionLabel>
          <TextField
            value={form.primaryPracticeName}
            onChange={(e) => update('primaryPracticeName', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Current Title/Position</SectionLabel>
          <TextField
            value={form.currentTitle}
            onChange={(e) => update('currentTitle', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Primary Practice Address</SectionLabel>
          <TextField
            value={form.primaryPracticeAddress}
            onChange={(e) => update('primaryPracticeAddress', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Primary Practice Phone Number</SectionLabel>
          <TextField
            placeholder="Primary Practice Phone Number"
            value={form.primaryPracticePhone}
            onChange={(e) => update('primaryPracticePhone', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Primary Practice Fax</SectionLabel>
          <TextField
            value={form.primaryPracticeFax}
            onChange={(e) => update('primaryPracticeFax', e.target.value)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Education */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <SectionLabel>Education</SectionLabel>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addEducation}
          size="small"
        >
          Add Education
        </Button>
      </Stack>

      {form.education.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          No education added yet.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mb: 1 }}>
          {form.education.map((edu) => (
            <Box
              key={edu.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 8, md: 2 }}>
                  <TextField
                    label="Year"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 4, md: 1 }} sx={{ textAlign: 'right' }}>
                  <IconButton
                    aria-label="remove education"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Specialties */}
      <Grid container spacing={3}>
        <Grid size={12}>
          <SectionLabel>Specialties</SectionLabel>
          <Autocomplete
            multiple
            options={SPECIALTIES}
            value={form.specialties}
            onChange={(_, v) => update('specialties', v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option} size="small" {...tagProps} />;
              })
            }
            renderInput={(params) => <TextField {...params} placeholder="Select specialties" />}
          />
        </Grid>

        <Grid size={12}>
          <SectionLabel>Sub Specialties</SectionLabel>
          <Autocomplete
            multiple
            options={SUB_SPECIALTIES}
            value={form.subSpecialties}
            onChange={(_, v) => update('subSpecialties', v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option} size="small" {...tagProps} />;
              })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select sub specialties" />
            )}
          />
        </Grid>

        <Grid size={12}>
          <SectionLabel>Labels</SectionLabel>
          <Autocomplete
            multiple
            options={LABELS}
            value={form.labels}
            onChange={(_, v) => update('labels', v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option} size="small" {...tagProps} />;
              })
            }
            renderInput={(params) => <TextField {...params} placeholder="Select labels" />}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Social / external links */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Doximity URL</SectionLabel>
          <TextField
            value={form.doximityUrl}
            onChange={(e) => update('doximityUrl', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>LinkedIn</SectionLabel>
          <TextField
            placeholder="https://www.linkedin.com/in/"
            value={form.linkedin}
            onChange={(e) => update('linkedin', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>X (Previously Twitter)</SectionLabel>
          <TextField
            placeholder="https://www.x.com/"
            value={form.twitter}
            onChange={(e) => update('twitter', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Website</SectionLabel>
          <TextField value={form.website} onChange={(e) => update('website', e.target.value)} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Password */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Update Password
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          <SectionLabel>Current Password</SectionLabel>
          <TextField
            type={showCurrentPw ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={(e) => update('currentPassword', e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => setShowCurrentPw((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Password</SectionLabel>
          <TextField
            type={showNewPw ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNewPw((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showNewPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel>Password Confirmation</SectionLabel>
          <TextField
            type={showConfirmPw ? 'text' : 'password'}
            value={form.passwordConfirmation}
            onChange={(e) => update('passwordConfirmation', e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.publicProfile}
              onChange={(e) => update('publicProfile', e.target.checked)}
            />
          }
          label="Allow my profile to be displayed publicly (name, profile image, occupation, institutions, public content)"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" size="large">
          Update
        </Button>
      </Box>
    </Paper>
  );
}
