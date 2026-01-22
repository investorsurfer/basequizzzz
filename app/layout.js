export const metadata = {
  title: 'Base Airdrop Checker',
  description: 'Verify your eligibility for the Base ecosystem',
  other: {
    'base:app_id': '6971251d8ffff7b10d1871ae', 
  },
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
