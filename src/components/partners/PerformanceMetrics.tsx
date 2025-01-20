// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import type { PartnerGarage, GaragePerformance } from '../../types';

// interface PerformanceMetricsProps {
//   garage: PartnerGarage;
//   performance?: GaragePerformance;
// }

// export function PerformanceMetrics({ garage, performance }: PerformanceMetricsProps) {
//   if (!performance) return null;

//   const metricsData = [
//     {
//       name: 'Satisfaction client',
//       value: performance.metrics.customerSatisfaction,
//       target: 4.5
//     },
//     {
//       name: 'Délai moyen',
//       value: performance.metrics.averageRepairTime,
//       target: 2
//     },
//     {
//       name: 'Score qualité',
//       value: performance.metrics.qualityScore,
//       target: 90
//     },
//     {
//       name: 'Livraison à temps',
//       value: performance.metrics.onTimeDelivery,
//       target: 95
//     }
//   ];

//   return (
//     <div className="mt-6 border-t pt-6 space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-sm font-medium text-gray-900 mb-4">Performance globale</h4>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={metricsData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" name="Actuel" fill="#3B82F6" />
//                 <Bar dataKey="target" name="Objectif" fill="#10B981" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div>
//           <h4 className="text-sm font-medium text-gray-900 mb-4">Services les plus demandés</h4>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={performance.topServices}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="serviceType" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="count" name="Nombre" fill="#8B5CF6" />
//                 <Bar dataKey="revenue" name="Revenu" fill="#F59E0B" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-sm font-medium text-gray-900 mb-2">Problèmes rencontrés</h4>
//           <div className="space-y-2">
//             {performance.issues.map((issue, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
//               >
//                 <span className="text-sm">{issue.type}</span>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium">{issue.count}</span>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     issue.impact === 'high' ? 'bg-red-100 text-red-800' :
//                     issue.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-green-100 text-green-800'
//                   }`}>
//                     {issue.impact}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h4 className="text-sm font-medium text-gray-900 mb-2">Métriques financières</h4>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-500">Revenu généré</p>
//               <p className="text-lg font-semibold text-gray-900">
//                 {performance.metrics.revenueGenerated.toLocaleString('fr-FR', {
//                   style: 'currency',
//                   currency: 'EUR'
//                 })}
//               </p>
//             </div>
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-500">Économies réalisées</p>
//               <p className="text-lg font-semibold text-gray-900">
//                 {performance.metrics.costSavings.toLocaleString('fr-FR', {
//                   style: 'currency',
//                   currency: 'EUR'
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }