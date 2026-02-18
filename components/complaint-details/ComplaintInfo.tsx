import ComplaintImage from "./ComplaintImage";
import ComplaintHeader from "./ComplaintHeader";

const complaintData = {
  imageSrc: "/complaint-image.jpg",
  imageAlt: "Overflowing garbage bin near City Park entrance",
  category: "Sanitation & Waste Management",
  severity: "Medium",
  title: "Overflowing Garbage Bin near City Park Entrance",
  description:
    "The main community garbage collection point near the north entrance of City Park has been overflowing for the past 3 days. It is causing a foul smell in the residential area and attracting stray animals. Requesting immediate clearance and possibly a larger bin installation.",
  submissionDate: "October 24, 2023",
};

export default function ComplaintInfo() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">

      {/* Left: Image */}
      <ComplaintImage
        src={complaintData.imageSrc}
        alt={complaintData.imageAlt}
      />

      {/* Right: Details */}
      <ComplaintHeader
        category={complaintData.category}
        severity={complaintData.severity}
        title={complaintData.title}
        description={complaintData.description}
        submissionDate={complaintData.submissionDate}
      />

    </section>
  );
}