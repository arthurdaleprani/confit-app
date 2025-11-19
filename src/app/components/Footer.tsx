import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 py-8">
      <div className="max-w-7xl mx-auto flex justify-around text-sm px-8 font-light">
        
        <div className="w-1/4">
          <h3 className="font-normal mb-3">Institucional</h3>
          <Link href="/about" className="block hover:text-purple-600 transition">Sobre a CakeBake</Link>
        </div>
        
        <div className="w-1/4">
          <h3 className="font-normal mb-3">Políticas Institucionais</h3>
          <Link href="/privacy" className="block hover:text-purple-600 transition">Política de Privacidade</Link>
        </div>
        
        <div className="w-1/4">
          <h3 className="font-normal mb-3">Ajuda</h3>
          <Link href="/faq" className="block hover:text-purple-600 transition">Dúvidas Frequentes</Link>
        </div>
        
        <div className="w-1/4">
          <h3 className="font-normal mb-3">Entre em contato</h3>
          <p>contato@confit.com</p>
        </div>

      </div>
    </footer>
  );
}
