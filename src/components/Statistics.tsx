import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ReviewStats } from '../models/types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatisticsProps {
  stats: ReviewStats;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  // Prepare data for the review activity chart
  const last7Days = stats.dailyReviews.slice(-7);
  const labels = last7Days.map(day => day.date.substring(5)); // Format as MM-DD
  const reviewData = last7Days.map(day => day.count);
  const correctData = last7Days.map(day => day.correct);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Reviews',
        data: reviewData,
        borderColor: 'rgba(123, 104, 238, 0.8)',
        backgroundColor: 'rgba(123, 104, 238, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Correct',
        data: correctData,
        borderColor: 'rgba(111, 194, 159, 0.8)',
        backgroundColor: 'rgba(111, 194, 159, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };
  
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  
  // Animation variants for stat cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Retention rate */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-indigo-400 text-sm font-medium mb-1">Retention</div>
          <div className="text-indigo-800 text-2xl font-bold">
            {stats.retention.toFixed(1)}%
          </div>
        </motion.div>
        
        {/* Streak */}
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-purple-400 text-sm font-medium mb-1">Streak</div>
          <div className="text-purple-800 text-2xl font-bold">
            {stats.streakDays} day{stats.streakDays !== 1 ? 's' : ''}
          </div>
        </motion.div>
        
        {/* Cards learned */}
        <motion.div 
          className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-pink-400 text-sm font-medium mb-1">Cards Learned</div>
          <div className="text-pink-800 text-2xl font-bold">
            {stats.cardsLearned}
          </div>
        </motion.div>
        
        {/* Due cards */}
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-blue-400 text-sm font-medium mb-1">Due Today</div>
          <div className="text-blue-800 text-2xl font-bold">
            {stats.cardsToReview}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Review activity chart */}
      <motion.div 
        className="bg-white rounded-xl p-4 shadow-md mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">Review Activity</h3>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
      
      {/* Extra stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.6 }}
      >
        {/* Total reviews */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-gray-500 text-sm font-medium mb-1">Total Reviews</div>
          <div className="text-gray-800 text-xl font-bold">{stats.totalReviews}</div>
          <div className="text-green-600 text-sm mt-1">
            {stats.correctReviews} correct ({stats.totalReviews > 0 
              ? ((stats.correctReviews / stats.totalReviews) * 100).toFixed(1) 
              : 0}%)
          </div>
        </motion.div>
        
        {/* Average ease */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="text-gray-500 text-sm font-medium mb-1">Average Ease Factor</div>
          <div className="text-gray-800 text-xl font-bold">{stats.averageEase.toFixed(2)}</div>
          <div className="text-gray-500 text-sm mt-1">
            Lower = more difficult cards
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Statistics;