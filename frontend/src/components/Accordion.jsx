import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded overflow-hidden bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-base">
              {item.title}
            </span>
            <ChevronDown
              className={`text-gray-600 transition-transform flex-shrink-0 ml-2 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              size={20}
            />
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 pt-2 text-gray-700 text-sm border-t border-gray-200 bg-gray-50">
              <p className="leading-relaxed">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;