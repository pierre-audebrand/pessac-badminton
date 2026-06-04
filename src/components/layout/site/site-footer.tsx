export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-primary bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Pessac Badminton
      </div>
    </footer>
  );
}
