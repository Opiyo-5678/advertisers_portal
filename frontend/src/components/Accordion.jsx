import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-navy-800 text-left">{item.title}</span>
            <ChevronDown
              className={`text-cyan-600 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              size={20}
            />
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-dark-grey-600">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;