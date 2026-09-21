import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid'; // Make sure to import Grid2 in newer MUI versions, or keep it Grid but use 'size'
import { customerApi, type ProfileResponse } from '../../../api/customer.api';
import { getApiErrorMessage } from '../../../api/client';
import { LABOUR_THEME } from '../../../utils/labour.constants';
import { VALIDATION } from '../../../utils/constants';
import { formatPhoneNumber, sanitizeFullName, validateFullName, validatePhoneNumber } from '../../../utils/validation';

interface ProfileErrors {
    name?: string;
    phone?: string;
    address?: string;
}

export const EditProfile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<ProfileErrors>({});

    useEffect(() => {
        customerApi.getProfile().then((response) => {
            setProfile(response.data);
            setName(response.data.name ?? '');
            setPhone(response.data.phone_number ?? '');
            setAddress([response.data.address?.colony, response.data.address?.city, response.data.address?.state].filter(Boolean).join(', '));
        }).catch((error) => setMessage(getApiErrorMessage(error, 'Unable to load profile')));
    }, []);

    const handleSave = async () => {
        const nextErrors: ProfileErrors = {};
        const nameError = validateFullName(name);
        const phoneError = validatePhoneNumber(phone);
        if (nameError) nextErrors.name = nameError;
        if (phoneError) nextErrors.phone = phoneError;
        if (!address.trim()) nextErrors.address = 'Address is required';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSaving(true);
        setMessage('');
        try {
            const response = await customerApi.updateProfile({ name: name.trim(), phone_number: phone.trim(), addressText: address.trim() });
            setProfile(response.data);
            setMessage('Profile updated successfully.');
        } catch (error) {
            setMessage(getApiErrorMessage(error, 'Unable to update profile'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ maxWidth: '800px' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text, mb: 3 }}>My Profile</Typography>

            <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: '16px' }} elevation={0} variant="outlined">
                <Grid container spacing={3}>
                    {/* NON-EDITABLE FIELDS */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Full Name" fullWidth value={name} onChange={(event) => { setName(sanitizeFullName(event.target.value)); setErrors((current) => ({ ...current, name: undefined })); }} error={Boolean(errors.name)} helperText={errors.name} slotProps={{ htmlInput: { maxLength: VALIDATION.NAME_MAX_LENGTH } }} disabled={!profile || saving} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Username / Email" fullWidth value={profile ? `${profile.username} / ${profile.email}` : ''} disabled />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Date of Birth" fullWidth value={profile?.dob ?? ''} disabled />
                    </Grid>

                    {/* EDITABLE FIELDS */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Phone Number" fullWidth value={phone} onChange={(event) => { setPhone(formatPhoneNumber(event.target.value)); setErrors((current) => ({ ...current, phone: undefined })); }} error={Boolean(errors.phone)} helperText={errors.phone} type="tel" inputMode="numeric" slotProps={{ htmlInput: { maxLength: 13 } }} disabled={!profile || saving} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField label="Current Address" fullWidth multiline rows={3} value={address} onChange={(event) => { setAddress(event.target.value); setErrors((current) => ({ ...current, address: undefined })); }} error={Boolean(errors.address)} helperText={errors.address} disabled={!profile || saving} />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="success" size="large" onClick={() => void handleSave()} disabled={!profile || saving} sx={{ borderRadius: '8px' }}>
                        {saving ? <CircularProgress size={22} color="inherit" /> : 'Update Details'}
                    </Button>
                </Box>
                {message && <Typography sx={{ mt: 2, color: message.includes('successfully') ? LABOUR_THEME.primary : '#b91c1c' }}>{message}</Typography>}
            </Paper>
        </Box>
    );
};