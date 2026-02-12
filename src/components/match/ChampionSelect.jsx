import { useState, useRef, useEffect } from 'react';
import { searchChampions, getAllChampionNames, getChampionPrimaryRole } from '../../data/champions';
import './ChampionSelect.css';

export default function ChampionSelect({ value, onChange, placeholder = "Select champion" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredChampions = searchQuery 
    ? searchChampions(searchQuery) 
    : getAllChampionNames();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelectChampion = (championName) => {
    onChange(championName);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredChampions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredChampions[highlightedIndex]) {
          handleSelectChampion(filteredChampions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const getRoleLabel = (championName) => {
    const role = getChampionPrimaryRole(championName);
    const roleLabels = {
      top: 'Top',
      jungle: 'JG',
      mid: 'Mid',
      adc: 'ADC',
      support: 'Sup'
    };
    return roleLabels[role] || '';
  };

  return (
    <div className="champion-select" ref={dropdownRef}>
      <div 
        className={`champion-select-input ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {value ? (
          <div className="selected-champion">
            <span className="selected-champion-name">{value}</span>
            <button 
              type="button" 
              className="clear-btn" 
              onClick={handleClear}
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="champion-search-input"
          />
        )}
        <span className="dropdown-arrow">▾</span>
      </div>

      {isOpen && (
        <ul className="champion-dropdown">
          {filteredChampions.length > 0 ? (
            filteredChampions.slice(0, 20).map((champion, index) => (
              <li
                key={champion}
                className={`champion-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelectChampion(champion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="champion-option-name">{champion}</span>
                <span className="champion-option-role">{getRoleLabel(champion)}</span>
              </li>
            ))
          ) : (
            <li className="champion-option no-results">No champions found</li>
          )}
        </ul>
      )}
    </div>
  );
}