export const metadata = {
  title: "Base Airdrop Checker",
  description: "Check your eligibility for the next phase of Base.",
  openGraph: {
    title: "Base Airdrop Checker",
    description: "Are you eligible? Take the quiz to find out.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* The metadata above handles the image, title, and description automatically */}
      </head>
      <body>{children}</body>
    </html>
  );
}
