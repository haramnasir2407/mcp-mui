import { useCallback, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { palette, icons, layout, space } from './theme';

/* ------------------------------------------------------------------ */
/*  Types + seed data                                                 */
/* ------------------------------------------------------------------ */

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
  firstName: 'Mehreen',
  lastName: 'Asif',
  credentials: '',
  defaultEditingRole: '',
  phoneNumber: '',
  role: 'member',
  npi: '',
  occupation: 'Other',
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

const OCCUPATIONS = ['Physician', 'Nurse', 'Pharmacist', 'Researcher', 'Student', 'Other'];
const ROLES = ['member', 'admin', 'owner', 'viewer'];
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

type Errors = Partial<Record<keyof FormState, string>>;

const URL_REGEX = /^https?:\/\/[^\s]+$/i;

/* ------------------------------------------------------------------ */
/*  Shared styles — theme-token driven                                */
/* ------------------------------------------------------------------ */

/* Float-label look: label above, border darkens on focus. Typography sizes
   resolve from theme variants (body1 = 14px, body2 = 12px per design-system §8.1). */
const textFieldSx = (t: Theme): SystemStyleObject<Theme> => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: t.palette.background.default,
    borderRadius: 1,
    fontSize: t.typography.body1.fontSize,
    '& fieldset': { borderColor: t.palette.divider },
    '&:hover fieldset': { borderColor: t.palette.text.primary },
    '&.Mui-focused fieldset': {
      borderColor: t.palette.primary.main,
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    paddingTop: t.spacing(1.75),
    paddingBottom: t.spacing(1.75),
    paddingLeft: t.spacing(space[2]),
    paddingRight: t.spacing(space[2]),
    color: t.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: t.palette.text.secondary,
    fontSize: t.typography.body1.fontSize,
    '&.MuiInputLabel-shrink': { fontSize: t.typography.body2.fontSize },
    '&.Mui-focused': { color: t.palette.primary.main },
  },
  '& .MuiFormHelperText-root': {
    color: t.palette.text.secondary,
    fontSize: t.typography.body2.fontSize,
    marginLeft: t.spacing(space[2]),
    marginTop: t.spacing(0.25),
  },
});

/* Pill-shaped actions used in the footer and avatar row.
   Height pulls from spacing (40 = space-5 per design-system §4.1). */
