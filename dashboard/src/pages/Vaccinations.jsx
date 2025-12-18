import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip } from '@mui/material';
import { Send, Upload } from 'lucide-react';

export default function VaccinationList() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchVaccinations();
    }, []);

    const fetchVaccinations = async () => {
        try {
            const res = await axios.get('/api/vaccinations');
            setUsers(res.data);
        } catch (e) { console.error(e); }
    };

    const handleOpenAlert = (user) => {
        setSelectedUser(user);
        setMsg(`Hello ${user.name}, this is a reminder for your upcoming vaccination dose. Please visit the nearest center.`);
        setOpen(true);
    };

    const sendAlert = async () => {
        try {
            await axios.post('/api/send-alert', {
                phone_number: selectedUser.phone_number,
                message: msg
            });
            alert("Alert Sent Successfully!");
            setOpen(false);
        } catch (e) {
            alert("Failed to send alert.");
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Vaccination Records</Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">Name</TableCell>
                            <TableCell>Vaccine Info (AI Extracted)</TableCell>
                            <TableCell>Dose 1 Date</TableCell>
                            <TableCell>Dose 2 Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.name || 'Unknown'}</TableCell>
                                <TableCell>
                                    {row.vaccineName ? (
                                        <Chip label={row.vaccineName} color="primary" size="small" />
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">{row.vaccination_card}</Typography>
                                    )}
                                </TableCell>
                                <TableCell>{row.dose1Date || 'N/A'}</TableCell>
                                <TableCell>
                                    {row.dose2Date === 'Pending' ? <Chip label="Pending" color="warning" size="small" /> : (row.dose2Date || 'N/A')}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        endIcon={<Send size={14} />}
                                        onClick={() => handleOpenAlert(row)}
                                        disabled={!row.phone_number}
                                    >
                                        Alert
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && <TableRow><TableCell colSpan={5} align="center">No vaccination records found.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Alert Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Send Vaccination Alert</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={sendAlert} variant="contained" color="primary">Send WhatsApp</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
