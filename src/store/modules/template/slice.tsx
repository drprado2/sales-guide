import { FaBeer } from 'react-icons/fa';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { BreadcrumbRoute, TemplateState } from './types';

const initialState: TemplateState = {
  icon: <FaBeer />,
  title: '',
  routeId: '',
  drawerOpen: true,
  pageImage: undefined,
  breadcrumbRoutes: [],
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<Omit<TemplateState, 'drawerOpen' | 'breadcrumbRoutes'>>) {
      state.icon = action.payload.icon;
      state.title = action.payload.title;
      state.routeId = action.payload.routeId;
      state.pageImage = action.payload.pageImage;
    },
    pushBreadcrumb(state, action: PayloadAction<BreadcrumbRoute>) {
      if (state.breadcrumbRoutes.length === 0 || state.breadcrumbRoutes.every((r) => r.path !== action.payload.path)) {
        state.breadcrumbRoutes.push(action.payload);
      } else {
        let isLast = false;
        while (!isLast) {
          if (state.breadcrumbRoutes[state.breadcrumbRoutes.length - 1].path !== action.payload.path) {
            state.breadcrumbRoutes = state.breadcrumbRoutes.slice(0, state.breadcrumbRoutes.length - 1);
          } else {
            isLast = true;
          }
        }
      }
    },
    resetBreadcrumbTo(state, action: PayloadAction<BreadcrumbRoute>) {
      state.breadcrumbRoutes = [action.payload];
    },
    toggleDrawer(state, action: PayloadAction) {
      state.drawerOpen = !state.drawerOpen;
    },
  },
});

export const {
  setCurrentPage,
  toggleDrawer,
  pushBreadcrumb,
  resetBreadcrumbTo,
} = templateSlice.actions;

export default templateSlice.reducer;
