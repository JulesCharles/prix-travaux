import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
      <Footer />
    </>
  )
}
