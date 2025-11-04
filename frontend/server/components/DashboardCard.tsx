import React from "react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  value: string;
  subtitle2?: string;
  value2?: string;
  icon?: React.ReactNode;
}

export default function DashboardCard({
  title,
  subtitle,
  value,
  subtitle2,
  value2,
  icon,
}: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        {icon}
        <h2 className="card-title">{title}</h2>
      </div>

      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      <p className="card-value">{value}</p>

      {subtitle2 && <p className="card-subtitle">{subtitle2}</p>}
      {value2 && <p className="card-value">{value2}</p>}
    </div>
  );
}
