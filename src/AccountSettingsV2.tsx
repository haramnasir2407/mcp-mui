import { useCallback, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { icons } from './theme';

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

type Errors = Partial<Record<keyof FormState, string>>;

const URL_REGEX = /^https?:\/\/[^\s]+$/i;

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export default function AccountSettingsV2() {
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

    const urlErr = (v: string) => (v && !URL_REGEX.test(v) ? 'Must start with http:// or https://' : '');
    const linkedinE = urlErr(form.linkedin);
    const twitterE = urlErr(form.twitter);
    const websiteE = urlErr(form.website);
    const doximityE = urlErr(form.doximityUrl);
    if (linkedinE) e.linkedin = linkedinE;
    if (twitterE) e.twitter = twitterE;
    if (websiteE) e.website = websiteE;
    if (doximityE) e.doximityUrl = doximityE;

    if (form.password || form.passwordConfirmation) {
      if (!form.currentPassword) e.currentPassword = 'Enter your current password to change it.';
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

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <Stack spacing={3}>
      {saving && (
        <LinearProgress
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
            borderRadius: 1,
          }}
        />
      )}

      {/* Page header */}
      <Box>
        <Typography variant="h5" component="h1" fontWeight={700}>
          My Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your profile, credentials, and how others see you on the platform.
        </Typography>
      </Box>

      {errorCount > 0 && (
        <Alert severity="error" variant="outlined" role="alert">
          {errorCount === 1
            ? '1 field needs your attention.'
            : `${errorCount} fields need your attention.`}
        </Alert>
      )}

      {/* Section cards */}
      <SectionCard
        title="Profile"
        description="Your public identity and how others reach you."
      >
        <ProfileSection form={form} errors={errors} update={update} />
      </SectionCard>

      <SectionCard
        title="Professional"
        description="Credentials the platform uses to verify your identity."
      >
        <ProfessionalSection form={form} errors={errors} update={update} />
      </SectionCard>

      <SectionCard
        title="Practice"
        description="Where patients or collaborators can reach your practice."
      >
        <PracticeSection form={form} update={update} />
      </SectionCard>

      <SectionCard
        title="Education"
        description="Degrees, residencies, and training."
      >
        <EducationSection form={form} update={update} />
      </SectionCard>

      <SectionCard
        title="Specialties"
        description="Taxonomy that powers discovery and review routing."
      >
        <SpecialtiesSection form={form} update={update} />
      </SectionCard>

      <SectionCard
        title="Links"
        description="External profiles shown on your public page."
      >
        <LinksSection form={form} errors={errors} update={update} />
      </SectionCard>

      <SectionCard
        title="Security"
        description="Password and profile visibility."
      >
        <SecuritySection
          form={form}
          errors={errors}
          update={update}
          pwVis={pwVis}
          setPwVis={setPwVis}
        />
      </SectionCard>

      {/* Footer actions */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="flex-end"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setForm(initialState);
                setErrors({});
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={icons.sm} color="inherit" /> : <CheckCircleOutlineIcon />
              }
            >
              Save changes
            </Button>
          </Stack>
        </CardContent>
      </Card>

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
    </Stack>
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
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" component="h2" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Field                                                    */
/* ------------------------------------------------------------------ */

type FieldProps = {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, helper, error, required, children }: FieldProps) {
  return (
    <Box>
      <Typography
        component="label"
        variant="body2"
        sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }} aria-hidden>
            *
          </Box>
        )}
      </Typography>
      {children}
      {(helper || error) && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: error ? 'error.main' : 'text.secondary',
          }}
          role={error ? 'alert' : undefined}
        >
          {error ?? helper}
        </Typography>
      )}
    </Box>
  );
}

