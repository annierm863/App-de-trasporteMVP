import React, { useState, useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../services/distanceService';

interface PlacesAutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string) => void;
    placeholder?: string;
    className?: string; // To match existing styling
}

declare const google: any;

const PlacesAutocompleteInput: React.FC<PlacesAutocompleteInputProps> = ({
    value,
    onChange,
    onSelect,
    placeholder,
    className,
}) => {
    const [predictions, setPredictions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce helper
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Load script on mount
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (key) {
            loadGoogleMapsScript(key).catch(err => console.error("Maps load error", err));
        }

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPredictions = (input: string) => {
        if (!input || !google?.maps?.places?.AutocompleteService) {
            setPredictions([]);
            return;
        }

        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
            { input, types: ['geocode', 'establishment'] },
            (results: any[], status: any) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setPredictions(results);
                    setShowSuggestions(true);
                } else {
                    setPredictions([]);
                }
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (!val) {
            setPredictions([]);
            setShowSuggestions(false);
            return;
        }

        debounceTimeout.current = setTimeout(() => {
            fetchPredictions(val);
        }, 300); // 300ms debounce
    };

    const handleSelect = (prediction: any) => {
        const address = prediction.description;
        onChange(address);
        onSelect(address);
        setShowSuggestions(false);
        setPredictions([]);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                className={className}
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={() => {
                    if (predictions.length > 0) setShowSuggestions(true);
                }}
                autoComplete="off" // Disable browser native autocomplete
            />

            {showSuggestions && predictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto ring-1 ring-white/5">
                    {predictions.map((item) => (
                        <button
                            key={item.place_id}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-none group"
                        >
                            <span className="material-symbols-outlined text-white/40 text-sm group-hover:text-primary transition-colors">location_on</span>
                            <span className="text-sm text-gray-200 truncate font-medium">
                                {item.description}
                            </span>
                        </button>
                    ))}
                    <div className="flex items-center justify-end px-2 py-1 bg-black/20">
                        <img src="https://developers.google.com/static/maps/documentation/images/google_on_white.png" alt="Powered by Google" className="h-4 opacity-50 grayscale" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacesAutocompleteInput;
