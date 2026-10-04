import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  MetricCard,
  JobsOverTimeChart,
  JobsByStatusChart,
  RevenueByServiceChart,
  SLAGauge,
  TechnicianLeaderboard,
  ActivityFeed,
  DivisionDistribution,
  DateRangeSelector,
  DashboardControls,
  ChartSkeleton,
  PresetPeriod,
} from '../components/analytics';
import { ClipboardList, CheckCircle2, Clock, Banknote } from 'lucide-react';
import { motion } from 'motion/react';

export interface AnalyticsDashboardPageProps {
  locale?: 'en' | 'bn';
  onNavigateToKanban?: () => void;
  onNavigateToMap?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardPageProps> = ({
  locale = 'en',
  onNavigateToKanban,
  onNavigateToMap,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PresetPeriod>('last7days');
  const [jobsOverTimePeriod, setJobsOverTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const {
    data,
    isLoading,
    lastUpdated,
    refresh,
  } = useAnalytics({ period: selectedPeriod });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {locale === 'bn' ? '📊 অ্যানালিটিক্স ও অপারেশনস ড্যাশবোর্ড' : '📊 Analytics & Executive Insights'}
            </h1>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'bn'
              ? 'বাংলাদেশ ফিল্ড সার্ভিস অপারেশনের রিয়েল-টাইম পারফরম্যান্স, এসএলএ ও রাজস্ব পর্যালোচনা'
              : 'Real-time telemetry, SLA compliance, revenue analytics, and workforce fleet KPIs'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <DateRangeSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            locale={locale}
          />
          <DashboardControls
            onRefresh={refresh}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            locale={locale}
          />
        </div>
      </div>

      {/* Top KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Work Orders"
          titleBn="মোট ওয়ার্ক অর্ডার"
          value={data.totalJobs}
          format="number"
          trend={{
            value: data.jobsTrend,
            direction: 'up',
            label: 'vs previous period',
            labelBn: 'পূর্ববর্তী সময়ের চেয়ে বেশি',
          }}
          sparkline={[20, 24, 22, 28, 25, 30, 32]}
          icon={<ClipboardList className="w-5 h-5" />}
          color="indigo"
          onClick={onNavigateToKanban}
          locale={locale}
        />

        <MetricCard
          title="Completed Today"
          titleBn="আজকের সম্পন্ন কাজ"
          value={data.completedJobs}
          format="number"
          trend={{
            value: 91.0,
            direction: 'up',
            label: 'completion rate',
            labelBn: 'সমাপ্তির হার',
          }}
          sparkline={[14, 18, 15, 22, 24, 26, 28]}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
          onClick={onNavigateToKanban}
          locale={locale}
        />

        <MetricCard
          title="Avg Resolution Time"
          titleBn="গড় সমাধানের সময়"
          value={data.averageResponseTime}
          format="duration"
          trend={{
            value: 8,
            direction: 'down',
            label: 'faster response',
            labelBn: 'পূর্বের চেয়ে দ্রুত',
          }}
          sparkline={[58, 54, 52, 49, 48, 50, 47]}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          locale={locale}
        />

        <MetricCard
          title="Total Revenue"
          titleBn="মোট সংগৃহীত রাজস্ব"
          value={data.totalRevenue}
          format="currency"
          trend={{
            value: data.revenueTrend,
            direction: 'up',
            label: 'target achieved',
            labelBn: 'টার্গেট অর্জিত',
          }}
          sparkline={[280, 320, 350, 390, 410, 430, 452]}
          icon={<Banknote className="w-5 h-5" />}
          color="sky"
          locale={locale}
        />
      </div>

      {/* Main Charts Row 1: Jobs Over Time & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton height={340} title="Loading Jobs Trend..." />
          ) : (
            <JobsOverTimeChart
              data={data.jobsOverTime}
              period={jobsOverTimePeriod}
              onPeriodChange={(p) => setJobsOverTimePeriod(p as any)}
              locale={locale}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          {isLoading ? (
            <ChartSkeleton height={340} title="Loading Status Breakdown..." />
          ) : (
            <JobsByStatusChart
              data={data.jobsByStatus}
              total={data.totalJobs}
              locale={locale}
            />
          )}
        </div>
      </div>

      {/* Main Charts Row 2: Revenue by Service & SLA Performance Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton height={320} title="Loading Service Revenue..." />
          ) : (
            <RevenueByServiceChart
              data={data.revenueByService}
              locale={locale}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          {isLoading ? (
            <ChartSkeleton height={320} title="Loading SLA Gauge..." />
          ) : (
            <SLAGauge
              data={data.slaPerformance}
              locale={locale}
            />
          )}
        </div>
      </div>

      {/* Row 3: Technician Leaderboard */}
      <div>
        {isLoading ? (
          <ChartSkeleton height={280} title="Loading Leaderboard..." />
        ) : (
          <TechnicianLeaderboard
            technicians={data.technicianLeaderboard}
            locale={locale}
          />
        )}
      </div>

      {/* Row 4: Regional Division & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isLoading ? (
            <ChartSkeleton height={300} title="Loading Division Distribution..." />
          ) : (
            <DivisionDistribution
              data={data.divisionDistribution}
              onViewMap={onNavigateToMap}
              locale={locale}
            />
          )}
        </div>

        <div>
          {isLoading ? (
            <ChartSkeleton height={300} title="Loading Activity Stream..." />
          ) : (
            <ActivityFeed
              activities={data.recentActivity}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
};
