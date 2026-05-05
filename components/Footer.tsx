import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-16 py-6 text-center text-xs text-gray-500">

      <div className="flex justify-center gap-6 mb-2">
        <Link href="/how-it-works" className="hover:text-white">
          How It Works
        </Link>

        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>

        <Link href="/terms" className="hover:text-white">
          Terms
        </Link>
      </div>

      <p className="text-gray-600">
        © {new Date().getFullYear()} Featrrr Valid
      </p>
    </footer>
  );
}
