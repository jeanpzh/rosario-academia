import { create } from "zustand";

interface ModalState {
  modalOpen: boolean;
  modalId: string | null;
  entity: "assistant" | "athlete" | null;
  mode: "create" | "edit";
  currentItem: any | null;
  id: string;
  setModalOpen: (modalId: string, open: boolean) => void;
  setEntity: (entity: "assistant" | "athlete" | null) => void;
  setMode: (mode: "create" | "edit") => void;
  setCurrentItem: (item: any) => void;
  setId: (id: string) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalOpen: false,
  modalId: null,
  entity: null,
  mode: "create",
  currentItem: null,
  id: "",
  setModalOpen: (modalId, open) =>
    set(() => ({
      modalOpen: open,
      modalId: open ? modalId : null,
    })),
  setEntity: (entity) => set({ entity }),
  setMode: (mode) => set({ mode }),
  setCurrentItem: (item) => set({ currentItem: item }),
  setId: (id) => set({ id }),
}));
