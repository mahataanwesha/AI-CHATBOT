import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertTriangle, MessageCircle, Activity } from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', p: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600" textTransform="uppercase" sx={{ letterSpacing: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: '#1e293b' }}>
                    {value}
                </Typography>
            </Box>
            <Box sx={{
                width: 48, height: 48,
                borderRadius: '50%',
                bgcolor: `${color}20`,
                color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app this would call API, here we mock + some real calls if wired
        // axios.get('/api/stats')...
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/stats');
                setStats(res.data);
            } catch (e) {
                console.error("Failed to fetch stats");
                // Fallback mock
                setStats({ users: 0, pending_alerts: 0, total_queries: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = [
        { name: 'Fever', value: 45 },
        { name: 'Cold', value: 30 },
        { name: 'Dengue', value: 12 },
        { name: 'Typhoid', value: 8 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" color="#1e293b">Dashboard Overview</Typography>
                <Typography variant="body1" color="text.secondary">Real-time community health insights</Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value={stats?.users || 0} icon={<Users />} color="#2563eb" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Alerts" value={stats?.pending_alerts || 0} icon={<AlertTriangle />} color="#ef4444" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Health Queries" value={stats?.total_queries || 0} icon={<MessageCircle />} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Vaccinations Due" value={12} icon={<Activity />} color="#8b5cf6" />
                </Grid>
            </Grid>

            {/* Charts Grid */}
            <Grid container spacing={3}>
                {/* Symptom Trends */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Common Symptom Trends</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Risk Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Risk Distribution</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Low Risk', value: 70 },
                                        { name: 'Medium Risk', value: 20 },
                                        { name: 'High Risk', value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-0" fill="#10b981" />
                                    <Cell key="cell-1" fill="#f59e0b" />
                                    <Cell key="cell-2" fill="#ef4444" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
