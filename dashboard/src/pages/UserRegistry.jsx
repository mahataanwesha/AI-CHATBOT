import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

export default function UserRegistry() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users').then(res => setUsers(res.data)).catch(console.error);
    }, []);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Community Registry</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Age/Gender</TableCell>
                            <TableCell>Pincode</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.phone_number}>
                                <TableCell fontWeight="bold">{row.name}</TableCell>
                                <TableCell>{row.phone_number}</TableCell>
                                <TableCell>{row.age} / {row.gender}</TableCell>
                                <TableCell>{row.pincode}</TableCell>
                                <TableCell><Chip label="Active" color="success" size="small" /></TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && <TableRow><TableCell colSpan={5} align="center">No users found</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
