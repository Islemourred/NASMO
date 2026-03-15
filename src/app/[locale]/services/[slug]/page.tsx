"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const servicesData: Record<string, {
  title: string; subtitle: string; hero: string; desc: string;
  longDesc: string;
  features: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
}> = {
  "truck-maintenance": {
    title: "Truck Maintenance",
    subtitle: "Professional servicing for heavy trucks",
    hero: "/images/service-electrical.png",
    desc: "Complete diagnostics, engine repair, preventive maintenance, and fleet servicing for heavy trucks.",
    longDesc: "NASMO provides comprehensive truck maintenance services with over 10 years of experience. Our team of skilled technicians handles everything from engine diagnostics and mechanical repairs to preventive maintenance and complete fleet servicing. We work with major companies such as GCB and Cosider, ensuring their truck fleets remain in optimal condition.",
    features: [
      { title: "Engine Diagnostics", desc: "Advanced diagnostic tools to identify and resolve engine issues quickly" },
      { title: "Preventive Maintenance", desc: "Scheduled maintenance programs to prevent breakdowns" },
      { title: "Mechanical Repairs", desc: "Complete repair services including transmission, brakes, and suspension" },
      { title: "Fleet Servicing", desc: "Dedicated fleet management and maintenance programs" },
      { title: "Electrical Systems", desc: "Diagnosis and repair of truck electrical systems" },
      { title: "Parts Supply", desc: "Quality replacement parts for all major truck brands" },
    ],
    specs: [
      { label: "Experience", value: "10+ Years" },
      { label: "Coverage", value: "All Algeria" },
      { label: "Availability", value: "24/7 Emergency" },
      { label: "Clients", value: "GCB, Cosider & more" },
    ],
  },
  "construction-equipment": {
    title: "Construction Machinery",
    subtitle: "Keeping your construction equipment running",
    hero: "/images/service-airport.png",
    desc: "Engine repair, hydraulic system checks, equipment servicing, and preventive inspections.",
    longDesc: "NASMO specializes in the maintenance and repair of construction machinery used in large-scale infrastructure and building projects. Our experienced technicians service excavators, bulldozers, cranes, loaders, and other heavy construction equipment. We support major construction companies across Algeria.",
    features: [
      { title: "Engine Repair", desc: "Comprehensive engine overhaul for all types of construction machinery" },
      { title: "Hydraulic Systems", desc: "Inspection, repair, and maintenance of hydraulic components" },
      { title: "Equipment Servicing", desc: "Regular servicing to maintain peak performance" },
      { title: "Preventive Inspections", desc: "Scheduled inspections to prevent breakdowns" },
      { title: "Undercarriage Repair", desc: "Track system and undercarriage maintenance" },
      { title: "Welding & Fabrication", desc: "Structural repairs and custom fabrication" },
    ],
    specs: [
      { label: "Equipment Types", value: "All Major Brands" },
      { label: "Response Time", value: "< 24 Hours" },
      { label: "Coverage", value: "Nationwide" },
      { label: "Partnerships", value: "GCB, Cosider" },
    ],
  },
  "mobile-service": {
    title: "Mobile Service",
    subtitle: "On-site repairs anywhere in Algeria",
    hero: "/images/service-equipment.png",
    desc: "Our mobile technical teams travel anywhere in Algeria to perform maintenance directly on your site.",
    longDesc: "NASMO's mobile maintenance service brings our expertise directly to your worksite. Our fully equipped service vehicles carry the tools, diagnostic equipment, and parts needed to perform most repairs on-site. Whether you're on a remote construction site or at a fixed facility, our mobile teams can reach you anywhere in Algeria.",
    features: [
      { title: "On-Site Repairs", desc: "Comprehensive repair services at your worksite" },
      { title: "Emergency Response", desc: "Rapid deployment for urgent breakdowns" },
      { title: "Nationwide Coverage", desc: "Mobile teams ready to travel across Algeria" },
      { title: "Equipped Vehicles", desc: "Fully equipped service vehicles with tools and parts" },
      { title: "Scheduled Visits", desc: "Regular on-site maintenance visits" },
      { title: "Remote Diagnostics", desc: "Phone-based diagnostics before arrival" },
    ],
    specs: [
      { label: "Coverage", value: "All Algeria" },
      { label: "Response", value: "Same Day" },
      { label: "Service Hours", value: "24/7 Available" },
      { label: "Fleet", value: "Equipped Mobile Units" },
    ],
  },
};

export default function ServiceDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-txt mb-4">Service not found</h1>
          <Link href={`/${locale}/services`} className="btn btn-primary">Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[500px] overflow-hidden bg-black">
        <Image src={service.hero} alt={service.title} fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <Link href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-white/30 text-[.78rem] font-medium hover:text-orange transition-colors mb-5 uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All Services
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              {service.title}
            </h1>
            <p className="text-white/35 mt-4 max-w-xl text-base">{service.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-lg bg-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-14">
              <AnimatedSection>
                <div className="section-label mb-5">Overview</div>
                <p className="text-txtsec text-[.95rem] leading-[1.9]">{service.longDesc}</p>
              </AnimatedSection>

              <AnimatedSection>
                <div className="section-label mb-6">What We Offer</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {service.features.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * .05 }}
                      className="border-t border-line pt-4 group">
                      <h3 className="text-[.88rem] font-bold text-txt mb-1 group-hover:text-orange transition-colors">{f.title}</h3>
                      <p className="text-txtmuted text-[.8rem] leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div>
              <AnimatedSection>
                <div className="bg-surface border border-line p-6 lg:p-8 sticky top-24">
                  <div className="section-label mb-5">Details</div>
                  <div className="space-y-4">
                    {service.specs.map((sp, i) => (
                      <div key={i} className="flex justify-between items-center pb-4 border-b border-line last:border-0 last:pb-0">
                        <span className="text-txtmuted text-[.8rem]">{sp.label}</span>
                        <span className="text-txt text-[.82rem] font-semibold">{sp.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3">
                    <Link href={`/${locale}/contact`}
                      className="btn btn-primary w-full justify-center text-[.8rem]">
                      Request Service
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                    <a href="tel:+213551995568" className="btn btn-secondary w-full justify-center text-[.8rem]">
                      Call Now
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[300px] overflow-hidden">
        <Image src="/images/hero-generators.png" alt="Contact" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 h-full container flex flex-col items-center justify-center text-center">
          <AnimatedSection>
            <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-3 tracking-tight">Interested in this service?</h3>
            <p className="text-white/35 mb-6">
              <span className="text-orange font-bold">+213 551 99 55 68</span>
            </p>
            <Link href={`/${locale}/contact`} className="btn btn-primary">Contact Us</Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
