const WA_NUMBER = "5215521864824";
const WA_MESSAGE = encodeURIComponent(
  "Hola, me interesa conocer más sobre Distum Anzures. ¿Podrían enviarme información sobre disponibilidad y precios?",
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
const DISPLAY_NUMBER = "+52 55 2186 4824";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-1">
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.button"
        className="group flex items-center gap-2"
        aria-label="Chat on WhatsApp"
      >
        {/* Number pill — visible on desktop hover */}
        <span
          className="hidden sm:group-hover:flex items-center px-3 py-2 rounded-full text-white text-xs font-medium whitespace-nowrap transition-all duration-200"
          style={{
            background: "rgba(37,211,102,0.15)",
            border: "1px solid rgba(37,211,102,0.3)",
          }}
        >
          {DISPLAY_NUMBER}
        </span>

        {/* Circle button with pulse */}
        <span className="relative flex items-center justify-center w-14 h-14">
          <span
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              backgroundColor: "#25D366",
              animation: "wa-pulse 2s ease-out infinite",
            }}
          />
          <span
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7"
              aria-hidden="true"
              focusable="false"
            >
              <title>WhatsApp</title>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </span>
        </span>
      </a>

      {/* Mobile number label — always visible on small screens */}
      <span
        className="sm:hidden text-center text-[10px] font-medium"
        style={{ color: "rgba(37,211,102,0.85)" }}
      >
        {DISPLAY_NUMBER}
      </span>
    </div>
  );
}
