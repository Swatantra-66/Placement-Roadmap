import './globals.css'

export const metadata = {
  title: 'Campus Placement DSA Roadmap 2025',
  description: 'Complete roadmap for campus placement preparation with DSA focus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}