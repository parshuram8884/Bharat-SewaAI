import React, { useEffect, useState } from 'react';
import { semanticColors } from '../tokens/colorTokens';
import { typographyTokens } from '../tokens/typographyTokens';
import { spacingTokens, radiusTokens, shadowTokens, motionTokens } from '../tokens/spacingTokens';

/**
 * DesignSystemProvider
 * Mounts at the root to inject CSS variables and apply themes.
 */
export function DesignSystemProvider({ children }) {
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('bsai_user_preferences')) || {};
      setUserPreferences(prefs);
    } catch {
      // Ignored
    }

    const handleStorageChange = () => {
      try {
        const prefs = JSON.parse(localStorage.getItem('bsai_user_preferences')) || {};
        setUserPreferences(prefs);
      } catch {}
    };
    
    window.addEventListener('bsai_preferences_updated', handleStorageChange);
    return () => window.removeEventListener('bsai_preferences_updated', handleStorageChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Apply Colors
    Object.entries(semanticColors).forEach(([key, value]) => {
      root.style.setProperty(`--ds-color-${key}`, value);
    });

    // Apply Typography
    Object.entries(typographyTokens.size).forEach(([key, value]) => {
      root.style.setProperty(`--ds-text-${key}`, value);
    });

    // Apply Spacing
    Object.entries(spacingTokens).forEach(([key, value]) => {
      root.style.setProperty(`--ds-space-${key}`, value);
    });

    // Apply Radii & Shadows
    Object.entries(radiusTokens).forEach(([key, value]) => {
      root.style.setProperty(`--ds-radius-${key}`, value);
    });
    Object.entries(shadowTokens).forEach(([key, value]) => {
      root.style.setProperty(`--ds-shadow-${key}`, value);
    });

    // Apply High Contrast / Reduced Motion from Preferences
    if (userPreferences.highContrast) {
      root.setAttribute('data-contrast', 'high');
      // Override specific tokens for high contrast
      root.style.setProperty('--ds-color-text-muted', '#1e293b');
      root.style.setProperty('--ds-color-border-default', '#334155');
    } else {
      root.removeAttribute('data-contrast');
    }

    if (userPreferences.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
      root.style.setProperty('--ds-motion-fast', '0ms');
      root.style.setProperty('--ds-motion-normal', '0ms');
      root.style.setProperty('--ds-motion-slow', '0ms');
    } else {
      root.removeAttribute('data-reduced-motion');
      root.style.setProperty('--ds-motion-fast', motionTokens.fast);
      root.style.setProperty('--ds-motion-normal', motionTokens.normal);
      root.style.setProperty('--ds-motion-slow', motionTokens.slow);
    }

    if (userPreferences.fontScale && userPreferences.fontScale !== 100) {
      root.style.setProperty('font-size', `${userPreferences.fontScale}%`);
    } else {
      root.style.removeProperty('font-size');
    }

  }, [userPreferences]);

  return (
    <div className="ds-provider-root h-full text-[var(--ds-color-text-primary)] font-sans antialiased">
      {children}
    </div>
  );
}
