import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export default function CustomDropdown({ value, onChange, options, placeholder = "Select option", className = "" }) {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className={`relative ${className}`}>
                <Listbox.Button className="w-full glass-input appearance-none flex items-center justify-between cursor-pointer !px-4">
                    <span className={`pl-5 ${selectedOption ? "" : "text-slate-500"}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown size={16} className="dark:text-slate-400 text-slate-600" />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-[100] mt-2 w-full dark:bg-slate-800 bg-white rounded-xl shadow-2xl dark:border-white/10 border-slate-200 border overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ active, selected }) =>
                                    `relative cursor-pointer select-none py-2 px-3 transition-colors text-sm ${active || selected
                                        ? 'dark:bg-blue-600 bg-blue-100 dark:text-white text-blue-900'
                                        : 'dark:text-slate-200 text-slate-900 dark:hover:bg-slate-700 hover:bg-slate-50'
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between">
                                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-medium'}`}>
                                            {option.label}
                                        </span>
                                        {selected && (
                                            <Check size={16} className="text-current" />
                                        )}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
