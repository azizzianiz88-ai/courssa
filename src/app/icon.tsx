import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // The overall container acting as the app icon
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eab308", // Tailwind yellow-500
          borderRadius: "22%", // Apple squircle rounded shape
        }}
      >
        {/* Draw the exact SVG path of lucide-react Truck with increased size and stroke */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="320"
          height="320"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#18181b" 
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 17h4V5H2v12h3" />
          <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
          <path d="M14 17h1" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
