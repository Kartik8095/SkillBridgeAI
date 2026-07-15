import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  history?: number[];
}

export default function ScoreChart({ history = [] }: Props) {

  const data = {
    labels: history.map((_, i) => `Resume ${i + 1}`),

   datasets: [
  {
    label: "Resume Score",
    data: history,
    borderColor: "#2563EB",
    backgroundColor: "rgba(37,99,235,.25)",
    fill: true,
    tension: 0.4,

    pointRadius: 6,
    pointHoverRadius: 8,
    pointBackgroundColor: "#2563EB",
  },
],
  };

  return (
    <div className="chart-card">
      <h2>📈 Resume Score History</h2>

      {history.length === 0 ? (
        <p>No score history available.</p>
      ) : (
        <Line data={data} />
      )}
    </div>
  );


  const options = {
  responsive: true,
  maintainAspectRatio: false,

  scales: {
    y: {
      min: 0,
      max: 100,
    },
  },
};

<div className="chart-card">
    <h2>📈 Resume Score History</h2>

    <div style={{ height: "300px" }}>
        <Line data={data} options={options} />
    </div>
</div>
}