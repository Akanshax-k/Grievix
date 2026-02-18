import Header from "@/components/complaint-details/Header";
import ComplaintInfo from "@/components/complaint-details/ComplaintInfo";
import LocationSection from "@/components/complaint-details/LocationSection";
import StatusCard from "@/components/complaint-details/StatusCard";
import { Separator } from "@/components/ui/separator";

export default function ComplaintDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Complaint Details
        </h1>

        <ComplaintInfo />

        <Separator className="bg-gray-200" />

        <LocationSection latitude="28.6139° N" longitude="77.2090° E" />

        <StatusCard status="In progress" />
      </main>
    </div>
  );
}