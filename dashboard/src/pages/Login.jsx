import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    InputAdornment
} from '@mui/material';
import { Lock, Keyboard } from 'lucide-react';

export default function Login() {
    const [pincode, setPincode] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (pincode.length === 6) {
            await login(pincode);
            navigate('/');
        } else {
            alert("Please enter a valid 6-digit Pincode.");
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            fontFamily: '"Inter", sans-serif'
        }}>
            <Paper elevation={10} sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                borderRadius: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
            }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight="800" color="primary">
                        EcoHealth
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Community Dashboard
                    </Typography>
                </Box>

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Area Pincode"
                        variant="outlined"
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        type="submit"
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            backgroundImage: 'linear-gradient(to right, #1e3c72, #2a5298)',
                            boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)'
                        }}
                    >
                        Access Dashboard
                    </Button>
                </form>

                <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
                    Restricted Access for Health Officials Only
                </Typography>
            </Paper>
        </Box>
    );
}
