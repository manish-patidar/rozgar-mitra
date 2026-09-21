import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { customerApi, type ProfileResponse } from '../../../api/customer.api';
import { getApiErrorMessage } from '../../../api/client';
import { CUSTOMER_THEME } from '../../../utils/customer.constants';
import { VALIDATION } from '../../../utils/constants';
import { formatPhoneNumber, sanitizeFullName, validateFullName, validatePhoneNumber } from '../../../utils/validation';

interface ProfileErrors {
    name?: string;
    phone?: string;
    address?: string;
}

export const CustomerProfile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        customerApi.getProfile().then((response) => {
            setProfile(response.data);
            setName(response.data.name ?? '');
            setPhone(response.data.phone_number ?? '');
            setAddress([response.data.address?.colony, response.data.address?.city, response.data.address?.state].filter(Boolean).join(', '));
        }).catch((error) => setMessage(getApiErrorMessage(error, 'Unable to load profile')))
            .finally(() => setLoading(false));
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
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: CUSTOMER_THEME.text, mb: 3 }}>Profile Settings</Typography>

            <Paper sx={{ p: 4, borderRadius: '16px', mb: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Personal Information</Typography>
                {message && <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: CUSTOMER_THEME.primary }} /></Box> : (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                            <TextField label="Full Name" fullWidth value={name} onChange={(event) => { setName(sanitizeFullName(event.target.value)); setErrors((current) => ({ ...current, name: undefined })); }} error={Boolean(errors.name)} helperText={errors.name} slotProps={{ htmlInput: { maxLength: VALIDATION.NAME_MAX_LENGTH } }} disabled={!profile || saving} />
                            <TextField label="Phone Number" fullWidth value={phone} onChange={(event) => { setPhone(formatPhoneNumber(event.target.value)); setErrors((current) => ({ ...current, phone: undefined })); }} error={Boolean(errors.phone)} helperText={errors.phone} type="tel" inputMode="numeric" slotProps={{ htmlInput: { maxLength: 13 } }} disabled={!profile || saving} />
                            <TextField label="Username" fullWidth value={profile?.username ?? ''} disabled />
                            <TextField label="Email" fullWidth value={profile?.email ?? ''} disabled />
                            <TextField label="Complete Address" fullWidth multiline rows={2} sx={{ gridColumn: '1 / -1' }} value={address} onChange={(event) => { setAddress(event.target.value); setErrors((current) => ({ ...current, address: undefined })); }} error={Boolean(errors.address)} helperText={errors.address} disabled={!profile || saving} />
                        </Box>
                        <Button variant="contained" onClick={() => void handleSave()} disabled={!profile || saving} sx={{ backgroundColor: CUSTOMER_THEME.primary, '&:hover': { backgroundColor: '#047857' } }}>
                            {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </>
                )}
            </Paper>

            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Change Password</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, maxWidth: '400px', mb: 3 }}>
                    <TextField label="Old Password" type="password" fullWidth />
                    <TextField label="New Password" type="password" fullWidth />
                    <TextField label="Confirm New Password" type="password" fullWidth />
                </Box>
                <Button variant="contained" sx={{ backgroundColor: CUSTOMER_THEME.warning, '&:hover': { backgroundColor: '#d97706' } }}>Update Password</Button>
            </Paper>
        </Box>
    );
};