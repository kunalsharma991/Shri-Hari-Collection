import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918859000084"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 text-5xl"
    >
      <FaWhatsapp />
    </a>
  );
}

export default WhatsAppButton;
