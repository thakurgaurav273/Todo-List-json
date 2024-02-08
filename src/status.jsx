import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({todos}) {
    const incomplete = todos.filter(todo => !todo.done).length;
    const complete = todos.filter(todo => todo.done).length;
  return (
    
    <PieChart
      series={[
        {
          data: [
            { id: '0', value: incomplete, label: 'To be done' },
            { id: '1', value: complete, label: 'Already done' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}