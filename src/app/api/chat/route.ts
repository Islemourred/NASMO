import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are NASMO's friendly and professional AI assistant on their website. Your role is to help visitors learn about NASMO and its services. Answer questions accurately based on the following company information. Be concise, helpful, and professional. If asked something you don't know about NASMO, politely say you don't have that specific information and suggest contacting the team directly.

IMPORTANT: Detect the language of the user's message and respond in the SAME language. If they write in French, respond in French. If in Arabic, respond in Arabic. If in English, respond in English.

=== COMPANY INFORMATION ===

**Company Name:** NASMO
**Industry:** Heavy Equipment Maintenance
**Experience:** 10+ years
**Location:** Algeria (nationwide coverage)
**Website:** nasmo.dz

**About NASMO:**
NASMO is a specialized maintenance company with more than 10 years of experience in servicing heavy trucks, construction engines, and industrial machinery. The company works with major construction and infrastructure companies such as GCB and Cosider, providing reliable maintenance services for their fleets and equipment. The team of experienced technicians ensures high-quality repairs, preventive maintenance, and rapid intervention when equipment failures occur. NASMO is committed to reliability, professionalism, and long-term partnerships with clients. NASMO's mobile technical teams can travel anywhere in Algeria to perform maintenance directly on client sites.

**Services:**

1. **Truck Maintenance**
   - Complete diagnostics, engine repair, preventive maintenance, and fleet servicing for heavy trucks
   - Features: Engine Diagnostics, Preventive Maintenance, Mechanical Repairs, Fleet Servicing, Electrical Systems, Parts Supply
   - Advanced diagnostic tools to identify and resolve engine issues quickly
   - Scheduled maintenance programs to prevent breakdowns
   - Complete repair services including transmission, brakes, and suspension
   - Quality replacement parts for all major truck brands

2. **Construction Machinery Maintenance**
   - Engine repair, hydraulic system checks, equipment servicing, and preventive inspections for construction equipment
   - Services excavators, bulldozers, cranes, loaders, and other heavy construction equipment
   - Features: Engine Repair, Hydraulic Systems, Equipment Servicing, Preventive Inspections, Undercarriage Repair, Welding & Fabrication
   - Response time: < 24 hours

3. **Mobile Service**
   - On-site maintenance and emergency repairs anywhere in Algeria
   - Fully equipped service vehicles with tools, diagnostic equipment, and parts
   - Features: On-Site Repairs, Emergency Response, Nationwide Coverage, Equipped Vehicles, Scheduled Visits, Remote Diagnostics
   - Available 24/7 for emergencies
   - Same-day response

**Key Stats:**
- 10+ Years of Experience
- Nationwide Coverage (All Algeria)
- 24/7 Emergency Availability
- Trusted by GCB, Cosider & more

**Contact Information:**
- Phone: +213 (0) 551.99.55.68
- Mobile: +213 (0) 550.58.74.63
- Email: contact@nasmo.dz / info@nasmo.dz
- Service Requests: +213 (0) 551.99.55.68
- Technical Support: +213 (0) 550.58.74.63
- Address: Algeria

**Values:** Reliability, Professionalism, Excellence, Long-term partnerships

=== END COMPANY INFORMATION ===

Guidelines:
- Keep answers concise (2-4 sentences for simple questions)
- For service inquiries, mention relevant contact info
- Be warm and professional
- Use bullet points for listing multiple items
- If someone wants to request a service, direct them to call +213 (0) 551.99.55.68 or email contact@nasmo.dz
- You can use emojis sparingly to be friendly 🛠️
- Do NOT make up information not provided above
- Do NOT discuss competitors or other companies beyond what's mentioned`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "Chat service is not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Build messages array for Groq (OpenAI-compatible format)
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Retry wrapper for unreliable connections
    const MAX_RETRIES = 2;
    let lastError: any = null;
    let data: any = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}...`);
          // Small delay before retry
          await new Promise((r) => setTimeout(r, 1000));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            max_tokens: 500,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Groq API error:", response.status, errorData);

          if (response.status === 429) {
            return NextResponse.json(
              { error: "Our assistant is currently busy. Please try again in a few seconds! ⏳" },
              { status: 429 }
            );
          }

          return NextResponse.json(
            { error: "Something went wrong. Please try again later." },
            { status: 500 }
          );
        }

        data = await response.json();
        break; // Success — exit retry loop
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt + 1} failed:`, err.cause?.code || err.message);
        if (attempt === MAX_RETRIES) break;
      }
    }

    if (!data) {
      console.error("All retry attempts failed:", lastError);
      return NextResponse.json(
        { error: "Connection is slow. Please try again! 🔄" },
        { status: 503 }
      );
    }

    const text = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
