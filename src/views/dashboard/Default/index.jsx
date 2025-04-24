import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(false);
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched products:', data); // ✅ Add this
        setProducts(data);
      });
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">{products.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Average Price
            </Typography>
            <Typography variant="h4">
              ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Top Price
            </Typography>
            <Typography variant="h4">${products.length > 0 ? Math.max(...products.map((p) => p.price)).toFixed(2) : 0}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Products by Category
            </Typography>

            {products.length > 0 ? (
              <>
                {(() => {
                  const pieData = Object.entries(
                    products.reduce((acc, curr) => {
                      acc[curr.category] = (acc[curr.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([category, count]) => ({ name: category, value: count }));

                  console.log('Pie Chart Data:', pieData);

                  return (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                          {['#8884d8', '#82ca9d', '#ffc658', '#ff8042'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}
              </>
            ) : (
              <Typography>Loading chart...</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
