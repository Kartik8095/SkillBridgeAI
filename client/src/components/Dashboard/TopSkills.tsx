import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Props {
  skills: string[];
}

function TopSkills({ skills }: Props) {

  const data = {
    labels: skills,

    datasets: [
      {
        data: skills.map(() => 1),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#EC4899",
          "#84CC16",
        ],
      },
    ],
  };

  return (
    <div className="chart-card">
      <h2>💻 Skills Found</h2>
      <Doughnut data={data} />
    </div>
  );
}

export default TopSkills;