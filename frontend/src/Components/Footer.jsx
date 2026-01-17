import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  const sections = [
    {
      title: "ნავიგაცია",
      links: [
        "იპოთეკა",
        "სააგენტოები",
        "პროექტები",
        "შეფასება",
        "ფასების სტატისტიკა",
        "აუქციონი",
        "ფოტომომსახურება",
        "დახმარება",
      ],
    },
    {
      title: "განცხადებები",
      links: [
        "ბინები ქირით",
        "იყიდება ბინები",
        "გირავდება ბინა",
        "ბინები ქირით თბილისში",
        "იყიდება ბინა თბილისში",
        "გირავდება ბინა თბილისში",
      ],
    },
    {
      title: "ქალაქები & უბნები",
      links: [
        "ქირავდება ბინა ბათუმში",
        "იყიდება ბინა ბათუმში",
        "გირავდება ბინა ქუთაისში",
        "ბინები ქირით გლდანში",
        "იყიდება ბინები გლდანში",
        "ბინები ქირით ვარკეთილში",
      ],
    },
    {
      title: "სხვა",
      links: [
        "ქირავდება კომერციული ფართი",
        "იყიდება კერძო სახლი",
        "გირავდება კერძო სახლი",
        "იყიდება მიწა",
        "წესები და პირობები",
        "კონფიდენციალურობის პოლიტიკა",
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to="#"
                      className="text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* კონტაქტი და ქვედა ზოლი */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm font-bold text-slate-400">
            <a
              href="tel:0322800015"
              className="hover:text-slate-900 transition-colors"
            >
              📞 032 2 32 15 15
            </a>
            <a
              href="mailto:info@myhome.ge"
              className="hover:text-slate-900 transition-colors"
            >
              ✉️ info@realestate.ge
            </a>
            <span className="cursor-pointer hover:text-slate-900 transition-colors uppercase tracking-tighter">
              ანონიმური უკუკავშირი
            </span>
          </div>

          <p className="text-slate-300 text-[12px] font-medium">
            © {new Date().getFullYear()} Real Estate Clone. ყველა უფლება
            დაცულია.
          </p>
        </div>
      </div>
    </footer>
  );
}
