import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PropertyState {
  selectedPropertyId: string | null;
}

const initialState: PropertyState = {
  selectedPropertyId: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<string | null>) => {
      state.selectedPropertyId = action.payload;
    },
    clearSelectedProperty: (state) => {
      state.selectedPropertyId = null;
    },
  },
});

export const { setSelectedProperty, clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
