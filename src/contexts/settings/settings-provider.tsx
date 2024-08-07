import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash.isequal";

import type { Settings } from "src/types/settings";

import type { State } from "./settings-context";
import {
  SettingsContext,
  initialState,
  defaultSettings,
} from "./settings-context";

const STORAGE_KEY = "app.settings";

const restoreSettings = (): Settings | null => {
  let value = null;

  try {
    const restored: string | null = window.localStorage.getItem(STORAGE_KEY);

    if (restored) {
      value = JSON.parse(restored);
    }
  } catch (err) {
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return value;
};

const storeSettings = (value: Record<string, any>): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (err) {}
};

interface SettingsProviderProps {
  children?: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);
  const [workspaceeModal, setWorkspaceModal] = useState(false);

  const handleUpdateWorkspaceState = (value: boolean) => {
    setWorkspaceModal(value);
  };

  useEffect(() => {
    const restored = restoreSettings();

    if (restored) {
      setState((prevState) => ({
        ...prevState,
        ...restored,
        isInitialized: true,
      }));
    }
  }, []);

  const handleUpdate = useCallback((settings: Settings): void => {
    setState((prevState) => {
      storeSettings({
        colorPreset: prevState.colorPreset,
        layout: prevState.layout,
        navColor: prevState.navColor,
        paletteMode: prevState.paletteMode,
        responsiveFontSizes: prevState.responsiveFontSizes,
        stretch: prevState.stretch,
        ...settings,
      });

      return {
        ...prevState,
        ...settings,
      };
    });
  }, []);

  const isCustom = useMemo(() => {
    return !isEqual(defaultSettings, {
      colorPreset: state.colorPreset,
      layout: state.layout,
      navColor: state.navColor,
      paletteMode: state.paletteMode,
      responsiveFontSizes: state.responsiveFontSizes,
      stretch: state.stretch,
    });
  }, [state]);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        handleUpdate,
        isCustom,
        handleUpdateWorkspaceState,
        workspaceeModal,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