const pillButtonSx = (t: Theme): SystemStyleObject<Theme> => ({
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: t.typography.body1.fontSize,
  minHeight: t.spacing(space[5]),
  px: space[3],
  py: 1.25,
});

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export default function AccountSettingsV3() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: '' });
  const [pwVis, setPwVis] = useState({ current: false, next: false, confirm: false });

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validateAll = (): Errors => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.occupation) e.occupation = 'Occupation is required.';

    const urlErr = (v: string) =>
      v && !URL_REGEX.test(v) ? 'Must start with http:// or https://' : '';
    const linkedinE = urlErr(form.linkedin);
    const twitterE = urlErr(form.twitter);
    const websiteE = urlErr(form.website);
    const doximityE = urlErr(form.doximityUrl);
    if (linkedinE) e.linkedin = linkedinE;
    if (twitterE) e.twitter = twitterE;
    if (websiteE) e.website = websiteE;
    if (doximityE) e.doximityUrl = doximityE;

    if (form.password || form.passwordConfirmation) {
      if (!form.currentPassword)
        e.currentPassword = 'Enter your current password to change it.';
      if (form.password.length > 0 && form.password.length < 8) {
        e.password = 'Use at least 8 characters.';
      }
      if (form.password !== form.passwordConfirmation) {
        e.passwordConfirmation = 'Passwords do not match.';
      }
    }
    return e;
  };

  const handleSave = async () => {
    const e = validateAll();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setToast({ open: true, msg: 'Please fix the highlighted fields.' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setToast({ open: true, msg: 'Account settings saved' });
  };

  const handleCancel = () => {
    setForm(initialState);
    setErrors({});
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <Box
      sx={{
        // Section container background per design-system §3.5 (bg.secondary).
        bgcolor: 'background.paper',
        mx: { xs: -space[3], md: -space[5] },
        my: { xs: -space[3], md: -space[5] },
        minHeight: '100%',
      }}
    >
      <Box sx={{ px: { xs: space[3], md: space[6] }, py: { xs: space[3], md: space[4] } }}>
        {saving && (
          <LinearProgress
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: (t) => t.zIndex.appBar,
              borderRadius: 1,
              mb: space[2],
            }}
          />
        )}

        <Stack spacing={space[3]}>
          {/* Page header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                My Account
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mt: space['0.5'] }}
              >
                Manage your profile, practice details, and account preferences.
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              sx={{
                bgcolor: palette.neutral[700],
                width: (t) => t.spacing(space[5]),
                height: (t) => t.spacing(space[5]),
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <CloseIcon sx={{ fontSize: icons.sm }} />
            </IconButton>
          </Stack>

          {errorCount > 0 && (
            <Alert severity="error" variant="outlined" role="alert" sx={{ borderRadius: 2 }}>
              {errorCount === 1
                ? '1 field needs your attention.'
                : `${errorCount} fields need your attention.`}
            </Alert>
          )}

          <SectionCard
            title="Profile Information"
            description="Update your personal details and photo."
          >
            <ProfileSection form={form} errors={errors} update={update} />
          </SectionCard>

          <SectionCard
            title="Practice Information"
            description="Details about your primary medical practice."
          >
            <PracticeSection form={form} update={update} />
          </SectionCard>

          <SectionCard
            title="Professional Details"
            description="Specialties, education, and professional labels."
          >
            <ProfessionalDetailsSection form={form} update={update} />
          </SectionCard>

          <SectionCard
            title="Social & Web Links"
            description="Public profile URLs and professional networks."
          >
            <SocialLinksSection form={form} errors={errors} update={update} />
          </SectionCard>

          <SectionCard
            title="Update Password"
            description="Ensure your account is using a strong, unique password."
          >
            <PasswordSection
              form={form}
              errors={errors}
              update={update}
              pwVis={pwVis}
              setPwVis={setPwVis}
            />
          </SectionCard>

          <SectionCard title="Privacy" description="Control how your profile appears to others.">
            <PrivacySection form={form} update={update} />
          </SectionCard>

          {/* Footer actions */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={space['1.5']}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={[
                pillButtonSx,
                {
                  borderColor: 'divider',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                  },
                },
              ]}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={icons.sm} color="inherit" /> : null}
              sx={[pillButtonSx, { px: space[4], py: space['1.5'] }]}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, msg: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={errorCount > 0 ? 'error' : 'success'}
          variant="filled"
          onClose={() => setToast({ open: false, msg: '' })}
          sx={{ borderRadius: 2 }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  SectionCard wrapper                                               */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: space[3], '&:last-child': { pb: space[3] } }}>
        <Stack spacing={space['2.5']}>
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{ color: 'text.primary' }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mt: space['0.5'] }}
            >
              {description}
            </Typography>
          </Box>
          <Divider />
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile section                                                   */
/* ------------------------------------------------------------------ */

