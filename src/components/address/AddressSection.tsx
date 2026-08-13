import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import type { AddressData, AddressErrors } from '../../types/address';
import { detectLocationDetails } from '../../services/locationService';

interface AddressSectionProps {
    address: AddressData;
    errors: AddressErrors;
    onAddressChange: (field: keyof AddressData, value: string) => void;
    onAutoPopulate: (detected: Partial<AddressData>) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
    address,
    errors,
    onAddressChange,
    onAutoPopulate,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [warningMsg, setWarningMsg] = useState('');

    const handleDetect = async () => {
        setIsLoading(true);
        setWarningMsg('');

        try {
            const detected = await detectLocationDetails();
            onAutoPopulate(detected);
        } catch (error) {
            setWarningMsg(error instanceof Error ? error.message : 'Please enter the address manually.');
        } finally {
            setIsLoading(false);
            setIsExpanded(true);
        }
    };

    return (
        <div className="address-container" style={{ marginTop: '15px', marginBottom: '15px' }}>
            {!isExpanded ? (
                <div className="input-group">
                    <button
                        type="button"
                        className="detect-location-btn"
                        onClick={handleDetect}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            borderRadius: '8px',
                            border: '1.5px dashed #7793E9',
                            backgroundColor: '#F3F4F7',
                            color: '#7793E9',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={18} sx={{ color: '#7793E9' }} />
                                <span>Detecting Location...</span>
                            </>
                        ) : (
                            '📍 Click to Detect / Add Address'
                        )}
                    </button>

                    {warningMsg && (
                        <span className="warning-text" style={{ display: 'block', marginTop: '5px', color: '#b45309', fontSize: '12px' }}>
                            {warningMsg}
                        </span>
                    )}
                </div>
            ) : (
                <div className="address-subfields">
                    <div className="address-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #E0E0E0', paddingBottom: '6px' }}>
                        <h4 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 700 }}>Address Details *</h4>
                        <button
                            type="button"
                            className="redetect-btn"
                            onClick={handleDetect}
                            disabled={isLoading}
                            style={{ background: 'none', border: 'none', color: '#7793E9', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >
                            {isLoading ? 'Detecting...' : '🔄 Re-Detect'}
                        </button>
                    </div>

                    {warningMsg && <div className="warning-text" style={{ color: '#b45309', fontSize: '12px', marginBottom: '8px' }}>{warningMsg}</div>}

                    <div className="input-group row-group" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Flat / Apt No *"
                                value={address.apartmentNumber}
                                onChange={(event) => onAddressChange('apartmentNumber', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.apartmentNumber && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.apartmentNumber}</span>}
                        </div>

                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                maxLength={255}
                                placeholder="Building / Society Name *"
                                value={address.buildingName}
                                onChange={(event) => onAddressChange('buildingName', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.buildingName && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.buildingName}</span>}
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '12px' }}>
                        <input
                            type="text"
                            maxLength={255}
                            placeholder="Colony / Landmark / Area *"
                            value={address.colony}
                            onChange={(event) => onAddressChange('colony', event.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                        />
                        {errors.colony && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.colony}</span>}
                    </div>

                    <div className="input-group row-group" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                maxLength={35}
                                placeholder="City *"
                                value={address.city}
                                onChange={(event) => onAddressChange('city', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.city && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.city}</span>}
                        </div>
                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                maxLength={60}
                                placeholder="State *"
                                value={address.state}
                                onChange={(event) => onAddressChange('state', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.state && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.state}</span>}
                        </div>
                    </div>

                    <div className="input-group row-group" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Pincode (6 digits) *"
                                value={address.pincode}
                                onChange={(event) => onAddressChange('pincode', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.pincode && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.pincode}</span>}
                        </div>

                        <div className="half-width" style={{ flex: 1 }}>
                            <input
                                type="text"
                                maxLength={35}
                                placeholder="Country *"
                                value={address.country}
                                onChange={(event) => onAddressChange('country', event.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d5dd' }}
                            />
                            {errors.country && <span className="error-text" style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.country}</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSection;
