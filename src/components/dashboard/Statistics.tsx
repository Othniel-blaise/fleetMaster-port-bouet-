// import React, { useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { useStore } from '../../store';

// export function Statistics() {
//   const { vehicles, reservations } = useStore();

//   const chartData = useMemo(() => {
//     const now = new Date();
//     const months: {
//       month: string;
//       year: number;
//       reservations: number;
//       vehicles: number;
//     }[] = [];

//     // Créer un tableau des 6 derniers mois
//     for (let i = 5; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       months.push({
//         month: date.toLocaleDateString('fr-FR', { month: 'short' }),
//         year: date.getFullYear(),
//         reservations: 0,
//         vehicles: vehicles.length
//       });
//     }

//     // Compter les réservations par mois
//     reservations.forEach(reservation => {
//       const reservationDate = new Date(reservation.startDate);
//       const monthIndex = months.findIndex(m => {
//         const monthDate = new Date(m.year, new Date(Date.parse(`01 ${m.month} ${m.year}`)).getMonth());
//         return monthDate.getMonth() === reservationDate.getMonth() && 
//                monthDate.getFullYear() === reservationDate.getFullYear();
//       });
//       if (monthIndex !== -1) {
//         months[monthIndex].reservations++;
//       }
//     });

//     return months;
//   }, [vehicles, reservations]);

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiques d'utilisation</h2>
//       <div className="h-96">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 20,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis 
//               dataKey="month" 
//               tickFormatter={(value, index) => `${value} ${chartData[index].year}`}
//             />
//             <YAxis />
//             <Tooltip 
//               formatter={(value, name) => [
//                 value, 
//                 name === 'reservations' ? 'Réservations' : 'Véhicules'
//               ]}
//             />
//             <Legend 
//               formatter={(value) => 
//                 value === 'reservations' ? 'Réservations' : 'Véhicules'
//               }
//             />
//             <Bar dataKey="reservations" name="reservations" fill="#3B82F6" />
//             <Bar dataKey="vehicles" name="vehicles" fill="#10B981" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }