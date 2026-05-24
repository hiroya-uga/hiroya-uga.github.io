'use client';

import { createContext, useContext } from 'react';
import { UNSUPPORTED_LABEL } from '../utils';

const UnsupportedLabelContext = createContext<string>(UNSUPPORTED_LABEL);

export const UnsupportedLabelProvider = UnsupportedLabelContext.Provider;

export const useUnsupportedLabel = () => useContext(UnsupportedLabelContext);
