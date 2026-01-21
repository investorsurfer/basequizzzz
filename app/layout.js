export const metadata = {
  title: 'Base Airdrop Checker',
  description: 'Verify your eligibility for the Base ecosystem',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
