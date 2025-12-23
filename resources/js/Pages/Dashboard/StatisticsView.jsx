import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

export default function StatisticsView({ statistics }) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    // Options pour le graphique des congés
    const leaveOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 11,
                        weight: '500'
                    },
                    color: '#64748b'
                }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: 'rgba(67, 24, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                boxPadding: 5,
                usePointStyle: true,
                callbacks: {
                    title: (context) => `${months[context[0].dataIndex]} ${new Date().getFullYear()}`,
                    label: (context) => {
                        if (context.dataset.label === 'Demandes de congés') {
                            return `${context.parsed.y} demandes`;
                        }
                        return `${context.parsed.y} nouveaux employés`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(67, 24, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 1,
                    padding: 10,
                    color: '#64748b',
                    font: {
                        size: 11,
                        weight: '500'
                    }
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11,
                        weight: '500'
                    },
                    padding: 10
                },
                border: {
                    display: false
                }
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2,
                fill: true
            },
            point: {
                radius: 0,
                hitRadius: 8,
                hoverRadius: 4,
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
        }
    };

    // Données pour le graphique des congés
    const leaveData = {
        labels: months,
        datasets: [
            {
                label: 'Demandes de congés',
                data: statistics.leaveStats.monthly_data,
                borderColor: '#4318FF',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(67, 24, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(67, 24, 255, 0)');
                    return gradient;
                },
                fill: true,
                pointBackgroundColor: '#4318FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4318FF',
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                order: 2
            },
            {
                label: 'Nouveaux employés',
                data: statistics.leaveStats.monthly_employees,
                borderColor: '#05CD99',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(5, 205, 153, 0.2)');
                    gradient.addColorStop(1, 'rgba(5, 205, 153, 0)');
                    return gradient;
                },
                fill: true,
                pointBackgroundColor: '#05CD99',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#05CD99',
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                order: 1
            }
        ],
    };

    // Options pour le graphique des départements
    const departmentOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} employés`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#f0f0f0',
                },
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Données pour le graphique des départements
    const departmentData = {
        labels: statistics.departmentStats.labels,
        datasets: [
            {
                data: statistics.departmentStats.data,
                backgroundColor: '#4318FF',
                borderRadius: 6,
                barThickness: 20,
            },
        ],
    };

    return (
        <div className="statistics-container" style={{ padding: '20px', width: '100%' }}>
            {/* En-tête avec les statistiques principales */}
            <div className="stats-header" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div className="stat-card" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>
                                {statistics.totalEmployees}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>Total Employés</div>
                        </div>
                        <div style={{ 
                            backgroundColor: '#F4F7FE',
                            padding: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#4318FF"/>
                                <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="#4318FF"/>
                            </svg>
                        </div>
                    </div>
                    <div style={{ 
                        marginTop: '10px',
                        fontSize: '0.85em',
                        color: '#05CD99',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span>{statistics.departmentsCount} départements</span>
                    </div>
                </div>

                <div className="stat-card" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>
                                {statistics.leaveStats.active}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>Congés en cours</div>
                        </div>
                        <div style={{ 
                            backgroundColor: '#F4F7FE',
                            padding: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#4318FF"/>
                                <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div style={{ 
                        marginTop: '10px',
                        fontSize: '0.85em',
                        color: '#05CD99',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span>{((statistics.leaveStats.active / statistics.totalEmployees) * 100).toFixed(1)}% des employés</span>
                    </div>
                </div>

                <div className="stat-card" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>
                                {statistics.leaveStats.pending}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>Demandes en attente</div>
                        </div>
                        <div style={{ 
                            backgroundColor: '#F4F7FE',
                            padding: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4318FF" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div style={{ 
                        marginTop: '10px',
                        fontSize: '0.85em',
                        color: '#FF0000',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span>Requiert une action</span>
                    </div>
                </div>
            </div>

            {/* Graphiques */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ 
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <h3 style={{ 
                        marginBottom: '20px', 
                        color: '#2B3674', 
                        fontSize: '1.1em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2v4M16 2v4M3 10h18M3 8c0-1.1.9-2 2-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#2B3674" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Évolution mensuelle des effectifs et congés
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Line options={leaveOptions} data={leaveData} />
                    </div>
                </div>

                <div style={{ 
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <h3 style={{ marginBottom: '20px', color: '#2B3674', fontSize: '1.1em' }}>Employés par département</h3>
                    <div style={{ height: '300px' }}>
                        <Bar options={departmentOptions} data={departmentData} />
                    </div>
                </div>
            </div>
        </div>
    );
} 