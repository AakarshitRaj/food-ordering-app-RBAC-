import './globals.css'

export const metadata = {
  title: 'Food Ordering App',
  description: 'Food ordering application with RBAC',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}