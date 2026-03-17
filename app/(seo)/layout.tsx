import { Header } from "@/components/Header"
import { TrustBar } from "@/components/TrustBar"
import { Footer } from "@/components/Footer"

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <TrustBar />
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      <Footer />
    </>
  )
}
