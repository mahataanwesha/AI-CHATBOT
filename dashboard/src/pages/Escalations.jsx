import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';

export default function Escalations() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        axios.get('/api/alerts').then(res => setAlerts(res.data)).catch(console.error);
    }, []);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Escalations & Alerts</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alerts.map((alert) => (
                    <Paper key={alert.id} sx={{ p: 2, borderLeft: '4px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">{alert.severity_level} PRIORITY</Typography>
                                <Chip label={alert.status} size="small" color={alert.status === 'PENDING' ? 'warning' : 'default'} />
                            </Box>
                            <Typography>User: {alert.name} ({alert.age}/{alert.gender}) - {alert.pincode}</Typography>
                            <Typography variant="body2" color="text.secondary">Phone: {alert.phone_number}</Typography>
                        </Box>
                        <Button variant="outlined" color="error" startIcon={<AlertCircle size={16} />}>
                            Assign to ASHA
                        </Button>
                    </Paper>
                ))}
                {alerts.length === 0 && <Typography color="text.secondary">No active alerts.</Typography>}
            </Box>
        </Box>
    );
}
