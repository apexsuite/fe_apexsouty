import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LangState {
  language: string;
}

const initialState: LangState = {
  language: typeof window !== 'undefined' && localStorage.getItem('lang') ? localStorage.getItem('lang')! : 'en',
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', action.payload);
      }
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer; 