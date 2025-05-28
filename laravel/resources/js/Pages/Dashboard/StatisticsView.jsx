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
    ArcElement
);

export default function StatisticsView() {
    // Options pour le graphique de présence quotidienne
    const attendanceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    display: true,
                    color: '#f0f0f0',
                },
                ticks: {
                    callback: value => value + '%'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 2
            }
        }
    };

    // Données pour le graphique de présence
    const attendanceData = {
        labels: ['01 Aug', '02 Aug', '03 Aug', '04 Aug', '07 Aug', '08 Aug', '09 Aug', '10 Aug', '11 Aug', '14 Aug', '15 Aug', '16 Aug'],
        datasets: [
            {
                label: 'Taux de présence',
                data: [65, 70, 65, 75, 91, 70, 75, 40, 65, 70, 60, 70],
                borderColor: '#4318FF',
                backgroundColor: 'rgba(67, 24, 255, 0.1)',
                fill: true,
            },
        ],
    };

    // Options pour le graphique hebdomadaire
    const weeklyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
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
                    callback: value => value + '%'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Données pour le graphique hebdomadaire
    const weeklyData = {
        labels: ['Sept', 'Fr', 'Weekend', 'Lundi', 'Jeu'],
        datasets: [
            {
                data: [35, 50, 86, 50, 35],
                backgroundColor: (context) => {
                    const index = context.dataIndex;
                    return index === 2 ? '#4318FF' : '#E9EDF7';
                },
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
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>452</div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>Total Employees</div>
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
                        <span>+2 new employees</span>
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
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>360</div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>On Time</div>
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
                        <span>-1.0% than yesterday</span>
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
                            <div style={{ fontSize: '2.5em', fontWeight: '600', marginBottom: '5px', color: '#2B3674' }}>30</div>
                            <div style={{ fontSize: '0.9em', color: '#A3AED0' }}>Absent</div>
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
                        <span>+2% than yesterday</span>
                    </div>
                </div>
            </div>

            {/* Graphiques */}
            <div className="charts-grid" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {/* Graphique de présence */}
                <div className="chart-container" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: 0, color: '#2B3674', fontSize: '1.1em' }}>Attendance Comparison Chart</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button style={{
                                background: '#4318FF',
                                color: 'white',
                                border: 'none',
                                padding: '5px 15px',
                                borderRadius: '10px',
                                fontSize: '0.9em'
                            }}>Daily</button>
                            <button style={{
                                background: 'transparent',
                                color: '#A3AED0',
                                border: 'none',
                                padding: '5px 15px',
                                fontSize: '0.9em'
                            }}>Weekly</button>
                            <button style={{
                                background: 'transparent',
                                color: '#A3AED0',
                                border: 'none',
                                padding: '5px 15px',
                                fontSize: '0.9em'
                            }}>Monthly</button>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line options={attendanceOptions} data={attendanceData} />
                    </div>
                </div>

                {/* Graphique hebdomadaire */}
                <div className="chart-container" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: 0, color: '#2B3674', fontSize: '1.1em' }}>Weekly Attendance</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Bar options={weeklyOptions} data={weeklyData} />
                    </div>
                </div>
            </div>

            {/* Tableau des présences */}
            <div className="attendance-table" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: 0, color: '#2B3674', fontSize: '1.1em' }}>Attendance Overview</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{
                            background: 'white',
                            border: '1px solid #E0E5F2',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6.5 3.5H12M12 3.5V9M12 3.5L4 11.5" stroke="#A3AED0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button style={{
                            background: '#4318FF',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontSize: '0.9em'
                        }}>View Attendance</button>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E0E5F2' }}>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>ID</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Name</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Department</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Status</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Time In</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Time Out</th>
                            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#A3AED0', fontWeight: '500', fontSize: '0.9em' }}>Total Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>25411421</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>Ahmed Rashdan</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>IT Department</td>
                            <td style={{ padding: '16px 8px' }}>
                                <span style={{ 
                                    backgroundColor: 'rgba(5, 205, 153, 0.1)', 
                                    color: '#05CD99',
                                    padding: '4px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.85em'
                                }}>Work from office</span>
                            </td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>09:00</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>18:00</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>10h 2m</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>25411422</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>Sarah Lambert</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>HR</td>
                            <td style={{ padding: '16px 8px' }}>
                                <span style={{ 
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                                    color: '#FF0000',
                                    padding: '4px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.85em'
                                }}>Absent</span>
                            </td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>-</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>-</td>
                            <td style={{ padding: '16px 8px', color: '#2B3674' }}>0m</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ 
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#A3AED0',
                    fontSize: '0.9em'
                }}>
                    <span>Page 1 of 100</span>
                </div>
            </div>
        </div>
    );
} 