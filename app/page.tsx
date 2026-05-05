import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Steps from "@/components/Steps";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <Features />
      <Steps />
      <Stats />
    </main>
  );
}
