import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBenefitDetail, useBenefitTimeline } from '../../hooks/useBenefitQuery';

const BenefitTimelinePage = () => {
  const { benefitId } = useParams();
  const { data: benefit, isLoading: isBenefitLoading } = useBenefitDetail(benefitId);
  const { data: timeline, isLoading: isTimelineLoading } = useBenefitTimeline(benefitId);

  if (isBenefitLoading || isTimelineLoading) return <div className="p-6">Loading timeline...</div>;
  if (!benefit) return <div className="p-6">Benefit not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/benefits/${benefitId}`} className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Tracking Hub</Link>
        <h1 className="text-2xl font-bold text-gray-800">Payment Timeline</h1>
        <p className="text-sm text-gray-500 mt-1">{benefit.benefitName} ({benefit.id})</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          {timeline && timeline.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  event.status === 'completed' ? 'bg-green-500' :
                  event.status === 'error' ? 'bg-red-500' :
                  'bg-gray-300'
                }`} />
                {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-2" />}
              </div>
              <div className="pb-6 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{event.title}</p>
                    {event.details && <p className="text-sm mt-1 text-gray-600">{event.details}</p>}
                  </div>
                  <span className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitTimelinePage;
