import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LineItem } from '../types';

export interface LineItemTemplate {
  id: string;
  name: string;
  lineItems: Omit<LineItem, 'id'>[];
  createdAt: string;
}

interface TemplateStore {
  templates: LineItemTemplate[];
  addTemplate: (template: LineItemTemplate) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => LineItemTemplate | undefined;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      getTemplateById: (id) => {
        return get().templates.find((t) => t.id === id);
      },
    }),
    {
      name: 'line-item-templates',
    }
  )
);