function ProfileSection({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: Errors;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Stack spacing={space[2]}>
      {/* Avatar + upload actions */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={space['2.5']}
        alignItems={{ sm: 'center' }}
      >
        <Avatar
          sx={(t) => ({
            width: t.spacing(layout.avatarLgUnits),
            height: t.spacing(layout.avatarLgUnits),
            bgcolor: alpha(t.palette.primary.main, 0.1),
            color: t.palette.primary.main,
            fontSize: t.typography.h2.fontSize,
            fontWeight: 600,
          })}
        >
          {form.firstName[0]}
          {form.lastName[0]}
        </Avatar>
        <Stack spacing={space[1]}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Upload a new profile photo
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            JPG or PNG. Max 2MB.
          </Typography>
          <Stack direction="row" spacing={space['1.5']}>
            <Button
              variant="outlined"
              size="small"
              sx={[
                pillButtonSx,
                (t) => ({
                  minHeight: t.spacing(4.5),
                  borderColor: 'divider',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: alpha(t.palette.primary.main, 0.04),
                  },
                }),
              ]}
            >
              Upload Photo
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={[
                pillButtonSx,
                (t) => ({
                  minHeight: t.spacing(4.5),
                  borderColor: 'divider',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: alpha(t.palette.primary.main, 0.04),
                  },
                }),
              ]}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Row 1 */}
      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="First Name"
            required
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            autoComplete="given-name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Last Name"
            required
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            autoComplete="family-name"
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Credentials"
            value={form.credentials}
            onChange={(e) => update('credentials', e.target.value)}
            helperText="e.g. MD, DO, PhD"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Row 2 */}
      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Default Editing Role"
            value={form.defaultEditingRole}
            onChange={(e) => update('defaultEditingRole', e.target.value)}
            helperText="Shown when you edit content"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Phone Number"
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
            autoComplete="tel"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Row 3 */}
      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            helperText="Assigned by your organization"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="NPI"
            value={form.npi}
            onChange={(e) => update('npi', e.target.value)}
            inputProps={{ inputMode: 'numeric', maxLength: 10 }}
            helperText="10-digit National Provider Identifier"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            label="Occupation"
            required
            value={form.occupation}
            onChange={(e) => update('occupation', e.target.value)}
            error={Boolean(errors.occupation)}
            helperText={errors.occupation}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          >
            {OCCUPATIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Practice section                                                  */
/* ------------------------------------------------------------------ */

function PracticeSection({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Stack spacing={space[2]}>
      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Primary Practice Name"
            value={form.primaryPracticeName}
            onChange={(e) => update('primaryPracticeName', e.target.value)}
            autoComplete="organization"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Current Title / Position"
            value={form.currentTitle}
            onChange={(e) => update('currentTitle', e.target.value)}
            autoComplete="organization-title"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Primary Practice Address"
            value={form.primaryPracticeAddress}
            onChange={(e) => update('primaryPracticeAddress', e.target.value)}
            autoComplete="street-address"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Primary Practice Phone"
            type="tel"
            value={form.primaryPracticePhone}
            onChange={(e) => update('primaryPracticePhone', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
      </Grid>
      <TextField
        label="Primary Practice Fax"
        type="tel"
        value={form.primaryPracticeFax}
        onChange={(e) => update('primaryPracticeFax', e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={textFieldSx}
        fullWidth
      />
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Professional Details section                                      */
/* ------------------------------------------------------------------ */

function ProfessionalDetailsSection({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const add = () => {
    update('education', [
      ...form.education,
      { id: Date.now(), institution: '', degree: '', year: '' },
    ]);
  };
  const remove = (id: number) => {
    update(
      'education',
      form.education.filter((e) => e.id !== id),
    );
  };
  const patch = (id: number, key: keyof Education, value: string) => {
    update(
      'education',
      form.education.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    );
  };

  return (
    <Stack spacing={space[2]}>
      {/* Education header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Education
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {form.education.length === 0
              ? 'No education entries added yet.'
              : `${form.education.length} ${form.education.length === 1 ? 'entry' : 'entries'}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={add}
          sx={pillButtonSx}
        >
          Add Education
        </Button>
      </Stack>

      {form.education.length > 0 && (
        <Stack spacing={space['1.5']}>
          {form.education.map((edu) => (
            <Card key={edu.id} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: space[2], '&:last-child': { pb: space[2] } }}>
                <Grid container spacing={space['1.5']} alignItems="flex-start">
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => patch(edu.id, 'institution', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldSx}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => patch(edu.id, 'degree', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldSx}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 8, sm: 2 }}>
                    <TextField
                      label="Year"
                      value={edu.year}
                      onChange={(e) => patch(edu.id, 'year', e.target.value)}
                      inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldSx}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 4, sm: 1 }} sx={{ textAlign: 'right', pt: space[1] }}>
                    <IconButton
                      onClick={() => remove(edu.id)}
                      aria-label={`Remove education: ${edu.institution || 'entry'}`}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {form.education.length === 0 && (
        <Box
          sx={{
            py: space[3],
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <SchoolOutlinedIcon sx={{ fontSize: icons.xl, color: 'text.secondary', mb: space['0.5'] }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Add your first degree, residency, or training entry.
          </Typography>
        </Box>
      )}

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
        renderInput={(params) => (
          <TextField
            {...params}
            label="Specialties"
            helperText="Choose your primary specialty"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          />
        )}
      />

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
          <TextField
            {...params}
            label="Sub Specialties"
            helperText="Optional"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          />
        )}
      />

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
        renderInput={(params) => (
          <TextField
            {...params}
            label="Labels"
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          />
        )}
      />
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Social & Web Links section                                        */
/* ------------------------------------------------------------------ */

function SocialLinksSection({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: Errors;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Stack spacing={space[2]}>
      <TextField
        label="Doximity URL"
        type="url"
        value={form.doximityUrl}
        onChange={(e) => update('doximityUrl', e.target.value)}
        error={Boolean(errors.doximityUrl)}
        helperText={errors.doximityUrl}
        InputLabelProps={{ shrink: true }}
        sx={textFieldSx}
        fullWidth
      />
      <TextField
        label="LinkedIn"
        type="url"
        value={form.linkedin}
        onChange={(e) => update('linkedin', e.target.value)}
        error={Boolean(errors.linkedin)}
        helperText={errors.linkedin}
        InputLabelProps={{ shrink: true }}
        sx={textFieldSx}
        fullWidth
      />
      <TextField
        label="X (Previously Twitter)"
        type="url"
        value={form.twitter}
        onChange={(e) => update('twitter', e.target.value)}
        error={Boolean(errors.twitter)}
        helperText={errors.twitter}
        InputLabelProps={{ shrink: true }}
        sx={textFieldSx}
        fullWidth
      />
      <TextField
        label="Website"
        type="url"
        value={form.website}
        onChange={(e) => update('website', e.target.value)}
        error={Boolean(errors.website)}
        helperText={errors.website}
        InputLabelProps={{ shrink: true }}
        sx={textFieldSx}
        fullWidth
      />
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Password section                                                  */
/* ------------------------------------------------------------------ */

function PasswordSection({
  form,
  errors,
  update,
  pwVis,
  setPwVis,
}: {
  form: FormState;
  errors: Errors;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  pwVis: { current: boolean; next: boolean; confirm: boolean };
  setPwVis: React.Dispatch<
    React.SetStateAction<{ current: boolean; next: boolean; confirm: boolean }>
  >;
}) {
  const pwAdornment = (
    which: keyof typeof pwVis,
    visible: boolean,
  ): React.ReactNode => (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => setPwVis((p) => ({ ...p, [which]: !p[which] }))}
        aria-label={visible ? 'Hide password' : 'Show password'}
        edge="end"
      >
        {visible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Stack spacing={space[2]}>
      <TextField
        label="Current Password"
        type={pwVis.current ? 'text' : 'password'}
        value={form.currentPassword}
        onChange={(e) => update('currentPassword', e.target.value)}
        autoComplete="current-password"
        error={Boolean(errors.currentPassword)}
        helperText={errors.currentPassword}
        InputLabelProps={{ shrink: true }}
        slotProps={{
          input: { endAdornment: pwAdornment('current', pwVis.current) },
        }}
        sx={textFieldSx}
        fullWidth
      />

      <Grid container spacing={space[2]}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="New Password"
            type={pwVis.next ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: { endAdornment: pwAdornment('next', pwVis.next) },
            }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Confirm New Password"
            type={pwVis.confirm ? 'text' : 'password'}
            value={form.passwordConfirmation}
            onChange={(e) => update('passwordConfirmation', e.target.value)}
            autoComplete="new-password"
            error={Boolean(errors.passwordConfirmation)}
            helperText={errors.passwordConfirmation}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: { endAdornment: pwAdornment('confirm', pwVis.confirm) },
            }}
            sx={textFieldSx}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Info callout — uses info-tint token from extended palette */}
      <Stack
        direction="row"
        spacing={space['1.5']}
        alignItems="flex-start"
        sx={{
          bgcolor: palette.status.infoTint,
          borderRadius: 2,
          p: space[2],
        }}
      >
        <InfoOutlinedIcon sx={{ color: 'info.main', fontSize: icons.md, mt: 0.25 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Password requirements
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            At least 8 characters · One uppercase letter · One number or special character
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Privacy section                                                   */
/* ------------------------------------------------------------------ */

function PrivacySection({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={form.publicProfile}
          onChange={(e) => update('publicProfile', e.target.checked)}
        />
      }
      label={
        <Box>
          <Typography variant="body1" sx={{ color: 'text.primary' }}>
            Allow my profile to be displayed publicly
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Name, profile image, occupation, institutions, and public content will be visible.
          </Typography>
        </Box>
      }
      sx={{ alignItems: 'flex-start', m: 0 }}
    />
  );
}