/* ----- Profile section ----- */
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
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 'auto' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Change photo">
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                aria-label="Change profile photo"
              >
                <EditIcon sx={{ fontSize: icons.sm }} />
              </IconButton>
            </Tooltip>
          }
        >
          <Avatar
            sx={(t) => ({
              width: t.spacing(12),
              height: t.spacing(12),
              bgcolor: 'grey.300',
              fontSize: t.typography.h2.fontSize,
            })}
          >
            {form.firstName[0]}
            {form.lastName[0]}
          </Avatar>
        </Badge>
      </Grid>

      <Grid size={{ xs: 12, md: 'grow' }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="First name" required error={errors.firstName}>
              <TextField
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                autoComplete="given-name"
                error={Boolean(errors.firstName)}
                required
              />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Last name" required error={errors.lastName}>
              <TextField
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                autoComplete="family-name"
                error={Boolean(errors.lastName)}
                required
              />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Credentials" helper="Shown after your name (e.g. MD, PhD).">
              <TextField
                value={form.credentials}
                onChange={(e) => update('credentials', e.target.value)}
                placeholder="MD, DO, PhD…"
              />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Role" helper="Your permission level on the team.">
              <TextField
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                placeholder="member"
              />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Default editing role" helper="Pre-filled when you edit content.">
              <TextField
                value={form.defaultEditingRole}
                onChange={(e) => update('defaultEditingRole', e.target.value)}
              />
            </Field>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Phone number">
              <TextField
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
              />
            </Field>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/* ----- Professional section ----- */
function ProfessionalSection({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: Errors;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="NPI" helper="10-digit National Provider Identifier.">
          <TextField
            value={form.npi}
            onChange={(e) => update('npi', e.target.value)}
            inputProps={{ inputMode: 'numeric', maxLength: 10 }}
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Occupation" required error={errors.occupation}>
          <TextField
            select
            value={form.occupation}
            onChange={(e) => update('occupation', e.target.value)}
            error={Boolean(errors.occupation)}
            required
          >
            {OCCUPATIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      </Grid>
    </Grid>
  );
}

/* ----- Practice section ----- */
function PracticeSection({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Primary practice name">
          <TextField
            value={form.primaryPracticeName}
            onChange={(e) => update('primaryPracticeName', e.target.value)}
            autoComplete="organization"
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Current title / position">
          <TextField
            value={form.currentTitle}
            onChange={(e) => update('currentTitle', e.target.value)}
            autoComplete="organization-title"
          />
        </Field>
      </Grid>
      <Grid size={12}>
        <Field label="Primary practice address">
          <TextField
            value={form.primaryPracticeAddress}
            onChange={(e) => update('primaryPracticeAddress', e.target.value)}
            autoComplete="street-address"
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Primary practice phone">
          <TextField
            type="tel"
            value={form.primaryPracticePhone}
            onChange={(e) => update('primaryPracticePhone', e.target.value)}
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Primary practice fax">
          <TextField
            type="tel"
            value={form.primaryPracticeFax}
            onChange={(e) => update('primaryPracticeFax', e.target.value)}
          />
        </Field>
      </Grid>
    </Grid>
  );
}

/* ----- Education section ----- */
function EducationSection({
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
    <Stack spacing={2}>
      {form.education.length === 0 ? (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <SchoolOutlinedIcon sx={{ fontSize: icons.xl, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No education entries yet.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={add}>
            Add education
          </Button>
        </Box>
      ) : (
        <>
          {form.education.map((edu) => (
            <Card key={edu.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="end">
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Field label="Institution">
                      <TextField
                        value={edu.institution}
                        onChange={(e) => patch(edu.id, 'institution', e.target.value)}
                      />
                    </Field>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Field label="Degree">
                      <TextField
                        value={edu.degree}
                        onChange={(e) => patch(edu.id, 'degree', e.target.value)}
                      />
                    </Field>
                  </Grid>
                  <Grid size={{ xs: 8, sm: 2 }}>
                    <Field label="Year">
                      <TextField
                        value={edu.year}
                        onChange={(e) => patch(edu.id, 'year', e.target.value)}
                        inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                      />
                    </Field>
                  </Grid>
                  <Grid size={{ xs: 4, sm: 1 }} sx={{ textAlign: 'right' }}>
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
          <Box>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={add}>
              Add another
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
}

/* ----- Specialties section ----- */
function SpecialtiesSection({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Stack spacing={2.5}>
      <Field label="Specialties" helper="Pick one or more. Drives discovery on the platform.">
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
          renderInput={(params) => <TextField {...params} placeholder="Search specialties…" />}
        />
      </Field>

      <Field label="Sub specialties">
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
            <TextField {...params} placeholder="Search sub specialties…" />
          )}
        />
      </Field>

      <Field label="Labels" helper="Internal labels visible to your team admins.">
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
          renderInput={(params) => <TextField {...params} placeholder="Pick labels…" />}
        />
      </Field>
    </Stack>
  );
}

/* ----- Links section ----- */
function LinksSection({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: Errors;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Doximity URL" error={errors.doximityUrl}>
          <TextField
            type="url"
            value={form.doximityUrl}
            onChange={(e) => update('doximityUrl', e.target.value)}
            error={Boolean(errors.doximityUrl)}
            placeholder="https://"
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="LinkedIn" error={errors.linkedin}>
          <TextField
            type="url"
            value={form.linkedin}
            onChange={(e) => update('linkedin', e.target.value)}
            error={Boolean(errors.linkedin)}
            placeholder="https://www.linkedin.com/in/"
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="X (Twitter)" error={errors.twitter}>
          <TextField
            type="url"
            value={form.twitter}
            onChange={(e) => update('twitter', e.target.value)}
            error={Boolean(errors.twitter)}
            placeholder="https://www.x.com/"
          />
        </Field>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field label="Website" error={errors.website}>
          <TextField
            type="url"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            error={Boolean(errors.website)}
            placeholder="https://"
          />
        </Field>
      </Grid>
    </Grid>
  );
}

/* ----- Security section ----- */
function SecuritySection({
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
  const strength = passwordStrength(form.password);

  return (
    <Stack spacing={3}>
      <Field label="Current password" error={errors.currentPassword}>
        <TextField
          type={pwVis.current ? 'text' : 'password'}
          value={form.currentPassword}
          onChange={(e) => update('currentPassword', e.target.value)}
          autoComplete="current-password"
          error={Boolean(errors.currentPassword)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setPwVis((p) => ({ ...p, current: !p.current }))}
                    aria-label={pwVis.current ? 'Hide password' : 'Show password'}
                    edge="end"
                  >
                    {pwVis.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Field>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="New password"
            error={errors.password}
            helper="At least 8 characters. Mix letters, numbers, and symbols."
          >
            <TextField
              type={pwVis.next ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
              error={Boolean(errors.password)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setPwVis((p) => ({ ...p, next: !p.next }))}
                        aria-label={pwVis.next ? 'Hide password' : 'Show password'}
                        edge="end"
                      >
                        {pwVis.next ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Field>
          {form.password && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength.score * 25}
                color={strength.color}
                sx={{ height: 6, borderRadius: 3 }}
                aria-label="Password strength"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {strength.label}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Confirm new password" error={errors.passwordConfirmation}>
            <TextField
              type={pwVis.confirm ? 'text' : 'password'}
              value={form.passwordConfirmation}
              onChange={(e) => update('passwordConfirmation', e.target.value)}
              autoComplete="new-password"
              error={Boolean(errors.passwordConfirmation)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setPwVis((p) => ({ ...p, confirm: !p.confirm }))}
                        aria-label={pwVis.confirm ? 'Hide password' : 'Show password'}
                        edge="end"
                      >
                        {pwVis.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Field>
        </Grid>
      </Grid>

      <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Visibility
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.publicProfile}
              onChange={(e) => update('publicProfile', e.target.checked)}
            />
          }
          label={
            <Box>
              <Typography variant="body2">Display my profile publicly</Typography>
              <Typography variant="caption" color="text.secondary">
                Name, profile image, occupation, institutions, and public content will be shown.
              </Typography>
            </Box>
          }
          sx={{ alignItems: 'flex-start', m: 0 }}
        />
      </Box>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Password strength heuristic                                       */
/* ------------------------------------------------------------------ */

function passwordStrength(pw: string): {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
} {
  if (!pw) return { score: 0, label: '', color: 'error' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^\w\s]/.test(pw)) score++;
  const map: Record<number, { label: string; color: 'error' | 'warning' | 'info' | 'success' }> = {
    0: { label: 'Very weak', color: 'error' },
    1: { label: 'Weak', color: 'error' },
    2: { label: 'Fair', color: 'warning' },
    3: { label: 'Good', color: 'info' },
    4: { label: 'Strong', color: 'success' },
  };
  return { score, ...map[score] };
}
