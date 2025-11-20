import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded bg-white shadow-sm">
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 text-base">
              {item.title}
            </span>
            <ChevronDown
              className={`text-gray-500 transition-transform flex-shrink-0 ml-3 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              size={18}
            />
          </button>
          {openIndex === index && (
            <div className="px-5 py-4 text-gray-700 text-sm leading-relaxed border-t border-gray-200 bg-gray-50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;